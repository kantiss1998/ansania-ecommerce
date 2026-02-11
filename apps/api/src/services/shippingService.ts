/**
 * Shipping Service
 * Handles shipping cost calculation, rate caching, and integration with J&T Express
 */

import { Address, Cart, CartItem, ProductVariant, Product, ShippingCostsCache } from '@repo/database';
import { NotFoundError, AppError } from '@repo/shared/errors';
import { Op } from 'sequelize';

import { jntClient, JNTRateResponse } from '../integrations/jnt/client';

// Default warehouse location (can be configured via CMS)
const WAREHOUSE_CITY = process.env.JNT_WAREHOUSE_CITY || 'Jakarta Utara';
const WAREHOUSE_DISTRICT = process.env.JNT_WAREHOUSE_DISTRICT || '';

/**
 * Calculate shipping cost for a cart to a specific address
 */
export async function calculateShipping(addressId: number, cartId: number): Promise<JNTRateResponse[]> {
    const address = await Address.findByPk(addressId);
    if (!address) throw new NotFoundError('Shipping Address');

    const cart = await Cart.findByPk(cartId, {
        include: [{
            model: CartItem,
            as: 'items',
            include: [{
                model: ProductVariant,
                as: 'productVariant',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        }]
    });

    if (!cart) throw new NotFoundError('Cart');
    if (!cart.items || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
    }

    // Calculate total weight
    let totalWeightGrams = 0;
    const items = cart.items || [];

    for (const item of items) {
        const variant = item.productVariant;
        const product = variant?.product;

        // Get weight from product (assuming weight is in grams)
        let itemWeight = 500; // Default 500g if not specified

        if (product && product.weight) {
            itemWeight = Number(product.weight);
        }

        totalWeightGrams += itemWeight * item.quantity;
    }

    const totalWeightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000)); // Minimum 1kg

    console.log(`[SHIPPING] Calculating for cart ${cartId} to address ${addressId}`);
    console.log(`[SHIPPING] Total weight: ${totalWeightGrams}g (${totalWeightKg}kg)`);

    // Check Cache
    const cached = await checkShippingCache(
        WAREHOUSE_CITY,
        address.city,
        totalWeightKg
    );

    if (cached && cached.length > 0) {
        console.log(`[SHIPPING] Using cached rates (${cached.length} services)`);
        return cached;
    }

    // Call J&T API
    try {
        const rates = await jntClient.checkRates({
            origin_city: WAREHOUSE_CITY,
            origin_district: WAREHOUSE_DISTRICT,
            destination_city: address.city,
            destination_district: address.district || '',
            weight: totalWeightKg
        });

        console.log(`[SHIPPING] Got ${rates.length} rates from J&T`);

        // Cache the results
        await cacheShippingRates(
            WAREHOUSE_CITY,
            address.city,
            totalWeightKg,
            rates
        );

        return rates;

    } catch (error) {
        console.error('[SHIPPING] Error calculating shipping:', error);
        throw new AppError(
            'Failed to calculate shipping cost. Please try again.',
            500
        );
    }
}

/**
 * Check if shipping cost is cached
 */
async function checkShippingCache(
    originCity: string,
    destinationCity: string,
    weight: number
): Promise<JNTRateResponse[] | null> {

    try {
        const cached = await ShippingCostsCache.findAll({
            where: {
                origin_city_id: originCity, // Simplified: using city name as ID
                destination_city_id: destinationCity,
                weight: weight,
                expires_at: { [Op.gt]: new Date() }
            }
        });

        if (cached && cached.length > 0) {
            return cached.map(c => ({
                service: c.service,
                serviceName: `J&T ${c.service}`,
                price: Number(c.cost),
                etd: c.etd || 'Unknown'
            }));
        }

        return null;
    } catch (error) {
        console.error('[SHIPPING] Error checking cache:', error);
        return null;
    }
}

/**
 * Cache shipping rates for 24 hours
 */
async function cacheShippingRates(
    originCity: string,
    destinationCity: string,
    weight: number,
    rates: JNTRateResponse[]
): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour cache

    try {
        // Delete old cache entries for this route
        await ShippingCostsCache.destroy({
            where: {
                origin_city_id: originCity,
                destination_city_id: destinationCity,
                weight: weight
            }
        });

        // Create new cache entries
        const cacheEntries = rates.map(rate => ({
            origin_city_id: originCity,
            destination_city_id: destinationCity,
            courier: 'JNT',
            service: rate.service,
            weight: weight,
            cost: rate.price,
            etd: rate.etd,
            cached_at: new Date(),
            expires_at: expiresAt
        }));

        await ShippingCostsCache.bulkCreate(cacheEntries as any);
        console.log(`[SHIPPING] Cached ${rates.length} rates until ${expiresAt.toISOString()}`);

    } catch (error) {
        console.error('[SHIPPING] Error caching rates:', error);
        // Non-fatal error, continue without caching
    }
}

/**
 * Track shipment by waybill number
 */
export async function trackShipment(waybillNumber: string) {
    try {
        const tracking = await jntClient.trackOrder(waybillNumber);
        return tracking;
    } catch (error) {
        console.error('[SHIPPING] Error tracking shipment:', error);
        throw new AppError('Failed to track shipment', 500);
    }
}

/**
 * Get list of provinces
 */
export async function getProvinces() {
    try {
        const provinces = await jntClient.getProvinces();
        return provinces;
    } catch (error) {
        console.error('[SHIPPING] Error getting provinces:', error);
        throw new AppError('Failed to get provinces', 500);
    }
}

/**
 * Get list of cities (optionally filtered by province)
 */
export async function getCities(provinceId?: number) {
    try {
        const cities = await jntClient.getCities(provinceId);
        return cities;
    } catch (error) {
        console.error('[SHIPPING] Error getting cities:', error);
        throw new AppError('Failed to get cities', 500);
    }
}
/**
 * Get list of available couriers
 */
export async function getCouriers() {
    // Currently we only integration with J&T, but we can expand this
    return [
        {
            code: 'JNT',
            name: 'J&T Express',
            description: 'Fast and reliable shipping across Indonesia',
            logo_url: '/images/couriers/jnt.png'
        }
    ];
}

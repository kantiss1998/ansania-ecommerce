
import { Order, OrderItem, Cart, CartItem, ProductVariant, Product, sequelize, Shipping, Address, Voucher, VoucherUsage, Payment } from '@repo/database';
import { WhereOptions } from 'sequelize';
import { CreateOrderDTO } from '@repo/shared/schemas';
import { AppError, NotFoundError, InsufficientStockError } from '@repo/shared/errors';
import { generateOrderNumber } from '@repo/shared/utils';
import { calculateShipping } from './shippingService';

export async function createOrder(userId: number, data: CreateOrderDTO) {
    const transaction = await sequelize.transaction();

    try {
        // 1. Get Cart
        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: ProductVariant,
                        as: 'productVariant',
                        include: [{ model: Product, as: 'product' }]
                    }]
                }
            ],
            transaction
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            throw new AppError('Cart is empty', 400);
        }

        // 2. Validate Stock and Calculate Subtotal
        let subtotal = 0;
        for (const item of cart.items) {
            const variant = item.productVariant;
            if (!variant) throw new NotFoundError(`Product Variant for item ${item.id}`);

            if (variant.stock < item.quantity) {
                throw new InsufficientStockError(variant.sku);
            }
            subtotal += Number(item.subtotal);
        }

        // 3. Calculate Shipping Cost
        // We re-calculate to ensure it's valid, though it might be expensive.
        // Or we trust frontend? No, backend must validate.
        // We use the same helper but we might need to Mock it or be careful with internal calls if they don't support transaction?
        // `calculateShipping` uses `findByPk` without transaction. It's read-only, so mostly fine, but ideally consistent.
        // Let's call it.
        const shippingRates = await calculateShipping(data.shipping_address_id, cart.id);
        const selectedRate = shippingRates.find((r: any) => r.service === data.shipping_service);

        if (!selectedRate) {
            throw new AppError('Invalid shipping service selected', 400);
        }

        const shippingCost = selectedRate.price;
        const discountAmount = Number(cart.discount_amount) || 0;
        const totalAmount = subtotal + shippingCost - discountAmount;

        // 4. Create Order
        const orderNumber = generateOrderNumber(); // You need to implement this util or import
        const order = await Order.create({
            user_id: userId,
            order_number: orderNumber,
            status: 'pending_payment',
            payment_status: 'pending',
            subtotal,
            shipping_cost: shippingCost,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            customer_note: data.customer_note,
        }, { transaction });

        // Fetch Shipping Address Snapshot
        const shippingAddress = await Address.findByPk(data.shipping_address_id, { transaction });
        if (!shippingAddress) throw new NotFoundError('Shipping Address');

        // Create Shipping Record
        // Create Shipping Record
        await Shipping.create({
            order_id: order.id,
            recipient_name: shippingAddress.recipient_name,
            phone: shippingAddress.phone,
            address: `${shippingAddress.address_line1} ${shippingAddress.address_line2 || ''}`.trim(),
            city: shippingAddress.city,
            province: shippingAddress.province,
            postal_code: shippingAddress.postal_code,
            courier: (selectedRate as any).courier_name || 'JNT', // Assuming JNT if not specified
            service: selectedRate.service,
            cost: shippingCost,
            estimated_delivery: selectedRate.etd // e.g., "2-3 Days"
        }, { transaction });

        // 5. Create Order Items and Update Stock
        for (const item of cart.items) {
            const variant = item.productVariant;

            await OrderItem.create({
                order_id: order.id,
                product_id: variant.product_id,
                product_variant_id: variant.id,
                product_name: variant.product.name,
                variant_name: variant.option1_value ? `${variant.option1_value} ${variant.option2_value || ''}`.trim() : null,
                sku: variant.sku,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal
            }, { transaction });

            // Decrement Stock
            await variant.update({
                stock: variant.stock - item.quantity
            }, { transaction });
        }

        // 6. Clear Cart & Log Voucher Usage
        if (cart.voucher_id) {
            const voucher = await Voucher.findByPk(cart.voucher_id, { transaction });
            if (voucher) {
                // Increment usage count on voucher (assuming method exists or do it manually)
                // voucher.increment('used_count', { transaction }); // Sequelize helper or manual update
                // Manual update to be safe with types
                await voucher.update({ usage_count: (voucher.usage_count || 0) + 1 }, { transaction });

                // Create Usage Record
                await VoucherUsage.create({
                    voucher_id: voucher.id,
                    user_id: userId,
                    order_id: order.id,
                    used_at: new Date()
                }, { transaction });
            }
        }

        await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
        await cart.update({
            subtotal: 0,
            discount_amount: 0,
            total: 0,
            voucher_id: null
        }, { transaction });

        await transaction.commit();
        return order;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export async function getUserOrders(userId: number, page: number = 1, limit: number = 10, status?: string) {
    const offset = (page - 1) * limit;
    const whereClause: WhereOptions = { user_id: userId };

    if (status && status !== 'all') {
        whereClause.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['created_at', 'DESC']],
        include: [
            {
                model: OrderItem,
                as: 'items',
                // Assuming OrderItem has association to ProductVariant or Product to get details if needed
                // For now, OrderItem has snapshot data (product_name, etc) so we might not need deep include for list view
            },
            {
                model: Payment,
                as: 'payment'
            }
        ],
        distinct: true
    });

    return {
        data: rows,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };
}

export async function getOrderDetail(userId: number, orderNumber: string) {
    const order = await Order.findOne({
        where: {
            order_number: orderNumber,
            user_id: userId
        },
        include: [
            {
                model: OrderItem,
                as: 'items',
                // If specific relations are missing, we rely on snapshot data in OrderItem
            },
            {
                model: Payment,
                as: 'payment'
            },
            {
                model: Shipping,
                as: 'shipping'
            }
        ]
    });

    if (!order) {
        throw new NotFoundError('Order not found');
    }

    return order;
}

// Validate checkout before creating order
export async function validateCheckout(userId: number, data: any): Promise<any> {
    // Get Cart
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{
            model: CartItem,
            as: 'items',
            include: [{
                model: ProductVariant,
                as: 'productVariant',
                include: [{ model: Product, as: 'product' }]
            }]
        }]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
        return {
            valid: false,
            errors: ['Cart is empty']
        };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate stock availability
    for (const item of cart.items) {
        const variant = item.productVariant;
        if (!variant) {
            errors.push(`Product variant not found for item ${item.id}`);
            continue;
        }

        if (variant.stock < item.quantity) {
            errors.push(`Insufficient stock for ${variant.product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`);
        }

        if (variant.stock < 5) {
            warnings.push(`Low stock for ${variant.product.name}`);
        }
    }

    // Validate shipping address if provided
    if (data.shipping_address_id) {
        const address = await Address.findOne({
            where: { id: data.shipping_address_id, user_id: userId }
        });

        if (!address) {
            errors.push('Invalid shipping address');
        }
    } else {
        errors.push('Shipping address is required');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        cart: {
            items_count: cart.items.length,
            subtotal: cart.subtotal,
            total: cart.total
        }
    };
}

// Cancel an order
export async function cancelOrder(userId: number, orderNumber: string) {
    const order = await Order.findOne({
        where: {
            order_number: orderNumber,
            user_id: userId
        },
        include: [{
            model: OrderItem,
            as: 'items',
            include: [{
                model: ProductVariant,
                as: 'productVariant'
            }]
        }]
    });

    if (!order) {
        throw new NotFoundError('Order not found');
    }

    // Can only cancel pending or processing orders
    if (!['pending_payment', 'processing'].includes(order.status)) {
        throw new AppError('Order cannot be cancelled in current status', 400);
    }

    const transaction = await sequelize.transaction();

    try {
        // Restore stock
        const items = order.items || [];
        for (const item of items) {
            if (item.productVariant) {
                await item.productVariant.update({
                    stock: item.productVariant.stock + item.quantity
                }, { transaction });
            }
        }

        // Update order status
        await order.update({
            status: 'cancelled',
            cancelled_at: new Date()
        }, { transaction });

        await transaction.commit();
        return order;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}



import { ProductStock, ProductVariant, Product } from '@repo/database';
import { Op } from 'sequelize';

export async function getStockByWarehouse(warehouseId: number) {
    return ProductStock.findAll({
        where: { odoo_warehouse_id: warehouseId },
        include: [{
            model: ProductVariant,
            as: 'productVariant',
            include: [{ model: Product, as: 'product' }]
        }]
    });
}

/**
 * Find the nearest warehouse with available stock
 * (Placeholder for real geolocated logic)
 */
export async function findOptimalWarehouse(productId: number, _latitude?: number, _longitude?: number) {
    const variants = await ProductVariant.findAll({
        where: { product_id: productId },
        include: [{
            model: ProductStock,
            as: 'inventory',
            where: { available_quantity: { [Op.gt]: 0 } }
        }]
    });

    if (variants.length === 0) return null;

    // For now, return the one with most stock
    const bestVariant = variants.sort((a, b) =>
        ((a as any).inventory?.available_quantity || 0) - ((b as any).inventory?.available_quantity || 0)
    )[0];

    return (bestVariant as any).inventory?.odoo_warehouse_id;
}

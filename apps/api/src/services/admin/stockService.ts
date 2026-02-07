
import { ProductVariant, Product, ProductStock } from '@repo/database';
import { Op } from 'sequelize';

/**
 * List stock levels with filtering for low/out of stock
 */
export async function listStockLevels(query: any) {
    const {
        page = 1,
        limit = 10,
        search,
        lowStockThreshold = 10,
        status
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
        where[Op.or] = [
            { sku: { [Op.like]: `%${search}%` } },
            { '$product.name$': { [Op.like]: `%${search}%` } }
        ];
    }

    const includeStock: any = { model: ProductStock, as: 'inventory' };

    if (status === 'low') {
        includeStock.where = { available_quantity: { [Op.lte]: lowStockThreshold, [Op.gt]: 0 } };
    } else if (status === 'out') {
        includeStock.where = { available_quantity: { [Op.lte]: 0 } };
    }

    const { count, rows } = await ProductVariant.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['sku', 'ASC']],
        include: [
            { model: Product, as: 'product', attributes: ['name'] },
            includeStock
        ],
        distinct: true
    });

    return {
        data: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
}

/**
 * Note: Manual update is removed. All stock must be synced from Odoo.
 */

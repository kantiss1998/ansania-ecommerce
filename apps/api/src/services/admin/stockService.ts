
import { ProductVariant, Product, ProductStock } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

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

    if (status === 'low') {
        where['$stock.available_quantity$'] = { [Op.lte]: lowStockThreshold };
    } else if (status === 'out') {
        where['$stock.available_quantity$'] = { [Op.lte]: 0 };
    }

    const { count, rows } = await ProductVariant.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['$stock.available_quantity$', 'ASC']],
        include: [
            { model: Product, as: 'product', attributes: ['name'] },
            { model: ProductStock, as: 'stock' }
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

export async function updateStock(variantId: number, quantity: number) {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) throw new NotFoundError('Variant');

    const [stock] = await ProductStock.findOrCreate({
        where: { product_variant_id: variantId },
        defaults: {
            product_variant_id: variantId,
            quantity: 0,
            reserved_quantity: 0,
            available_quantity: 0
        } as any
    });

    await stock.update({ quantity });

    // Also update variant cache for searchability
    await variant.update({ stock: stock.available_quantity });

    return stock;
}

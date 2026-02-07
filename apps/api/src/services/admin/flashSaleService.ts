
import { FlashSale, FlashSaleProduct, Product, ProductVariant } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

export async function listFlashSales(query: any) {
    const { page = 1, limit = 10, search, status } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }

    if (status === 'active') {
        where.is_active = true;
        where.end_date = { [Op.gt]: new Date() };
    } else if (status === 'expired') {
        where.end_date = { [Op.lt]: new Date() };
    }

    const { count, rows } = await FlashSale.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['start_date', 'DESC']]
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

export async function getFlashSaleDetail(id: number) {
    const flashSale = await FlashSale.findByPk(id, {
        include: [{
            model: FlashSaleProduct,
            as: 'products' as any,
            include: [
                { model: Product, as: 'product' as any, attributes: ['name', 'slug'] },
                { model: ProductVariant, as: 'variant' as any }
            ]
        }]
    });

    if (!flashSale) throw new NotFoundError('FlashSale');
    return flashSale;
}

export async function createFlashSale(data: any) {
    return FlashSale.create(data);
}

export async function updateFlashSale(id: number, data: any) {
    const flashSale = await FlashSale.findByPk(id);
    if (!flashSale) throw new NotFoundError('FlashSale');

    await flashSale.update(data);
    return flashSale;
}

export async function deleteFlashSale(id: number) {
    const flashSale = await FlashSale.findByPk(id);
    if (!flashSale) throw new NotFoundError('FlashSale');

    await flashSale.destroy();
    return { success: true };
}

export async function addProductsToFlashSale(flashSaleId: number, products: any[]) {
    const flashSale = await FlashSale.findByPk(flashSaleId);
    if (!flashSale) throw new NotFoundError('FlashSale');

    const flashSaleProducts = products.map(p => ({
        ...p,
        flash_sale_id: flashSaleId
    }));

    return FlashSaleProduct.bulkCreate(flashSaleProducts);
}

export async function removeProductFromFlashSale(id: number) {
    const flashSaleProduct = await FlashSaleProduct.findByPk(id);
    if (!flashSaleProduct) throw new NotFoundError('FlashSaleProduct');

    await flashSaleProduct.destroy();
    return { success: true };
}

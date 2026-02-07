
import { Product, ProductVariant, ProductImage, Category, sequelize } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';
import { slugify } from '@repo/shared/utils';

export async function listAdminProducts(query: any) {
    const {
        page = 1,
        limit = 10,
        search,
        category_id,
        status
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { sku: { [Op.like]: `%${search}%` } }
        ];
    }

    if (category_id) where.category_id = category_id;
    if (status === 'active') where.is_active = true;
    if (status === 'inactive') where.is_active = false;

    const { count, rows } = await Product.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
            { model: Category, as: 'category', attributes: ['name'] },
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false }
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

export async function createProduct(data: any) {
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.create({
            ...data,
            slug: data.slug || slugify(data.name),
            is_active: data.is_active ?? true
        }, { transaction });

        if (data.images && data.images.length > 0) {
            for (const img of data.images) {
                await ProductImage.create({
                    ...img,
                    product_id: product.id
                }, { transaction });
            }
        }

        await transaction.commit();
        return product;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export async function updateProduct(id: number, data: any) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    await product.update(data);
    return product;
}

export async function deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    // Soft delete or hide
    await product.update({ is_active: false });
    return { success: true };
}

export async function addVariant(productId: number, data: any) {
    const product = await Product.findByPk(productId);
    if (!product) throw new NotFoundError('Product');

    const variant = await ProductVariant.create({
        ...data,
        product_id: productId
    });

    return variant;
}

export async function updateVariant(variantId: number, data: any) {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) throw new NotFoundError('Variant');

    await variant.update(data);
    return variant;
}

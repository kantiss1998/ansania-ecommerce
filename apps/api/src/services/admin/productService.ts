
import { Product, ProductVariant, ProductImage, Category } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

/**
 * List products for admin with filtering and pagination
 */
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
            { model: ProductImage, as: 'images', attributes: ['id', 'image_url', 'is_primary'] }
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
 * Get product details for admin
 */
export async function getProductDetail(id: number) {
    const product = await Product.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: ProductVariant, as: 'variants' },
            { model: ProductImage, as: 'images' }
        ]
    });

    if (!product) throw new NotFoundError('Product');
    return product;
}

/**
 * Toggle product active status (local visibility)
 */
export async function toggleActive(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    await product.update({ is_active: !product.is_active });
    return product;
}

/**
 * Toggle product featured status
 */
export async function toggleFeatured(id: number) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    await product.update({ is_featured: !product.is_featured });
    return product;
}

/**
 * Update product SEO fields
 */
export async function updateSEO(id: number, seoData: { meta_title?: string; meta_description?: string; slug?: string }) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    await product.update(seoData);
    return product;
}

/**
 * Update product short description (Managed locally if Odoo doesn't provide enough detail)
 */
export async function updateDescription(id: number, short_description: string) {
    const product = await Product.findByPk(id);
    if (!product) throw new NotFoundError('Product');

    await product.update({ short_description });
    return product;
}

/**
 * Image Management - Get all images for a product
 */
export async function getProductImages(productId: number) {
    return ProductImage.findAll({ where: { product_id: productId } });
}

/**
 * Image Management - Add new image
 */
export async function addProductImage(productId: number, imageUrl: string, is_primary: boolean = false) {
    if (is_primary) {
        // Reset existing primary images
        await ProductImage.update({ is_primary: false }, { where: { product_id: productId } });
    }

    return ProductImage.create({
        product_id: productId,
        image_url: imageUrl,
        is_primary
    } as any);
}

/**
 * Image Management - Delete image
 */
export async function deleteProductImage(imageId: number) {
    const image = await ProductImage.findByPk(imageId);
    if (!image) throw new NotFoundError('ProductImage');

    await image.destroy();
    return { success: true };
}

/**
 * Image Management - Set image as primary
 */
export async function setPrimaryImage(productId: number, imageId: number) {
    const image = await ProductImage.findByPk(imageId);
    if (!image || image.product_id !== productId) throw new NotFoundError('ProductImage');

    await ProductImage.update({ is_primary: false }, { where: { product_id: productId } });
    await image.update({ is_primary: true });

    return image;
}

/**
 * Get variants for a product
 */
export async function getProductVariants(productId: number) {
    return ProductVariant.findAll({ where: { product_id: productId } });
}

/**
 * Get detailed variant info
 */
export async function getVariantDetail(variantId: number) {
    const variant = await ProductVariant.findByPk(variantId, {
        include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }]
    });

    if (!variant) throw new NotFoundError('ProductVariant');
    return variant;
}


import { Wishlist, Product, ProductVariant, ProductImage } from '@repo/database';
import { AddToWishlistDTO, ListWishlistQuery } from '@repo/shared';
import { NotFoundError, ConflictError } from '@repo/shared/errors';

export async function addToWishlist(userId: number, data: AddToWishlistDTO) {
    // Check if product exists
    const product = await Product.findByPk(data.product_id);
    if (!product) throw new NotFoundError('Product');

    // Check if variant exists if provided
    if (data.product_variant_id) {
        const variant = await ProductVariant.findByPk(data.product_variant_id);
        if (!variant) throw new NotFoundError('Product Variant');
    }

    // Check for duplicates
    const existing = await Wishlist.findOne({
        where: {
            user_id: userId,
            product_id: data.product_id,
            product_variant_id: data.product_variant_id || null
        }
    });

    if (existing) {
        throw new ConflictError('Item already in wishlist');
    }

    const wishlistItem = await Wishlist.create({
        user_id: userId,
        product_id: data.product_id,
        product_variant_id: data.product_variant_id || null,
        created_at: new Date()
    });

    return wishlistItem;
}

export async function removeFromWishlist(userId: number, id: number) {
    const item = await Wishlist.findOne({ where: { id, user_id: userId } });
    if (!item) throw new NotFoundError('Wishlist Item');

    await item.destroy();
    return { success: true };
}

export async function getWishlist(userId: number, query: ListWishlistQuery) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Wishlist.findAndCountAll({
        where: { user_id: userId },
        include: [
            {
                model: Product,
                as: 'product',
                include: [{ model: ProductImage, as: 'images' }]
            },
            {
                model: ProductVariant,
                as: 'productVariant'
            }
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        items: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    };
}

import { WhereOptions } from 'sequelize';

export async function checkWishlist(userId: number, productId: number, variantId?: number) {
    const where: WhereOptions = {
        user_id: userId,
        product_id: productId
    };
    if (variantId) (where as any).product_variant_id = variantId;

    const item = await Wishlist.findOne({ where });
    return !!item;
}

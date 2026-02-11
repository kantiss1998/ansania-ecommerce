
import { Wishlist, Product, ProductVariant, ProductImage, ProductRatingsSummary } from '@repo/database';
import { AddToWishlistDTO, ListWishlistQuery } from '@repo/shared';
import { NotFoundError, ConflictError } from '@repo/shared/errors';
import { MappedProduct } from './productService';

export type MappedWishlistItem = Omit<Wishlist, 'product'> & {
    product: MappedProduct | null;
}

export interface WishlistListResult {
    items: MappedWishlistItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SuccessResponse {
    success: boolean;
    message?: string;
    [key: string]: any;
}

export async function addToWishlist(userId: number, data: AddToWishlistDTO): Promise<Wishlist> {
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

export async function removeFromWishlist(userId: number, id: number): Promise<SuccessResponse> {
    const item = await Wishlist.findOne({ where: { id, user_id: userId } });
    if (!item) throw new NotFoundError('Wishlist Item');

    await item.destroy();
    return { success: true };
}

import { mapProduct } from './productService';

export async function getWishlist(userId: number, query: ListWishlistQuery): Promise<WishlistListResult> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Wishlist.findAndCountAll({
        where: { user_id: userId },
        include: [
            {
                model: Product,
                as: 'product',
                include: [
                    { model: ProductImage, as: 'images' },
                    { model: ProductRatingsSummary as any, as: 'ratingsSummary' }
                ]
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
        items: rows.map(row => {
            const data = row.toJSON() as any;
            return {
                ...data,
                product: mapProduct(data.product)
            } as MappedWishlistItem;
        }),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    };
}

import { WhereOptions, Op } from 'sequelize';

export async function checkWishlist(userId: number, productId: number, variantId?: number): Promise<boolean> {
    const where: WhereOptions = {
        user_id: userId,
        product_id: productId
    };
    if (variantId) (where as any).product_variant_id = variantId;

    const item = await Wishlist.findOne({ where });
    return !!item;
}

export async function moveToCart(userId: number, wishlistItemId: number): Promise<SuccessResponse> {
    // Find wishlist item
    const wishlistItem = await Wishlist.findOne({
        where: {
            id: wishlistItemId,
            user_id: userId
        },
        include: [
            {
                model: ProductVariant,
                as: 'productVariant'
            }
        ]
    });

    if (!wishlistItem) {
        throw new NotFoundError('Wishlist Item');
    }

    // Check if variant_id exists, if not get default variant from product
    let variantId = wishlistItem.product_variant_id;

    if (!variantId) {
        // Get first available variant for this product
        const variant = await ProductVariant.findOne({
            where: { product_id: wishlistItem.product_id, stock: { [Op.gt]: 0 } }
        });

        if (!variant) {
            throw new NotFoundError('Available Product Variant');
        }
        variantId = variant.id;
    }

    // Import cart service to add item to cart
    const cartService = await import('./cartService');

    // Add to cart
    await cartService.addToCart(userId, undefined, {
        product_variant_id: variantId,
        quantity: 1 // Default quantity when moving from wishlist
    });

    // Remove from wishlist
    await wishlistItem.destroy();

    return { success: true, message: 'Item moved to cart successfully' };
}

export async function clearWishlist(userId: number): Promise<SuccessResponse> {
    // Delete all wishlist items for the user
    const deletedCount = await Wishlist.destroy({
        where: { user_id: userId }
    });

    return {
        success: true,
        message: `Wishlist cleared successfully`,
        deletedCount
    };
}

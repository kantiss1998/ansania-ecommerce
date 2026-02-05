
import { SearchHistory, ProductView, Product, ProductImage } from '@repo/database';
import { literal, fn, col } from 'sequelize';

export async function recordSearch(userId: number | null, query: string, _ipAddress?: string) {
    if (!query || query.trim().length === 0) return;

    await SearchHistory.create({
        user_id: userId || null,
        search_query: query.trim(),
    } as any);
}

export async function recordProductView(userId: number | null, productId: number, ipAddress?: string) {
    // @ts-ignore
    await ProductView.create({
        user_id: userId || null,
        product_id: productId,
        ip_address: ipAddress || null
    });
}

export async function getTopSearches(limit: number = 10) {
    return SearchHistory.findAll({
        attributes: [
            ['search_query', 'query'],
            [fn('COUNT', col('id')), 'count']
        ],
        group: ['search_query'],
        order: [[literal('count'), 'DESC']],
        limit
    } as any);
}

export async function getMostViewedProducts(limit: number = 10) {
    return ProductView.findAll({
        attributes: [
            'product_id',
            [fn('COUNT', col('id')), 'view_count']
        ],
        include: [
            {
                model: Product,
                as: 'product',
                include: [{ model: ProductImage, as: 'images' }]
            }
        ],
        group: ['product_id'],
        order: [[literal('view_count'), 'DESC']],
        limit
    } as any);
}

import { Product, ProductImage, ProductVariant } from '@repo/database';
import { Op } from 'sequelize';
import { SEARCH_WEIGHTS, PAGINATION } from '@repo/shared/constants';
import { calculatePagination } from '@repo/shared/utils';

/**
 * Enhanced search with weighted ranking
 * Priority: 
 * 1. Exact SKU match (Weight 10)
 * 2. Exact Name match (Weight 8)
 * 3. Name contains query (Weight 5)
 * 4. Description contains query (Weight 2)
 */
export async function enhancedSearch(query: string, options: any = {}) {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, minPrice, maxPrice, categoryId } = options;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {
        is_active: true,
        [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
            { sku: { [Op.like]: `%${query}%` } }
        ]
    };

    if (minPrice) where.selling_price = { [Op.gte]: minPrice };
    if (maxPrice) where.selling_price = { ...where.selling_price, [Op.lte]: maxPrice };
    if (categoryId) where.category_id = categoryId;

    const products = await Product.findAll({
        where,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
        ]
    });

    // Ranking Logic
    const rankedProducts = products.map(product => {
        let score = 0;
        const lowerName = product.name.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (product.sku === query) score += SEARCH_WEIGHTS.SKU;
        if (lowerName === lowerQuery) score += SEARCH_WEIGHTS.FULL_NAME;
        else if (lowerName.includes(lowerQuery)) score += SEARCH_WEIGHTS.PARTIAL_NAME;

        if (product.description?.toLowerCase().includes(lowerQuery)) score += SEARCH_WEIGHTS.DESCRIPTION;

        return { product, score };
    });

    // Sort by score
    const sorted = rankedProducts.sort((a, b) => b.score - a.score);

    // Pagination
    const paginated = sorted.slice(offset, offset + limit);

    const pagination = calculatePagination(Number(page), Number(limit), sorted.length);

    return {
        data: paginated.map(p => p.product),
        ...pagination
    };
}

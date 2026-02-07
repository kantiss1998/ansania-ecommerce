
import { Product, ProductImage, ProductVariant } from '@repo/database';
import { Op } from 'sequelize';

/**
 * Enhanced search with weighted ranking
 * Priority: 
 * 1. Exact SKU match (Weight 10)
 * 2. Exact Name match (Weight 8)
 * 3. Name contains query (Weight 5)
 * 4. Description contains query (Weight 2)
 */
export async function enhancedSearch(query: string, options: any = {}) {
    const { page = 1, limit = 20, minPrice, maxPrice, categoryId } = options;
    const offset = (page - 1) * limit;

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

        if (product.sku === query) score += 10;
        if (lowerName === lowerQuery) score += 8;
        else if (lowerName.includes(lowerQuery)) score += 5;

        if (product.description?.toLowerCase().includes(lowerQuery)) score += 2;

        return { product, score };
    });

    // Sort by score
    const sorted = rankedProducts.sort((a, b) => b.score - a.score);

    // Pagination
    const paginated = sorted.slice(offset, offset + limit);

    return {
        data: paginated.map(p => p.product),
        meta: {
            total: sorted.length,
            page,
            limit,
            totalPages: Math.ceil(sorted.length / limit)
        }
    };
}

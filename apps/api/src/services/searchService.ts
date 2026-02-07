import { Product, ProductImage, ProductVariant, Category, SearchHistory } from '@repo/database';
import { Op } from 'sequelize';

// Main search with filters
export async function searchProducts(query: {
    q: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}) {
    const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const whereClause: any = {
        is_active: true,
        [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
            { sku: { [Op.like]: `%${q}%` } }
        ]
    };

    if (minPrice !== undefined) {
        whereClause.selling_price = { [Op.gte]: minPrice };
    }
    if (maxPrice !== undefined) {
        whereClause.selling_price = { ...whereClause.selling_price, [Op.lte]: maxPrice };
    }

    const include: any[] = [
        { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
        { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
    ];

    if (category) {
        const cat = await Category.findOne({ where: { slug: category } });
        if (cat) {
            whereClause.category_id = cat.id;
        }
    }

    const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include,
        limit,
        offset,
        distinct: true,
        order: [['name', 'ASC']]
    });

    return {
        products: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    };
}

// Autocomplete search (returns product names only)
export async function autocompleteSearch(query: string, limit: number = 10) {
    const products = await Product.findAll({
        where: {
            is_active: true,
            name: { [Op.like]: `%${query}%` }
        },
        attributes: ['id', 'name', 'slug', 'selling_price'],
        limit,
        order: [['name', 'ASC']]
    });

    return products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.selling_price
    }));
}

// Advanced search with multiple filters
export async function advancedSearch(filters: {
    keywords?: string;
    categories?: number[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isFeatured?: boolean;
    isNew?: boolean;
    hasDiscount?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest' | 'rating';
}) {
    const {
        keywords,
        categories,
        minPrice,
        maxPrice,
        minRating,
        isFeatured,
        isNew,
        hasDiscount,
        page = 1,
        limit = 20,
        sortBy = 'newest'
    } = filters;

    const offset = (page - 1) * limit;
    const whereClause: any = { is_active: true };

    if (keywords) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${keywords}%` } },
            { description: { [Op.like]: `%${keywords}%` } }
        ];
    }

    if (categories && categories.length > 0) {
        whereClause.category_id = { [Op.in]: categories };
    }

    if (minPrice !== undefined) {
        whereClause.selling_price = { [Op.gte]: minPrice };
    }
    if (maxPrice !== undefined) {
        whereClause.selling_price = { ...whereClause.selling_price, [Op.lte]: maxPrice };
    }

    if (minRating !== undefined) {
        whereClause.average_rating = { [Op.gte]: minRating };
    }

    if (isFeatured !== undefined) {
        whereClause.is_featured = isFeatured;
    }

    if (isNew !== undefined) {
        whereClause.is_new = isNew;
    }

    if (hasDiscount) {
        whereClause.discount_price = { [Op.not]: null };
    }

    // Sorting
    let order: any = [['created_at', 'DESC']];
    if (sortBy === 'price_asc') order = [['selling_price', 'ASC']];
    if (sortBy === 'price_desc') order = [['selling_price', 'DESC']];
    if (sortBy === 'name_asc') order = [['name', 'ASC']];
    if (sortBy === 'rating') order = [['average_rating', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false },
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
        ],
        limit,
        offset,
        distinct: true,
        order
    });

    return {
        products: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        filters: {
            keywords,
            categories,
            priceRange: { min: minPrice, max: maxPrice },
            minRating,
            isFeatured,
            isNew,
            hasDiscount
        }
    };
}

// Delete search history for a user
export async function deleteSearchHistory(userId: number) {
    await SearchHistory.destroy({
        where: { user_id: userId }
    });

    return { success: true, message: 'Search history cleared' };
}

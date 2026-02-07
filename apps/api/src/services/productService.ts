
import { Product, ProductVariant, Category, ProductImage } from '@repo/database';
import { ListProductsQuery } from '@repo/shared/schemas';
import { Op, Includeable, Order } from 'sequelize';
import { sequelize } from '@repo/database';

export async function listProducts(query: ListProductsQuery) {
    const {
        page = 1,
        limit = 10,
        sort = 'newest',
        category,
        search,
        price_min,
        price_max,
        is_featured,
        is_new,
        has_discount,
        excludeId,
    } = query;

    const offset = (page - 1) * limit;
    // WhereOptions in strict mode might not allow direct symbol indexing without specific Record definition
    // or we cast it when assigning Op.or
    const whereClause: Record<string | symbol, any> = { is_active: true };

    if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
    }

    if (search) {
        whereClause[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
        ];
    }

    if (price_min !== undefined) {
        whereClause.selling_price = { ...whereClause.selling_price, [Op.gte]: price_min };
    }
    if (price_max !== undefined) {
        whereClause.selling_price = { ...whereClause.selling_price, [Op.lte]: price_max };
    }

    if (is_featured !== undefined) {
        whereClause.is_featured = is_featured;
    }

    if (is_new !== undefined) {
        whereClause.is_new = is_new;
    }

    if (has_discount) {
        whereClause.discount_price = { [Op.not]: null };
    }

    // Includes filtering
    const include: Includeable[] = [
        { model: ProductImage, as: 'images', attributes: ['image_url', 'is_primary'] },
        {
            model: ProductVariant,
            as: 'variants',
            where: { is_visible: true },
            required: false
        }
    ];

    if (category) {
        const cat = await Category.findOne({ where: { slug: category } });
        if (cat) {
            whereClause.category_id = cat.id;
            include.push({ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] });
        } else {
            // If category not found, return empty or ignore? 
            // Ideally return empty, so let's set an impossible ID
            whereClause.category_id = -1;
        }
    } else {
        include.push({ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] });
    }

    // Sorting
    let order: Order = [['created_at', 'DESC']]; // default newest
    if (sort === 'price_asc') order = [['selling_price', 'ASC']];
    if (sort === 'price_desc') order = [['selling_price', 'DESC']];
    if (sort === 'name_asc') order = [['name', 'ASC']];
    if (sort === 'name_desc') order = [['name', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include,
        distinct: true, // for correct count with includes
        limit,
        offset,
        order,
    });

    return {
        products: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
    };
}

export async function getDistinctAttributes(attribute: 'color' | 'size' | 'finishing') {
    // Check if column exists in ProductVariant
    const variants = await ProductVariant.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col(attribute)), attribute]],
        where: {
            [attribute]: { [Op.not]: null }
        },
        order: [[attribute, 'ASC']],
        raw: true,
    });

    return variants.map((v: any) => v[attribute]).filter(Boolean);
}

export async function getProductBySlug(slug: string) {
    const product = await Product.findOne({
        where: { slug, is_active: true },
        include: [
            { model: Category, as: 'category' },
            { model: ProductImage, as: 'images' },
            { model: ProductVariant, as: 'variants', include: [{ model: Product, as: 'product' }] } // Nested include just to check syntax
        ],
    });

    // Clean up variant include if needed

    return product;
}

export async function getRelatedProducts(productId: number, limit: number = 4) {
    const product = await Product.findByPk(productId);
    if (!product) return [];

    const related = await Product.findAll({
        where: {
            category_id: product.category_id,
            id: { [Op.ne]: productId }, // Exclude self
            is_active: true
        },
        limit,
        include: [
            { model: ProductImage, as: 'images', attributes: ['image_url', 'is_primary'] },
            { model: Category, as: 'category' } // Useful context
        ],
        order: sequelize.random() // Random selection for variety
    });

    return related;
}

// Get featured products
export async function getFeaturedProducts(limit: number = 10) {
    const products = await Product.findAll({
        where: {
            is_featured: true,
            is_active: true
        },
        limit,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
        ],
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });

    return products;
}

// Get new arrivals (products created within last N days)
export async function getNewArrivals(limit: number = 10, days: number = 30) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const products = await Product.findAll({
        where: {
            is_active: true,
            created_at: { [Op.gte]: dateThreshold }
        },
        limit,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
        ],
        order: [['created_at', 'DESC']]
    });

    return products;
}

// Get all variants for a product
export async function getProductVariants(productId: number) {
    const product = await Product.findByPk(productId);
    if (!product) return null;

    const variants = await ProductVariant.findAll({
        where: {
            product_id: productId,
            is_visible: true
        },
        order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });

    return {
        product: {
            id: product.id,
            name: product.name,
            slug: product.slug
        },
        variants
    };
}

// Get recommended products (combination of featured + most viewed)
export async function getRecommendedProducts(limit: number = 10) {
    // For now, return featured + random popular products
    // In the future, this can be enhanced with ML recommendations
    const products = await Product.findAll({
        where: {
            is_active: true,
            [Op.or]: [
                { is_featured: true },
                { view_count: { [Op.gt]: 0 } }
            ]
        } as any,
        limit,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
        ],
        order: [
            ['is_featured', 'DESC'],
            ['view_count', 'DESC'] as any,
            sequelize.random()
        ]
    });

    return products;
}

// Get similar products (same category, similar price range)
export async function getSimilarProducts(productId: number, limit: number = 6) {
    const product = await Product.findByPk(productId);
    if (!product) return [];

    // Calculate price range (±20%)
    const priceMin = Number(product.selling_price) * 0.8;
    const priceMax = Number(product.selling_price) * 1.2;

    const similar = await Product.findAll({
        where: {
            category_id: product.category_id,
            id: { [Op.ne]: productId },
            is_active: true,
            selling_price: {
                [Op.between]: [priceMin, priceMax]
            }
        },
        limit,
        include: [
            { model: ProductImage, as: 'images', where: { is_primary: true }, required: false },
            { model: ProductVariant, as: 'variants', where: { is_visible: true }, required: false }
        ],
        order: sequelize.random()
    });

    return similar;
}

/**
 * Track a product view
 */
export async function trackProductView(productId: number) {
    const product = await Product.findByPk(productId);
    if (!product) throw new NotFoundError('Product');

    // Increment view_count
    product.view_count = (product.view_count || 0) + 1;
    await product.save();

    return product;
}

import { NotFoundError } from '@repo/shared/errors';

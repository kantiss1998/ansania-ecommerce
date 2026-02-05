
import { Product, ProductVariant, Category, ProductImage } from '@repo/database';
import { ListProductsQuery } from '@repo/shared/schemas';
import { Op } from 'sequelize';

export async function listProducts(query: ListProductsQuery) {
    const {
        page = 1,
        limit = 10,
        sort = 'newest',
        category,
        search,
        price_min,
        price_max,
    } = query;

    const offset = (page - 1) * limit;
    const whereClause: any = { is_active: true };

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

    // Include Category Filter
    // If category string is slug or id? Schema says string.
    if (category) {
        // Assume slug for now
        // We need to filter by associated category
        // But Sequelize with Includes and Where on include is tricky for counting
        // Simplified: Fetch Category ID first
        const cat = await Category.findOne({ where: { slug: category } });
        if (cat) {
            whereClause.category_id = cat.id;
        }
    }

    // Sorting
    let order: any[] = [['created_at', 'DESC']]; // default newest
    if (sort === 'price_asc') order = [['selling_price', 'ASC']];
    if (sort === 'price_desc') order = [['selling_price', 'DESC']];
    // TODO: popular/rating sorts need more relations

    const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
            { model: ProductImage, as: 'images', attributes: ['image_url', 'is_primary'] },
            {
                model: ProductVariant,
                as: 'variants',
                where: { is_visible: true },
                required: false, // Show products even if variant logic is somehow messing up, or maybe required true if we only sell variants
            }
        ],
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

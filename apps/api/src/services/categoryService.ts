import { Category, Product, ProductCategories, ProductVariant, ProductImage } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';

export interface CategoryNode extends Category {
    children: CategoryNode[];
}

export interface CategoryWithProducts {
    category: any;
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CategoryFilters {
    colors: string[];
    sizes: string[];
    finishings: string[];
    priceRange: { min: number; max: number };
}
export async function getCategoryTree(): Promise<CategoryNode[]> {
    const categories = await Category.findAll({
        where: { is_active: true },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    // Build tree structure
    const categoryMap = new Map<number, CategoryNode>();
    const rootCategories: CategoryNode[] = [];

    // First pass: create map
    categories.forEach(cat => {
        categoryMap.set(cat.id, {
            ...cat.toJSON(),
            children: []
        } as unknown as CategoryNode);
    });

    // Second pass: build hierarchy
    categories.forEach(cat => {
        const categoryData = categoryMap.get(cat.id);
        if (!categoryData) return;

        if (cat.parent_id) {
            const parent = categoryMap.get(cat.parent_id);
            if (parent) {
                parent.children.push(categoryData);
            }
        } else {
            rootCategories.push(categoryData);
        }
    });

    return rootCategories;
}

// Get category by slug with products
export async function getCategoryBySlug(slug: string, options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}): Promise<CategoryWithProducts> {
    const { page = 1, limit = 20, sortBy: _sortBy = 'name', order: _order = 'ASC' } = options || {};
    const offset = (page - 1) * limit;

    const category = await Category.findOne({
        where: { slug, is_active: true },
        include: [
            {
                model: Category,
                as: 'parent'
            },
            {
                model: Category,
                as: 'children',
                where: { is_active: true },
                required: false
            }
        ]
    });

    if (!category) {
        throw new NotFoundError('Category');
    }

    // Get all category IDs in this category tree (including subcategories)
    const categoryIds = await getAllSubcategoryIds(category.id);

    // Get products in this category and its subcategories
    const { count, rows: productRelations } = await ProductCategories.findAndCountAll({
        where: {
            category_id: { [Op.in]: categoryIds }
        },
        include: [
            {
                model: Product,
                as: 'product',
                where: { is_active: true },
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        where: { is_primary: true },
                        required: false
                    },
                    {
                        model: ProductVariant,
                        as: 'variants',
                        attributes: ['id', 'sku', 'price', 'stock'],
                        limit: 1
                    }
                ]
            }
        ],
        limit,
        offset,
        distinct: true
    });

    const products = productRelations.map((rel) => (rel as any).product as Product);

    return {
        category: category.toJSON(),
        products,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };
}

// Get available filters for a category
export async function getAvailableFilters(categoryId: number): Promise<CategoryFilters> {
    // Get all subcategory IDs
    const categoryIds = await getAllSubcategoryIds(categoryId);

    // Get all product IDs in these categories
    const productRelations = await ProductCategories.findAll({
        where: {
            category_id: { [Op.in]: categoryIds }
        },
        attributes: ['product_id']
    });

    const productIds = productRelations.map(rel => rel.product_id);

    if (productIds.length === 0) {
        return {
            colors: [],
            sizes: [],
            finishings: [],
            priceRange: { min: 0, max: 0 }
        };
    }

    // Get distinct attribute values from variants
    const variants = await ProductVariant.findAll({
        where: {
            product_id: { [Op.in]: productIds }
        },
        attributes: ['color', 'size', 'finishing', 'price']
    });

    const colors = new Set<string>();
    const sizes = new Set<string>();
    const finishings = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    variants.forEach(variant => {
        if (variant.color) colors.add(variant.color);
        if (variant.size) sizes.add(variant.size);
        if (variant.finishing) finishings.add(variant.finishing);

        const price = Number(variant.price);
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
    });

    return {
        colors: Array.from(colors).sort(),
        sizes: Array.from(sizes).sort(),
        finishings: Array.from(finishings).sort(),
        priceRange: {
            min: minPrice === Infinity ? 0 : minPrice,
            max: maxPrice
        }
    };
}

// Get immediate children of a category
export async function getCategoryChildren(categoryId: number): Promise<Category[]> {
    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new NotFoundError('Category');
    }

    const children = await Category.findAll({
        where: {
            parent_id: categoryId,
            is_active: true
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    return children;
}

// Helper: Get all subcategory IDs recursively
async function getAllSubcategoryIds(categoryId: number): Promise<number[]> {
    const ids = [categoryId];

    const children = await Category.findAll({
        where: { parent_id: categoryId },
        attributes: ['id']
    });

    for (const child of children) {
        const childIds = await getAllSubcategoryIds(child.id);
        ids.push(...childIds);
    }

    return ids;
}

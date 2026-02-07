
import { Category, Product } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

export async function listAdminCategories(query: any) {
    const { search, is_active } = query;
    const where: any = {};

    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
        where.is_active = is_active === 'true';
    }

    return Category.findAll({
        where,
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        include: [{ model: Category, as: 'parent', attributes: ['name'] }]
    });
}

export async function getCategoryDetail(id: number) {
    const category = await Category.findByPk(id, {
        include: [
            { model: Category, as: 'parent' },
            { model: Category, as: 'children' }
        ]
    });

    if (!category) throw new NotFoundError('Category');
    return category;
}

export async function updateCategory(id: number, data: any) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError('Category');

    // Limited updates: description, image_url, sort_order, is_active
    const { description, image_url, sort_order, is_active, meta_title, meta_description } = data;
    await category.update({ description, image_url, sort_order, is_active, meta_title, meta_description });
    return category;
}

export async function toggleCategoryActive(id: number) {
    const category = await Category.findByPk(id);
    if (!category) throw new NotFoundError('Category');
    await category.update({ is_active: !category.is_active });
    return category;
}

export async function getCategoryStats(id: number) {
    const productCount = await Product.count({ where: { category_id: id } });
    return { productCount };
}

export async function reorderCategories(orders: { id: number, order: number }[]) {
    for (const item of orders) {
        await Category.update({ sort_order: item.order }, { where: { id: item.id } });
    }
    return { success: true };
}

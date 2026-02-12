import { Category, Product } from "@repo/database";
import { NotFoundError } from "@repo/shared/errors";
import { Op } from "sequelize";

import { PaginatedResponse } from "@repo/shared";

export async function listAdminCategories(query: {
  search?: string;
  is_active?: string | boolean;
}): Promise<PaginatedResponse<Category>> {
  const { search, is_active } = query;
  const where: Record<string, unknown> = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  if (is_active !== undefined) {
    where.is_active = is_active === "true";
  }

  const { count, rows } = await Category.findAndCountAll({
    where,
    order: [
      ["sort_order", "ASC"],
      ["name", "ASC"],
    ],
    include: [{ model: Category, as: "parent", attributes: ["name"] }],
  });

  return {
    items: rows,
    pagination: {
      page: 1,
      limit: rows.length,
      total: count,
      totalPages: 1,
    },
  };
}

export async function getCategoryDetail(id: number): Promise<Category> {
  const category = await Category.findByPk(id, {
    include: [
      { model: Category, as: "parent" },
      { model: Category, as: "children" },
    ],
  });

  if (!category) throw new NotFoundError("Category");
  return category;
}

export async function updateCategory(
  id: number,
  data: Partial<Category>,
): Promise<Category> {
  const category = await Category.findByPk(id);
  if (!category) throw new NotFoundError("Category");

  // Limited updates: description, image_url, sort_order, is_active, SEO fields
  const {
    description,
    image_url,
    sort_order,
    is_active,
    meta_title,
    meta_description,
    keywords,
  } = data;
  await category.update({
    description,
    image_url,
    sort_order,
    is_active,
    meta_title,
    meta_description,
    keywords,
  });
  return category;
}

export async function toggleCategoryActive(id: number): Promise<Category> {
  const category = await Category.findByPk(id);
  if (!category) throw new NotFoundError("Category");
  await category.update({ is_active: !category.is_active });
  return category;
}

export async function getCategoryStats(
  id: number,
): Promise<{ productCount: number }> {
  const productCount = await Product.count({ where: { category_id: id } });
  return { productCount };
}

export async function reorderCategories(
  orders: { id: number; order: number }[],
): Promise<{ success: boolean }> {
  for (const item of orders) {
    await Category.update(
      { sort_order: item.order },
      { where: { id: item.id } },
    );
  }
  return { success: true };
}

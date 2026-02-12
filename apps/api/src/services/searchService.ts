import {
  Product,
  ProductImage,
  ProductVariant,
  Category,
  SearchHistory,
} from "@repo/database";
import { PAGINATION } from "@repo/shared/constants";
import { calculatePagination } from "@repo/shared/utils";
import { Op, Includeable, Order } from "sequelize";

import { MappedProduct, mapProduct } from "./productService";

export interface SearchResult {
  products: MappedProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters?: Record<string, unknown>;
}

// Main search with filters
export async function searchProducts(query: {
  q: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}): Promise<SearchResult> {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
  } = query;
  const offset = (Number(page) - 1) * Number(limit);

  const whereClause: Record<string | symbol, unknown> = {
    is_active: true,
    [Op.or]: [
      { name: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } },
      { sku: { [Op.like]: `%${q}%` } },
    ],
  };

  if (minPrice !== undefined) {
    whereClause.selling_price = { [Op.gte]: minPrice };
  }
  if (maxPrice !== undefined) {
    whereClause.selling_price = {
      ...(whereClause.selling_price as Record<string | symbol, unknown>),
      [Op.lte]: maxPrice,
    };
  }

  const include: Includeable[] = [
    {
      model: ProductImage,
      as: "images",
      where: { is_primary: true },
      required: false,
    },
    {
      model: ProductVariant,
      as: "variants",
      where: { is_visible: true },
      required: false,
    },
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
    limit: Number(limit),
    offset,
    distinct: true,
    order: [["name", "ASC"]],
  });

  const pagination = calculatePagination(Number(page), Number(limit), count);

  return {
    products: rows
      .map(mapProduct)
      .filter((p): p is MappedProduct => p !== null),
    ...pagination,
  };
}

// Autocomplete search (returns product names only)
export async function autocompleteSearch(
  query: string,
  limit: number = 10,
): Promise<{ id: number; name: string; slug: string; price: number }[]> {
  const products = await Product.findAll({
    where: {
      is_active: true,
      name: { [Op.like]: `%${query}%` },
    },
    attributes: ["id", "name", "slug", "selling_price"],
    limit,
    order: [["name", "ASC"]],
  });

  return products.map((p: Product) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.selling_price),
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
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "newest" | "rating";
}): Promise<SearchResult> {
  const {
    keywords,
    categories,
    minPrice,
    maxPrice,
    minRating,
    isFeatured,
    isNew,
    hasDiscount,
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sortBy = "newest",
  } = filters;

  const offset = (page - 1) * limit;
  const whereClause: Record<string | symbol, unknown> = { is_active: true };

  if (keywords) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${keywords}%` } },
      { description: { [Op.like]: `%${keywords}%` } },
    ];
  }

  if (categories && categories.length > 0) {
    whereClause.category_id = { [Op.in]: categories };
  }

  if (minPrice !== undefined) {
    whereClause.selling_price = { [Op.gte]: minPrice };
  }
  if (maxPrice !== undefined) {
    whereClause.selling_price = {
      ...(whereClause.selling_price as Record<string | symbol, unknown>),
      [Op.lte]: maxPrice,
    };
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
  let order: Order = [["created_at", "DESC"]];
  if (sortBy === "price_asc") order = [["selling_price", "ASC"]];
  if (sortBy === "price_desc") order = [["selling_price", "DESC"]];
  if (sortBy === "name_asc") order = [["name", "ASC"]];
  if (sortBy === "rating") order = [["average_rating", "DESC"]];

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: ProductImage,
        as: "images",
        where: { is_primary: true },
        required: false,
      },
      {
        model: ProductVariant,
        as: "variants",
        where: { is_visible: true },
        required: false,
      },
      { model: Category, as: "category", attributes: ["id", "name", "slug"] },
    ],
    limit,
    offset,
    distinct: true,
    order,
  });

  const pagination = calculatePagination(Number(page), Number(limit), count);

  return {
    products: rows
      .map(mapProduct)
      .filter((p): p is MappedProduct => p !== null),
    ...pagination,
    filters: {
      keywords,
      categories,
      priceRange: { min: minPrice, max: maxPrice },
      minRating,
      isFeatured,
      isNew,
      hasDiscount,
    },
  };
}

// Delete search history for a user
export async function deleteSearchHistory(
  userId: number,
): Promise<{ success: boolean; message: string }> {
  await SearchHistory.destroy({
    where: { user_id: userId },
  });

  return { success: true, message: "Search history cleared" };
}

/**
 * Record a search query
 */
export async function recordSearch(data: {
  query: string;
  filters?: Record<string, unknown>;
  results_count?: number;
  user_id?: number;
}): Promise<SearchHistory> {
  return SearchHistory.create({
    search_query: data.query,
    filters_applied: data.filters,
    results_count: data.results_count || 0,
    user_id: data.user_id,
  });
}

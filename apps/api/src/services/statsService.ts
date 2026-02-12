import {
  SearchHistory,
  ProductView,
  Product,
  ProductImage,
} from "@repo/database";
import { PAGINATION } from "@repo/shared/constants";
import { literal, fn, col } from "sequelize";

export async function recordSearch(
  userId: number | null,
  query: string,
  _ipAddress?: string,
) {
  if (!query || query.trim().length === 0) return;

  await SearchHistory.create({
    user_id: userId || null,
    search_query: query.trim(),
  });
}

export async function recordProductView(
  userId: number | null,
  productId: number,
  ipAddress?: string,
) {
  await ProductView.create({
    user_id: userId || null,
    product_id: productId,
    ip_address: ipAddress || null,
  });
}

export async function getTopSearches(limit: number = PAGINATION.DEFAULT_LIMIT) {
  return SearchHistory.findAll({
    attributes: [
      ["search_query", "query"],
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["search_query"],
    order: [[literal("count"), "DESC"]],
    limit,
  });
}

export async function getMostViewedProducts(
  limit: number = PAGINATION.DEFAULT_LIMIT,
) {
  return ProductView.findAll({
    attributes: ["product_id", [fn("COUNT", col("id")), "view_count"]],
    include: [
      {
        model: Product,
        as: "product",
        include: [{ model: ProductImage, as: "images" }],
      },
    ],
    group: ["product_id"],
    order: [[literal("view_count"), "DESC"]],
    limit,
  });
}

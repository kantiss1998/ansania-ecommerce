import { ProductVariant, Product, ProductStock } from "@repo/database";
import { NotFoundError } from "@repo/shared/errors";
import { Op, Includeable } from "sequelize";

export interface StockListResult {
  items: ProductVariant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * List stock levels with filtering for low/out of stock
 */
export async function listStockLevels(query: {
  page?: number | string;
  limit?: number | string;
  search?: string;
  lowStockThreshold?: number | string;
  status?: string;
}): Promise<StockListResult> {
  const {
    page = 1,
    limit = 10,
    search,
    lowStockThreshold = 10,
    status,
  } = query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: Record<string | symbol, unknown> = {};

  if (search) {
    where[Op.or] = [
      { sku: { [Op.like]: `%${search}%` } },
      { "$product.name$": { [Op.like]: `%${search}%` } },
    ];
  }

  const includeStock: Includeable = { model: ProductStock, as: "inventory" };

  if (status === "low") {
    includeStock.where = {
      available_quantity: { [Op.lte]: lowStockThreshold, [Op.gt]: 0 },
    };
  } else if (status === "out") {
    includeStock.where = { available_quantity: { [Op.lte]: 0 } };
  }

  const { count, rows } = await ProductVariant.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["sku", "ASC"]],
    include: [
      { model: Product, as: "product", attributes: ["name"] },
      includeStock,
    ],
    distinct: true,
  });

  return {
    items: rows,
    meta: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
}

export async function getVariantStock(
  variantId: number,
): Promise<ProductVariant> {
  const variant = await ProductVariant.findByPk(variantId, {
    include: [
      { model: Product, as: "product", attributes: ["name"] },
      { model: ProductStock, as: "inventory" },
    ],
  });
  if (!variant) throw new NotFoundError("ProductVariant");
  return variant;
}

export async function getLowStock(
  threshold: number = 10,
): Promise<StockListResult> {
  return listStockLevels({
    status: "low",
    lowStockThreshold: threshold,
    limit: 100,
  });
}

export async function getOutOfStock(): Promise<StockListResult> {
  return listStockLevels({ status: "out", limit: 100 });
}

export async function exportStock(
  query: Record<string, unknown>,
): Promise<ProductVariant[]> {
  const result = await listStockLevels({ ...query, limit: 1000, page: 1 });
  return result.items;
}

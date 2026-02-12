import {
  ProductView,
  SearchHistory,
  Product,
  Cart,
  Order,
  OrderItem,
  ProductVariant,
  Category,
} from "@repo/database";
import { PAYMENT_STATUS } from "@repo/shared/constants";
import { Op, fn, col, literal } from "sequelize";

export interface ConversionStats {
  totalViews: number;
  totalCarts: number;
  totalOrders: number;
  viewToCartRate: number;
  cartToOrderRate: number;
  overallConversionRate: number;
}

export interface AbandonedCartStats {
  count: number;
  potential_revenue: string | number;
}

export async function getProductViewStats(
  startDate: Date,
  endDate: Date,
): Promise<ProductView[]> {
  return ProductView.findAll({
    attributes: [
      "product_id",
      [fn("COUNT", col("id")), "view_count"],
      [fn("COUNT", literal("DISTINCT session_id")), "unique_visitors"],
    ],
    include: [{ model: Product, as: "product", attributes: ["name", "slug"] }],
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["product_id", "product.id"],
    order: [[literal("view_count"), "DESC"]],
    limit: 20,
  });
}

export async function getSearchAnalytics(
  startDate: Date,
  endDate: Date,
): Promise<SearchHistory[]> {
  return SearchHistory.findAll({
    attributes: [
      "search_query",
      [fn("COUNT", col("id")), "search_count"],
      [fn("AVG", col("results_count")), "avg_results"],
    ],
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["search_query"],
    order: [[literal("search_count"), "DESC"]],
    limit: 20,
  });
}

export async function getConversionStats(
  startDate: Date,
  endDate: Date,
): Promise<ConversionStats> {
  const totalViews = await ProductView.count({
    where: { created_at: { [Op.between]: [startDate, endDate] } },
  });

  const totalOrders = await Order.count({
    where: {
      payment_status: PAYMENT_STATUS.PAID,
      created_at: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalCarts = await Cart.count({
    where: { created_at: { [Op.between]: [startDate, endDate] } },
  });

  return {
    totalViews,
    totalCarts,
    totalOrders,
    viewToCartRate: totalViews > 0 ? (totalCarts / totalViews) * 100 : 0,
    cartToOrderRate: totalCarts > 0 ? (totalOrders / totalCarts) * 100 : 0,
    overallConversionRate:
      totalViews > 0 ? (totalOrders / totalViews) * 100 : 0,
  };
}

export async function getAbandonedCartStats(
  startDate: Date,
  endDate: Date,
): Promise<AbandonedCartStats> {
  // We count carts that were created in range.
  const abandonedCarts = await Cart.findAll({
    attributes: [
      [fn("COUNT", col("id")), "count"],
      [fn("SUM", col("total")), "potential_revenue"],
    ],
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
    },
    raw: true,
  });

  return abandonedCarts[0] as unknown as AbandonedCartStats;
}

export async function getRevenueByCategory(
  startDate: Date,
  endDate: Date,
): Promise<OrderItem[]> {
  return OrderItem.findAll({
    attributes: [
      [fn("SUM", col("OrderItem.price")), "revenue"],
      [fn("SUM", col("OrderItem.quantity")), "units_sold"],
    ],
    include: [
      {
        model: ProductVariant,
        as: "variant",
        include: [
          {
            model: Product,
            as: "product",
            include: [
              { model: Category, as: "category", attributes: ["name"] },
            ],
          },
        ],
      },
      {
        model: Order,
        as: "order",
        attributes: [],
        where: {
          payment_status: PAYMENT_STATUS.PAID,
          created_at: { [Op.between]: [startDate, endDate] },
        },
      },
    ],
    group: ["$variant.product.category.name$"],
    order: [[literal("revenue"), "DESC"]],
  });
}

export async function getRevenueByProduct(
  startDate: Date,
  endDate: Date,
  limit: number = 10,
): Promise<OrderItem[]> {
  return OrderItem.findAll({
    attributes: [
      [fn("SUM", col("OrderItem.price")), "revenue"],
      [fn("SUM", col("OrderItem.quantity")), "units_sold"],
    ],
    include: [
      {
        model: ProductVariant,
        as: "variant",
        include: [{ model: Product, as: "product", attributes: ["name"] }],
      },
      {
        model: Order,
        as: "order",
        attributes: [],
        where: {
          payment_status: PAYMENT_STATUS.PAID,
          created_at: { [Op.between]: [startDate, endDate] },
        },
      },
    ],
    group: ["$variant.product.name$"],
    order: [[literal("revenue"), "DESC"]],
    limit,
  });
}
export async function getAnalyticsOverview(
  startDate: Date,
  endDate: Date,
): Promise<Record<string, unknown>> {
  const conversion = await getConversionStats(startDate, endDate);
  const abandoned = await getAbandonedCartStats(startDate, endDate);

  // Get sales trend (daily for overview)

  const salesTrend = await Order.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("created_at"), "%Y-%m-%d"), "date"],
      [fn("SUM", col("total_amount")), "revenue"],
      [fn("COUNT", col("id")), "orders"],
    ],
    where: {
      payment_status: PAYMENT_STATUS.PAID,
      created_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["date"],
    order: [[literal("date"), "ASC"]],
    raw: true,
  });

  return {
    ...conversion,
    abandoned,
    salesTrend,
  };
}

export async function getCustomerBehavior(
  startDate: Date,
  endDate: Date,
): Promise<{ topSearches: SearchHistory[]; topViews: ProductView[] }> {
  const topSearches = await getSearchAnalytics(startDate, endDate);
  const topViews = await getProductViewStats(startDate, endDate);

  // Average session duration or other behavior metrics would go here if available.
  // For now, let's return aggregation of interest.
  return {
    topSearches,
    topViews,
  };
}

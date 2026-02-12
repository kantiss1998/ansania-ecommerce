import {
  Order,
  OrderItem,
  User,
  Product,
  ProductVariant,
  Category,
  VoucherUsage,
  ProductStock,
  SyncLog,
} from "@repo/database";
import {
  PAYMENT_STATUS,
  USER_ROLES,
  REPORT_LIMITS,
} from "@repo/shared/constants";
import { Op, fn, col, literal } from "sequelize";

export interface SalesReportResult {
  period: string;
  total_revenue: string | number;
  subtotal: string | number;
  total_shipping: string | number;
  total_discount: string | number;
  order_count: number;
}

export interface ProductPerformance {
  product_variant_id: number;
  total_sold: string | number;
  total_revenue: string | number;
  variant?: ProductVariant;
}

export interface CategoryPerformance {
  total_sold: string | number;
  total_revenue: string | number;
  category?: Category;
}

export interface CustomerSpender {
  user_id: number;
  total_spent: string | number;
  order_count: number;
  user?: User;
}

export interface VoucherUsageReport {
  voucher_id: number;
  usage_count: number;
  voucher?: unknown;
}

export interface GrowthResult {
  period: string;
  count: number;
}

export interface CustomerLTV {
  user_id: number;
  lifetime_value: string | number;
  total_orders: number;
  first_order: Date;
  last_order: Date;
  user?: User;
}

export interface InventoryValuation {
  sku: string;
  price: string | number;
  total_value: string | number;
  product?: Product;
  inventory?: ProductStock;
}

export async function getSalesReport(
  startDate: Date,
  endDate: Date,
  period: "daily" | "weekly" | "monthly" | "yearly" = "daily",
): Promise<SalesReportResult[]> {
  const dateFormat =
    period === "daily"
      ? "%Y-%m-%d"
      : period === "weekly"
        ? "%Y-%u"
        : period === "monthly"
          ? "%Y-%m"
          : "%Y";

  const sales = await Order.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("created_at"), dateFormat), "period"],
      [fn("SUM", col("total_amount")), "total_revenue"],
      [fn("SUM", col("subtotal")), "subtotal"],
      [fn("SUM", col("shipping_cost")), "total_shipping"],
      [fn("SUM", col("discount_amount")), "total_discount"],
      [fn("COUNT", col("id")), "order_count"],
    ],
    where: {
      payment_status: PAYMENT_STATUS.PAID,
      created_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["period"],
    order: [[literal("period"), "ASC"]],
    raw: true,
  });

  return sales as unknown as SalesReportResult[];
}

export async function getProductPerformance(
  startDate: Date,
  endDate: Date,
  limit: number = REPORT_LIMITS.DEFAULT_TOP_ITEMS,
): Promise<OrderItem[]> {
  const performance = await OrderItem.findAll({
    attributes: [
      "product_variant_id",
      [fn("SUM", col("OrderItem.quantity")), "total_sold"],
      [fn("SUM", col("OrderItem.price")), "total_revenue"],
    ],
    include: [
      {
        model: ProductVariant,
        as: "variant",
        include: [
          { model: Product, as: "product", attributes: ["name", "slug"] },
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
    group: ["product_variant_id", "variant.id", "variant.product.id"],
    order: [[literal("total_sold"), "DESC"]],
    limit,
  });

  return performance;
}

export async function getCategoryPerformance(
  startDate: Date,
  endDate: Date,
): Promise<OrderItem[]> {
  const performance = await OrderItem.findAll({
    attributes: [
      [fn("SUM", col("OrderItem.quantity")), "total_sold"],
      [fn("SUM", col("OrderItem.price")), "total_revenue"],
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
              { model: Category, as: "category", attributes: ["id", "name"] },
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
    group: ["$variant.product.category.id$"],
    order: [[literal("total_revenue"), "DESC"]],
  });

  return performance;
}

export async function getCustomerSpenders(
  startDate: Date,
  endDate: Date,
  limit: number = REPORT_LIMITS.DEFAULT_TOP_ITEMS,
): Promise<Order[]> {
  const spenders = await Order.findAll({
    attributes: [
      "user_id",
      [fn("SUM", col("total_amount")), "total_spent"],
      [fn("COUNT", col("id")), "order_count"],
    ],
    include: [{ model: User, as: "user", attributes: ["full_name", "email"] }],
    where: {
      payment_status: PAYMENT_STATUS.PAID,
      created_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["user_id", "user.id"],
    order: [[literal("total_spent"), "DESC"]],
    limit,
  });

  return spenders;
}

export async function getVoucherUsageReport(
  startDate: Date,
  endDate: Date,
): Promise<VoucherUsage[]> {
  return VoucherUsage.findAll({
    attributes: ["voucher_id", [fn("COUNT", col("id")), "usage_count"]],
    where: {
      used_at: { [Op.between]: [startDate, endDate] },
    },
    group: ["voucher_id"],
    include: ["voucher"],
  });
}

export async function getNewCustomersGrowth(
  startDate: Date,
  endDate: Date,
  period: "daily" | "weekly" | "monthly" | "yearly" = "daily",
): Promise<GrowthResult[]> {
  const dateFormat =
    period === "daily"
      ? "%Y-%m-%d"
      : period === "weekly"
        ? "%Y-%u"
        : period === "monthly"
          ? "%Y-%m"
          : "%Y";

  return User.findAll({
    attributes: [
      [fn("DATE_FORMAT", col("created_at"), dateFormat), "period"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      created_at: { [Op.between]: [startDate, endDate] },
      role: USER_ROLES.CUSTOMER,
    },
    group: ["period"],
    order: [[literal("period"), "ASC"]],
    raw: true,
  }) as unknown as Promise<GrowthResult[]>;
}

export async function getCustomerLTV(
  limit: number = REPORT_LIMITS.DEFAULT_TOP_ITEMS,
): Promise<Order[]> {
  return Order.findAll({
    attributes: [
      "user_id",
      [fn("SUM", col("total_amount")), "lifetime_value"],
      [fn("COUNT", col("id")), "total_orders"],
      [fn("MIN", col("created_at")), "first_order"],
      [fn("MAX", col("created_at")), "last_order"],
    ],
    include: [{ model: User, as: "user", attributes: ["full_name", "email"] }],
    where: { payment_status: PAYMENT_STATUS.PAID },
    group: ["user_id", "user.id"],
    order: [[literal("lifetime_value"), "DESC"]],
    limit,
  });
}

export async function getInventoryValuation(): Promise<ProductVariant[]> {
  return ProductVariant.findAll({
    attributes: [
      "sku",
      "price",
      [literal("price * inventory.available_quantity"), "total_value"],
    ],
    include: [
      { model: Product, as: "product", attributes: ["name"] },
      {
        model: ProductStock,
        as: "inventory",
        attributes: ["available_quantity"],
      },
    ],
    order: [[literal("total_value"), "DESC"]],
  });
}

export async function getWorstSellers(
  startDate: Date,
  endDate: Date,
  limit: number = REPORT_LIMITS.DEFAULT_TOP_ITEMS,
): Promise<OrderItem[]> {
  // This is inverse of getProductPerformance
  const performance = await OrderItem.findAll({
    attributes: [
      "product_variant_id",
      [fn("SUM", col("OrderItem.quantity")), "total_sold"],
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
    group: ["product_variant_id", "variant.id", "variant.product.id"],
    order: [[literal("total_sold"), "ASC"]],
    limit,
  });

  return performance;
}
export async function getStockMovement(
  startDate: Date,
  endDate: Date,
): Promise<SyncLog[]> {
  return SyncLog.findAll({
    where: {
      sync_type: "stock",
      created_at: { [Op.between]: [startDate, endDate] },
    },
    order: [["created_at", "DESC"]],
  });
}

export async function getNewCustomersList(
  startDate: Date,
  endDate: Date,
): Promise<User[]> {
  return User.findAll({
    where: {
      role: USER_ROLES.CUSTOMER,
      created_at: { [Op.between]: [startDate, endDate] },
    },
    order: [["created_at", "DESC"]],
  });
}

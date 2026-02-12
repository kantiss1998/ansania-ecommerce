import {
  Product,
  ProductView,
  Order,
  OrderItem,
  ProductImage,
  ProductVariant,
} from "@repo/database";
import { Op, fn, col, literal } from "sequelize";

/**
 * Get personalized recommendations for a user based on their past behavior
 */
export async function getPersonalizedRecommendations(
  userId: number,
  limit: number = 10,
) {
  // 1. Get user's most viewed categories
  const viewedCategories = (await ProductView.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["category_id"],
      },
    ],
    attributes: [[fn("COUNT", col("ProductView.id")), "view_count"]],
    group: ["product.category_id"],
    order: [[literal("view_count"), "DESC"]],
    limit: 3,
  })) as unknown as Array<ProductView & { product: { category_id: number } }>;

  const categoryIds = viewedCategories
    .map((c) => c.product?.category_id)
    .filter((id): id is number => !!id);

  // 2. Get user's past purchased categories
  const orders = await Order.findAll({
    where: { user_id: userId, payment_status: "paid" },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["category_id"],
          },
        ],
      },
    ],
  });

  const purchasedCategoryIds = orders
    .flatMap((o) => (o.items || []).map((item) => item.product?.category_id))
    .filter((id): id is number => !!id);

  const allRelevantCategoryIds = Array.from(
    new Set([...categoryIds, ...purchasedCategoryIds]),
  );

  // 3. Find products in these categories that the user hasn't bought yet
  const recommended = await Product.findAll({
    where: {
      is_active: true,
      category_id: { [Op.in]: allRelevantCategoryIds },
    },
    limit,
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
    ],
    order: [
      [literal("RAND()"), "ASC"], // Randomize within relevant set
    ],
  });

  // 4. Fallback if not enough recommendations
  if (recommended.length < limit) {
    const fallback = await Product.findAll({
      where: {
        is_active: true,
        is_featured: true,
        id: { [Op.notIn]: recommended.map((p) => p.id) },
      },
      limit: limit - recommended.length,
      include: [
        {
          model: ProductImage,
          as: "images",
          where: { is_primary: true },
          required: false,
        },
      ],
      order: [fn("RAND")],
    });
    return [...recommended, ...fallback];
  }

  return recommended;
}

/**
 * Frequently Bought Together (Products often appearing in same orders)
 */
export async function getFrequentlyBoughtTogether(
  productId: number,
  limit: number = 5,
) {
  // 1. Find orders containing this product
  const orderItems = await OrderItem.findAll({
    where: { product_id: productId },
    attributes: ["order_id"],
  });

  const orderIds = orderItems.map((oi) => oi.order_id);

  if (orderIds.length === 0) return [];

  // 2. Find other products in those same orders
  const relatedItems = (await OrderItem.findAll({
    where: {
      order_id: { [Op.in]: orderIds },
      product_id: { [Op.ne]: productId },
    },
    attributes: [
      "product_id",
      [fn("COUNT", col("product_id")), "occurence_count"],
    ],
    group: ["product_id"],
    order: [[literal("occurence_count"), "DESC"]],
    limit,
  })) as unknown as Array<{ product_id: number }>;

  const productIds = relatedItems.map((ri) => ri.product_id);

  return Product.findAll({
    where: { id: { [Op.in]: productIds }, is_active: true },
    include: [
      {
        model: ProductImage,
        as: "images",
        where: { is_primary: true },
        required: false,
      },
    ],
  });
}

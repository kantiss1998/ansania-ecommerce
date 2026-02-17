import {
  Product,
  ProductVariant,
  Category,
  ProductImage,
  ProductRatingsSummary,
  sequelize,
} from "@repo/database";
import { PAGINATION, PRODUCT_LIMITS } from "@repo/shared/constants";
import { NotFoundError } from "@repo/shared/errors";
import { ListProductsQuery } from "@repo/shared/schemas";
import { getDaysDifference, calculatePagination } from "@repo/shared/utils";
import { Op, Includeable, Order } from "sequelize";

export interface MappedProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  base_price: number;
  discount_price?: number;
  selling_price: string; // from DB
  compare_price?: string; // from DB
  rating_average: number;
  total_reviews: number;
  thumbnail_url: string | null;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  images: string[];
  stock_status: "in_stock" | "out_of_stock";
  [key: string]: unknown; // for other fields from DB
}

export interface ProductListResult {
  items: MappedProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function mapProduct(product: unknown): MappedProduct | null {
  if (!product) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (product as any).toJSON
    ? (product as any).toJSON()
    : (product as Record<string, unknown>);

  // Map prices
  // If compare_price (original) exists, then selling_price is the discount_price
  // Otherwise, selling_price is the base_price
  let base_price = Number(data.selling_price);
  let discount_price = undefined;

  if (
    data.compare_price &&
    Number(data.compare_price) > Number(data.selling_price)
  ) {
    base_price = Number(data.compare_price);
    discount_price = Number(data.selling_price);
  }

  // Map ratings from ratingsSummary association if present
  const rating_average = Number(data.ratingsSummary?.average_rating || 0);
  const total_reviews = Number(data.ratingsSummary?.total_reviews || 0);

  // Derive is_new (created within 30 days)
  const is_new =
    getDaysDifference(new Date(), data.created_at) <=
    PRODUCT_LIMITS.NEW_ARRIVAL_DAYS;

  // Derive thumbnail_url
  const thumbnail_url =
    (
      data.images as
      | Array<{ image_url: string; is_primary: boolean }>
      | undefined
    )?.find((img) => img.is_primary)?.image_url ||
    (data.images as Array<{ image_url: string }> | undefined)?.[0]?.image_url ||
    null;

  // Map images to string array for frontend
  const images =
    (data.images as Array<{ image_url: string }> | undefined)?.map(
      (img) => img.image_url,
    ) || [];

  return {
    ...data,
    selling_price: Number(data.selling_price || 0),
    compare_price: data.compare_price ? Number(data.compare_price) : null,
    base_price,
    discount_price,
    rating_average,
    total_reviews,
    thumbnail_url,
    is_new,
    images,
    stock_status: data.is_active ? "in_stock" : "out_of_stock",
  };
}

export async function listProducts(
  query: ListProductsQuery,
): Promise<ProductListResult> {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort = "newest",
    category,
    search,
    price_min,
    price_max,
    is_featured,
    is_new,
    has_discount,
    excludeId,
  } = query;

  const offset = (page - 1) * limit;
  // WhereOptions in strict mode might not allow direct symbol indexing without specific Record definition
  // or we cast it when assigning Op.or
  const whereClause: Record<string | symbol, unknown> = { is_active: true };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  if (price_min !== undefined) {
    whereClause.selling_price = {
      ...(whereClause.selling_price as Record<string | symbol, unknown>),
      [Op.gte]: price_min,
    };
  }
  if (price_max !== undefined) {
    whereClause.selling_price = {
      ...(whereClause.selling_price as Record<string | symbol, unknown>),
      [Op.lte]: price_max,
    };
  }

  if (is_featured !== undefined) {
    whereClause.is_featured = is_featured;
  }

  if (is_new !== undefined) {
    whereClause.is_new = is_new;
  }

  if (has_discount) {
    whereClause.compare_price = { [Op.gt]: sequelize.col("selling_price") };
  }

  // Includes filtering
  const include: Includeable[] = [
    {
      model: ProductImage,
      as: "images",
      attributes: ["image_url", "is_primary"],
    },
    {
      model: ProductVariant,
      as: "variants",
      where: { is_visible: true },
      required: false,
    },
    { model: ProductRatingsSummary, as: "ratingsSummary" },
  ];

  if (category) {
    const cat = await Category.findOne({ where: { slug: category } });
    if (cat) {
      whereClause.category_id = cat.id;
      include.push({
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug"],
      });
    } else {
      // If category not found, return empty or ignore?
      // Ideally return empty, so let's set an impossible ID
      whereClause.category_id = -1;
    }
  } else {
    include.push({
      model: Category,
      as: "category",
      attributes: ["id", "name", "slug"],
    });
  }

  // Sorting
  let order: Order = [["created_at", "DESC"]]; // default newest
  if (sort === "price_asc") order = [["selling_price", "ASC"]];
  if (sort === "price_desc") order = [["selling_price", "DESC"]];
  if (sort === "name_asc") order = [["name", "ASC"]];
  if (sort === "name_desc") order = [["name", "DESC"]];

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    include,
    distinct: true, // for correct count with includes
    limit,
    offset,
    order,
  });

  const pagination = calculatePagination(Number(page), Number(limit), count);

  return {
    items: rows.map(mapProduct).filter((p): p is MappedProduct => p !== null),
    ...pagination,
  };
}

export async function getDistinctAttributes(
  attribute: "color" | "size" | "finishing",
): Promise<string[]> {
  // Check if column exists in ProductVariant
  const variants = await ProductVariant.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col(attribute)), attribute],
    ],
    where: {
      [attribute]: { [Op.not]: null },
    },
    order: [[attribute, "ASC"]],
    raw: true,
  });

  return (variants as unknown as Array<Record<string, string>>)
    .map((v) => v[attribute])
    .filter(Boolean);
}

export async function getProductBySlug(
  slug: string,
): Promise<MappedProduct | null> {
  const product = await Product.findOne({
    where: { slug, is_active: true },
    include: [
      { model: Category, as: "category" },
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants" },
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
  });

  return mapProduct(product);
}

export async function getRelatedProducts(
  productId: number,
  limit: number = 4,
): Promise<MappedProduct[]> {
  const product = await Product.findByPk(productId);
  if (!product) return [];

  const related = await Product.findAll({
    where: {
      category_id: product.category_id,
      id: { [Op.ne]: productId }, // Exclude self
      is_active: true,
    },
    limit,
    include: [
      {
        model: ProductImage,
        as: "images",
        attributes: ["image_url", "is_primary"],
      },
      { model: Category, as: "category" },
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
    order: sequelize.random(), // Random selection for variety
  });

  return related.map(mapProduct).filter((p): p is MappedProduct => p !== null);
}

// Get featured products
export async function getFeaturedProducts(
  limit: number = 10,
): Promise<MappedProduct[]> {
  const products = await Product.findAll({
    where: {
      is_featured: true,
      is_active: true,
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
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
    order: [["created_at", "DESC"]],
  });

  return products.map(mapProduct).filter((p): p is MappedProduct => p !== null);
}

// Get new arrivals (products created within last N days)
export async function getNewArrivals(
  limit: number = 10,
  days: number = PRODUCT_LIMITS.NEW_ARRIVAL_DAYS,
): Promise<MappedProduct[]> {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  const products = await Product.findAll({
    where: {
      is_active: true,
      created_at: { [Op.gte]: dateThreshold },
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
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
    order: [["created_at", "DESC"]],
  });

  return products.map(mapProduct).filter((p): p is MappedProduct => p !== null);
}

// Get all variants for a product
export async function getProductVariants(
  productId: number,
): Promise<{
  product: { id: number; name: string; slug: string };
  variants: ProductVariant[];
} | null> {
  const product = await Product.findByPk(productId);
  if (!product) return null;

  const variants = await ProductVariant.findAll({
    where: {
      product_id: productId,
      is_visible: true,
    },
    order: [
      ["sort_order", "ASC"],
      ["id", "ASC"],
    ],
  });

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
    },
    variants,
  };
}

// Get recommended products (combination of featured + most viewed)
export async function getRecommendedProducts(
  limit: number = 10,
): Promise<MappedProduct[]> {
  // For now, return featured + random popular products
  // In the future, this can be enhanced with ML recommendations
  const products = await Product.findAll({
    where: {
      is_active: true,
      [Op.or]: [{ is_featured: true }],
    } as Record<string | symbol, unknown>,
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
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
    order: [["is_featured", "DESC"], sequelize.random()],
  });

  return products.map(mapProduct).filter((p): p is MappedProduct => p !== null);
}

// Get similar products (same category, similar price range)
export async function getSimilarProducts(
  productId: number,
  limit: number = 6,
): Promise<MappedProduct[]> {
  const product = await Product.findByPk(productId);
  if (!product) return [];

  // Calculate price range (±20%)
  const priceMin = Number(product.selling_price) * 0.8;
  const priceMax = Number(product.selling_price) * 1.2;

  const similar = await Product.findAll({
    where: {
      category_id: product.category_id,
      id: { [Op.ne]: productId },
      is_active: true,
      selling_price: {
        [Op.between]: [priceMin, priceMax],
      },
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
      { model: ProductRatingsSummary, as: "ratingsSummary" },
    ],
    order: sequelize.random(),
  });

  return similar.map(mapProduct).filter((p): p is MappedProduct => p !== null);
}

/**
 * Track a product view
 */
export async function trackProductView(productId: number): Promise<Product> {
  const product = await Product.findByPk(productId);
  if (!product) throw new NotFoundError("Product");

  // view_count removed as it doesn't exist in DB
  return product;
}

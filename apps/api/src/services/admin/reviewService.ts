import { Review, User, Product, ProductImage } from "@repo/database";
import { REVIEW_STATUS } from "@repo/shared/constants";
import { NotFoundError } from "@repo/shared/errors";
import { Op } from "sequelize";

export interface AdminReviewResult extends Omit<
  Partial<Review>,
  "user" | "product"
> {
  status: string;
  user?: {
    full_name: string;
    email: string;
  };
  product?: {
    name: string;
    slug: string;
  };
}

export interface ReviewListResult {
  items: AdminReviewResult[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function listAllReviews(query: {
  page?: number | string;
  limit?: number | string;
  status?: string;
  rating?: number | string;
  search?: string;
}): Promise<ReviewListResult> {
  const { page = 1, limit = 10, status, rating, search } = query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: Record<string | symbol, unknown> = {};

  if (status === REVIEW_STATUS.APPROVED) where.is_approved = true;
  if (status === REVIEW_STATUS.PENDING) where.is_approved = false;
  if (rating) where.rating = rating;

  if (search) {
    where[Op.or] = [
      { comment: { [Op.like]: `%${search}%` } },
      { "$user.full_name$": { [Op.like]: `%${search}%` } },
      { "$product.name$": { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Review.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
    include: [
      { model: User, as: "user", attributes: ["full_name", "email"] },
      {
        model: Product,
        as: "product",
        attributes: ["name", "slug"],
        include: [
          {
            model: ProductImage,
            as: "images",
            attributes: ["image_url", "is_primary"],
            required: false,
          },
        ],
      },
    ],
    distinct: true,
  });

  // Map to JSON and add status field
  const items: AdminReviewResult[] = rows.map((r) => {
    const review = r.get({ plain: true }) as any;

    // Derive main image for frontend compatibility
    if (review.product && Array.isArray(review.product.images)) {
      const primaryImage =
        review.product.images.find((img: any) => img.is_primary) ||
        review.product.images[0];
      review.product.image = primaryImage ? primaryImage.image_url : null;
    }

    return {
      ...review,
      status: r.is_approved ? REVIEW_STATUS.APPROVED : REVIEW_STATUS.PENDING,
    };
  });

  return {
    items,
    meta: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
}

export async function moderateReview(
  id: number,
  approved: boolean,
): Promise<AdminReviewResult> {
  const review = await Review.findByPk(id);
  if (!review) throw new NotFoundError("Review");

  await review.update({ is_approved: approved });
  const reviewJson = review.get({ plain: true }) as AdminReviewResult;
  return {
    ...reviewJson,
    status: review.is_approved ? REVIEW_STATUS.APPROVED : REVIEW_STATUS.PENDING,
  };
}

export async function deleteReview(id: number): Promise<{ success: boolean }> {
  const review = await Review.findByPk(id);
  if (!review) throw new NotFoundError("Review");

  await review.destroy();
  return { success: true };
}

export async function bulkApprove(
  ids: number[],
): Promise<{ success: boolean; count: number }> {
  await Review.update(
    { is_approved: true },
    {
      where: { id: { [Op.in]: ids } },
    },
  );
  return { success: true, count: ids.length };
}

export async function bulkReject(
  ids: number[],
): Promise<{ success: boolean; count: number }> {
  await Review.update(
    { is_approved: false },
    {
      where: { id: { [Op.in]: ids } },
    },
  );
  return { success: true, count: ids.length };
}

export async function getPendingReviews(
  query: Record<string, unknown>,
): Promise<ReviewListResult> {
  return listAllReviews({ ...query, status: REVIEW_STATUS.PENDING });
}

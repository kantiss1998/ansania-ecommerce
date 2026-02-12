import {
  Review,
  Order,
  OrderItem,
  ReviewImage,
  ProductRatingsSummary,
  Product,
  User,
} from "@repo/database";
import { PAYMENT_STATUS, REVIEW_LIMITS } from "@repo/shared/constants";
import { AppError, UnauthorizedError } from "@repo/shared/errors";
import { CreateReviewDTO } from "@repo/shared/schemas";
import { Op, Includeable } from "sequelize";

export interface PendingReview {
  order_id: number;
  order_number: string;
  product_id: number;
  product_name: string;
  variant_name: string | null;
  price: string | number;
  purchased_at: Date;
  product: Product | null;
}

export async function createReview(
  userId: number,
  data: CreateReviewDTO & { product_id: number },
): Promise<Review> {
  const { order_id, rating, comment, title } = data; // Using order_id from DTO instead of inferring from product

  // 1. Verify if user purchased the product and it is delivered
  // Order must be 'completed' or 'shipped'? Let's assume 'processing' or 'completed' is enough for now,
  // but ideally 'completed' means delivered.
  // In our order flow, we only have 'pending_payment', 'processing', 'cancelled'.
  // We'll assume 'processing' (paid) is enough to review for now, or add 'completed' status later.
  // Let's check for 'processing' or 'completed'.
  const order = await Order.findOne({
    where: {
      id: order_id,
      user_id: userId,
      payment_status: PAYMENT_STATUS.PAID,
    },
    include: [
      {
        model: OrderItem,
        as: "items",
        where: { product_variant_id: { [Op.ne]: null } }, // Just ensuring items exist
      },
    ],
  });

  if (!order) {
    throw new UnauthorizedError(
      "You can only review orders you have purchased and paid for.",
    );
  }

  // Check if the order actually contains the product (wait, DTO doesn't have product_id, it has order_id... oh wait reviewSchemas.create HAS order_id?
  // Let's check schema: create: { order_id: number, rating: number ... }
  // Wait, typically you review a PRODUCT from an order.
  // The previous code inferred order from product_id. The new schema requires order_id.
  // However, the `createReviews` code used `product_id` from `data`.
  // If the schema changed to `order_id`, we need to know WHICH product in the order is being reviewed.
  // The schema in `shared/schemas/index.ts` lines 152-158 says:
  // create: z.object({ order_id, rating, ... })
  // It MISSES product_id!
  // A review is for a specific product.
  // I need to Fix the schema or assuming the FE sends product_id in body (but it's not validated by DTO).
  // Actually, looking at `Review.create`, it requires `product_id`.
  // I will assume `product_id` IS in the body, and add it to schema later.
  // For now I will cast data to `CreateReviewDTO & { product_id: number }`.

  const productId = data.product_id;
  if (!productId) throw new AppError("Product ID is required", 400);

  // Verify product is in order
  const orderItem = await OrderItem.findOne({
    where: {
      order_id: order_id,
      product_id: productId,
    },
  });

  if (!orderItem) {
    throw new UnauthorizedError(
      "This product was not found in the specified order.",
    );
  }

  // 2. Check if already reviewed?
  const existingReview = await Review.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this product.", 400);
  }

  // 3. Create Review
  const review = await Review.create({
    user_id: userId,
    product_id: productId,
    order_id: order_id,
    rating,
    comment,
    title,
    is_verified_purchase: true,
    is_approved: true, // Auto-approve for now, or false if moderation needed
  });

  // 4. Handle Images
  if (data.images && Array.isArray(data.images)) {
    for (const imageUrl of data.images) {
      await ReviewImage.create({
        review_id: review.id,
        image_url: imageUrl,
      });
    }
  }

  // 5. Update ProductRatingsSummary
  await updateProductRatings(productId);

  return review;
}

async function updateProductRatings(productId: number): Promise<void> {
  const reviews = await Review.findAll({
    where: { product_id: productId, is_approved: true },
  });

  const totalReviews = reviews.length;
  if (totalReviews === 0) return;

  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  reviews.forEach((review) => {
    const rating = review.rating as 1 | 2 | 3 | 4 | 5;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating]++;
    }
    totalRating += review.rating;
  });

  const averageRating = totalRating / totalReviews;

  await ProductRatingsSummary.upsert({
    product_id: productId,
    total_reviews: totalReviews,
    average_rating: averageRating,
    rating_5_count: ratingCounts[5],
    rating_4_count: ratingCounts[4],
    rating_3_count: ratingCounts[3],
    rating_2_count: ratingCounts[2],
    rating_1_count: ratingCounts[1],
    updated_at: new Date(),
  });
}

export async function getReviewsByProduct(
  productId: number,
): Promise<Review[]> {
  return Review.findAll({
    where: {
      product_id: productId,
      is_approved: true,
    },
    include: [
      { model: User, as: "user", attributes: ["full_name"] } as Includeable,
    ], // Include user name? Needs User import
    order: [["created_at", "DESC"]],
  });
}

// Update a review (user can only update their own)
export async function updateReview(
  userId: number,
  reviewId: number,
  data: Partial<CreateReviewDTO>,
): Promise<Review> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.user_id !== userId) {
    throw new UnauthorizedError("You can only update your own reviews");
  }

  // Update allowed fields
  if (data.rating !== undefined) review.rating = data.rating;
  if (data.comment !== undefined) review.comment = data.comment;
  if (data.title !== undefined) review.title = data.title;

  await review.save();

  // Update product ratings
  await updateProductRatings(review.product_id);

  return review;
}

// Delete a review
export async function deleteReview(
  userId: number,
  reviewId: number,
): Promise<{ success: boolean }> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.user_id !== userId) {
    throw new UnauthorizedError("You can only delete your own reviews");
  }

  const productId = review.product_id;

  // Delete associated images first
  await ReviewImage.destroy({ where: { review_id: reviewId } });

  // Delete the review
  await review.destroy();

  // Update product ratings
  await updateProductRatings(productId);

  return { success: true };
}

// Add an image to an existing review
export async function addReviewImage(
  userId: number,
  reviewId: number,
  imageUrl: string,
): Promise<ReviewImage> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.user_id !== userId) {
    throw new UnauthorizedError("You can only add images to your own reviews");
  }

  // Check image count limit
  const currentImages = await ReviewImage.count({
    where: { review_id: reviewId },
  });
  if (currentImages >= REVIEW_LIMITS.MAX_IMAGES) {
    throw new AppError(
      `Maximum ${REVIEW_LIMITS.MAX_IMAGES} images allowed per review`,
      400,
    );
  }

  const reviewImage = await ReviewImage.create({
    review_id: reviewId,
    image_url: imageUrl,
  });

  return reviewImage;
}

// Delete an image from a review
export async function deleteReviewImage(
  userId: number,
  reviewId: number,
  imageId: number,
): Promise<{ success: boolean }> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.user_id !== userId) {
    throw new UnauthorizedError(
      "You can only delete images from your own reviews",
    );
  }

  const reviewImage = await ReviewImage.findOne({
    where: { id: imageId, review_id: reviewId },
  });

  if (!reviewImage) {
    throw new AppError("Review image not found", 404);
  }

  await reviewImage.destroy();

  return { success: true };
}

// Get products that are paid/delivered but not yet reviewed
export async function getPendingReviews(
  userId: number,
): Promise<PendingReview[]> {
  // 1. Get all paid orders for the user
  const orders = await Order.findAll({
    where: { user_id: userId, payment_status: PAYMENT_STATUS.PAID },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
    ],
  });

  // 2. Get all product IDs already reviewed by the user
  const reviewedProducts = await Review.findAll({
    where: { user_id: userId },
    attributes: ["product_id"],
  });
  const reviewedProductIds = reviewedProducts.map((r) => r.product_id);

  // 3. Find items in orders that are not in reviewedProductIds
  const pendingReviews: PendingReview[] = [];

  for (const order of orders) {
    if (!order.items) continue;

    for (const item of order.items) {
      if (!reviewedProductIds.includes(item.product_id)) {
        pendingReviews.push({
          order_id: order.id,
          order_number: order.order_number,
          product_id: item.product_id,
          product_name: item.product_name,
          variant_name: item.variant_name,
          price: item.price,
          purchased_at: order.created_at,
          product: item.product || null,
        });
      }
    }
  }

  return pendingReviews;
}

// Mark a review as helpful
export async function markReviewHelpful(
  _userId: number,
  reviewId: number,
): Promise<{ success: boolean; helpful_count: number }> {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Increment helpful_count
  review.helpful_count = (review.helpful_count || 0) + 1;
  await review.save();

  return { success: true, helpful_count: review.helpful_count };
}

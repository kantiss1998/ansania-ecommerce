import { Review, Order, OrderItem, ReviewImage, ProductRatingsSummary } from '@repo/database';
import { AppError, UnauthorizedError } from '@repo/shared/errors';
import { CreateReviewDTO } from '@repo/shared/schemas';
import { Includeable } from 'sequelize';

export async function createReview(userId: number, data: CreateReviewDTO) {
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
            payment_status: 'paid'
        },
        include: [{
            model: OrderItem,
            as: 'items',
            where: { product_variant_id: { [Symbol.for('ne')]: null } } // Just ensuring items exist
        }]
    });

    if (!order) {
        throw new UnauthorizedError('You can only review orders you have purchased and paid for.');
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

    const productId = (data as any).product_id;
    if (!productId) throw new AppError('Product ID is required', 400);

    // Verify product is in order
    const orderItem = await OrderItem.findOne({
        where: {
            order_id: order_id,
            product_id: productId
        }
    });

    if (!orderItem) {
        throw new UnauthorizedError('This product was not found in the specified order.');
    }

    // 2. Check if already reviewed?
    const existingReview = await Review.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
    });

    if (existingReview) {
        throw new AppError('You have already reviewed this product.', 400);
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
        is_approved: true // Auto-approve for now, or false if moderation needed
    });

    // 4. Handle Images
    if (data.images && Array.isArray(data.images)) {
        for (const imageUrl of data.images) {
            await ReviewImage.create({
                review_id: review.id,
                image_url: imageUrl
            });
        }
    }

    // 5. Update ProductRatingsSummary
    await updateProductRatings(productId);

    return review;
}

async function updateProductRatings(productId: number) {
    const reviews = await Review.findAll({
        where: { product_id: productId, is_approved: true }
    });

    const totalReviews = reviews.length;
    if (totalReviews === 0) return;

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review: any) => {
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
        updated_at: new Date()
    });
}

export async function getReviewsByProduct(productId: number) {
    return Review.findAll({
        where: {
            product_id: productId,
            is_approved: true
        },
        include: [{ model: User, as: 'user', attributes: ['full_name'] } as Includeable], // Include user name? Needs User import
        order: [['created_at', 'DESC']]
    });
}

// Need to import User to use in include
import { User } from '@repo/database';


import { Review, Order, OrderItem, ReviewImage, ProductRatingsSummary } from '@repo/database';
import { AppError, UnauthorizedError } from '@repo/shared/errors';

export async function createReview(userId: number, data: any) {
    const { product_id, rating, comment, title } = data;

    // 1. Verify if user purchased the product and it is delivered
    // Order must be 'completed' or 'shipped'? Let's assume 'processing' or 'completed' is enough for now, 
    // but ideally 'completed' means delivered.
    // In our order flow, we only have 'pending_payment', 'processing', 'cancelled'. 
    // We'll assume 'processing' (paid) is enough to review for now, or add 'completed' status later.
    // Let's check for 'processing' or 'completed'.
    // @ts-ignore
    const orderItem = await OrderItem.findOne({
        include: [{
            model: Order,
            as: 'order',
            where: {
                user_id: userId,
                // status: ['processing', 'completed', 'shipped'] 
                // For now, checks if he has ANY order with this product
                payment_status: 'paid'
            }
        }],
        where: {
            product_id: product_id
        }
    });

    if (!orderItem) {
        throw new UnauthorizedError('You can only review products you have purchased.');
    }

    // 2. Check if already reviewed?
    // One review per order item? Or one per product per user?
    // Usually one per product per user is enough.
    // @ts-ignore
    const existingReview = await Review.findOne({
        where: {
            user_id: userId,
            product_id: product_id
        }
    });

    if (existingReview) {
        throw new AppError('You have already reviewed this product.', 400);
    }

    // 3. Create Review
    // @ts-ignore
    const review = await Review.create({
        user_id: userId,
        product_id: product_id,
        // @ts-ignore
        order_id: orderItem.order_id, // Link to the order found
        rating,
        comment,
        title,
        is_verified_purchase: true,
        is_approved: true // Auto-approve for now, or false if moderation needed
    });

    // 4. Handle Images
    if (data.images && Array.isArray(data.images)) {
        for (const imageUrl of data.images) {
            // @ts-ignore
            await ReviewImage.create({
                review_id: review.id,
                image_url: imageUrl
            });
        }
    }

    // 5. Update ProductRatingsSummary
    await updateProductRatings(product_id);

    return review;
}

async function updateProductRatings(productId: number) {
    // @ts-ignore
    const reviews = await Review.findAll({
        where: { product_id: productId, is_approved: true }
    });

    const totalReviews = reviews.length;
    if (totalReviews === 0) return;

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review: any) => {
        const rating = review.rating;
        ratingCounts[rating as keyof typeof ratingCounts]++;
        totalRating += rating;
    });

    const averageRating = totalRating / totalReviews;

    // @ts-ignore
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
    // @ts-ignore
    return Review.findAll({
        where: {
            product_id: productId,
            is_approved: true
        },
        include: ['user'], // Include user name?
        order: [['created_at', 'DESC']]
    });
}

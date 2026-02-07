import { User, Order, Wishlist, Review, Product, ProductView } from '@repo/database';
import { Op } from 'sequelize';

// Get user dashboard summary
export async function getUserDashboard(userId: number): Promise<any> {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'full_name', 'phone', 'created_at']
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get counts
    const [ordersCount, wishlistCount, reviewsCount] = await Promise.all([
        Order.count({ where: { user_id: userId } }),
        Wishlist.count({ where: { user_id: userId } }),
        Review.count({ where: { user_id: userId } })
    ]);

    // Get recent orders
    const recentOrders = await Order.findAll({
        where: { user_id: userId },
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'order_number', 'total_amount', 'status', 'payment_status', 'created_at']
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone,
            member_since: user.created_at
        },
        stats: {
            total_orders: ordersCount,
            wishlist_items: wishlistCount,
            total_reviews: reviewsCount
        },
        recent_orders: recentOrders
    };
}

// Get user statistics
export async function getUserStats(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalOrders,
        completedOrders,
        totalSpent,
        recentOrders,
        totalReviews,
        wishlistCount
    ] = await Promise.all([
        Order.count({ where: { user_id: userId } }),
        Order.count({ where: { user_id: userId, status: 'completed' } }),
        Order.sum('total_amount', { where: { user_id: userId, payment_status: 'paid' } }),
        Order.count({ where: { user_id: userId, created_at: { [Op.gte]: thirtyDaysAgo } } }),
        Review.count({ where: { user_id: userId } }),
        Wishlist.count({ where: { user_id: userId } })
    ]);

    return {
        total_orders: totalOrders,
        completed_orders: completedOrders,
        total_spent: totalSpent || 0,
        orders_last_30_days: recentOrders,
        total_reviews: totalReviews,
        wishlist_items: wishlistCount
    };
}

// Get recently viewed products
export async function getRecentlyViewed(userId: number, limit: number = 10) {
    const views = await ProductView.findAll({
        where: { user_id: userId },
        include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'selling_price', 'discount_price', 'is_active']
        }],
        order: [['viewed_at', 'DESC']],
        limit,
        distinct: true
    } as any);

    return views.map((v: any) => v.product).filter((p: any) => p && p.is_active);
}

// Get personalized recommendations for user
export async function getRecommendations(userId: number, limit: number = 10) {
    // Simple recommendation: featured products + products from categories user viewed
    const viewedProducts = await ProductView.findAll({
        where: { user_id: userId },
        attributes: ['product_id'],
        limit: 20,
        order: [['viewed_at', 'DESC']]
    });

    const productIds = viewedProducts.map(v => v.product_id);

    let categoryIds: number[] = [];
    if (productIds.length > 0) {
        const products = await Product.findAll({
            where: { id: { [Op.in]: productIds } },
            attributes: ['category_id']
        });
        categoryIds = [...new Set(products.map(p => p.category_id))];
    }

    const whereClause: any = {
        is_active: true,
        id: { [Op.notIn]: productIds }
    };

    if (categoryIds.length > 0) {
        whereClause[Op.or] = [
            { category_id: { [Op.in]: categoryIds } },
            { is_featured: true }
        ];
    } else {
        whereClause.is_featured = true;
    }

    const recommendations = await Product.findAll({
        where: whereClause,
        limit,
        order: [['average_rating', 'DESC'], ['created_at', 'DESC']]
    });

    return recommendations;
}

// Get user's available vouchers
export async function getUserVouchers(_userId: number) {
    // TODO: Implement UserVoucher model for assigned/collected vouchers
    // Currently we only have VoucherUsage which tracks USED vouchers
    // For now, returning empty array to pass build
    return [];
}

// Subscribe to newsletter
export async function subscribeNewsletter(userId: number, email: string) {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Update user's newsletter subscription status
    // Assuming there's a newsletter_subscribed field in User model
    await User.update(
        { newsletter_subscribed: true } as any,
        { where: { id: userId } }
    );

    return {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email: email || user.email
    };
}

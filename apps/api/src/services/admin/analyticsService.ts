
import { ProductView, SearchHistory, Product, Cart, Order } from '@repo/database';
import { Op, fn, col, literal } from 'sequelize';

export async function getProductViewStats(startDate: Date, endDate: Date) {
    return ProductView.findAll({
        attributes: [
            'product_id',
            [fn('COUNT', col('id')), 'view_count'],
            [fn('COUNT', literal('DISTINCT session_id')), 'unique_visitors']
        ],
        include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }],
        where: {
            created_at: { [Op.between]: [startDate, endDate] }
        },
        group: ['product_id', 'product.id'],
        order: [[literal('view_count'), 'DESC']],
        limit: 20
    });
}

export async function getSearchAnalytics(startDate: Date, endDate: Date) {
    return SearchHistory.findAll({
        attributes: [
            'search_query',
            [fn('COUNT', col('id')), 'search_count'],
            [fn('AVG', col('results_count')), 'avg_results']
        ],
        where: {
            created_at: { [Op.between]: [startDate, endDate] }
        },
        group: ['search_query'],
        order: [[literal('search_count'), 'DESC']],
        limit: 20
    });
}

export async function getConversionStats(startDate: Date, endDate: Date) {
    const totalViews = await ProductView.count({
        where: { created_at: { [Op.between]: [startDate, endDate] } }
    });

    const totalOrders = await Order.count({
        where: {
            payment_status: 'paid',
            created_at: { [Op.between]: [startDate, endDate] }
        }
    });

    const totalCarts = await Cart.count({
        where: { created_at: { [Op.between]: [startDate, endDate] } }
    });

    return {
        totalViews,
        totalCarts,
        totalOrders,
        viewToCartRate: totalViews > 0 ? (totalCarts / totalViews) * 100 : 0,
        cartToOrderRate: totalCarts > 0 ? (totalOrders / totalCarts) * 100 : 0,
        overallConversionRate: totalViews > 0 ? (totalOrders / totalViews) * 100 : 0
    };
}

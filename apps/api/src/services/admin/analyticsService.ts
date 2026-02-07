
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

export async function getAbandonedCartStats(startDate: Date, endDate: Date) {
    // We count carts that were created in range.
    const abandonedCarts = await Cart.findAll({
        attributes: [
            [fn('COUNT', col('id')), 'count'],
            [fn('SUM', col('total')), 'potential_revenue']
        ],
        where: {
            created_at: { [Op.between]: [startDate, endDate] }
        },
        raw: true
    });

    return abandonedCarts[0];
}

export async function getRevenueByCategory(startDate: Date, endDate: Date) {
    const { OrderItem, ProductVariant, Product, Category } = require('@repo/database');

    return OrderItem.findAll({
        attributes: [
            [fn('SUM', col('OrderItem.price')), 'revenue'],
            [fn('SUM', col('OrderItem.quantity')), 'units_sold']
        ],
        include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{
                model: Product,
                as: 'product',
                include: [{ model: Category, as: 'category', attributes: ['name'] }]
            }]
        }, {
            model: Order,
            as: 'order',
            attributes: [],
            where: {
                payment_status: 'paid',
                created_at: { [Op.between]: [startDate, endDate] }
            }
        }],
        group: ['$variant.product.category.name$'],
        order: [[literal('revenue'), 'DESC']]
    });
}

export async function getRevenueByProduct(startDate: Date, endDate: Date, limit: number = 10) {
    const { OrderItem, ProductVariant, Product } = require('@repo/database');

    return OrderItem.findAll({
        attributes: [
            [fn('SUM', col('OrderItem.price')), 'revenue'],
            [fn('SUM', col('OrderItem.quantity')), 'units_sold']
        ],
        include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{ model: Product, as: 'product', attributes: ['name'] }]
        }, {
            model: Order,
            as: 'order',
            attributes: [],
            where: {
                payment_status: 'paid',
                created_at: { [Op.between]: [startDate, endDate] }
            }
        }],
        group: ['$variant.product.name$'],
        order: [[literal('revenue'), 'DESC']],
        limit
    });
}

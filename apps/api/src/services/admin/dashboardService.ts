
import { Order, User, Product } from '@repo/database';
import { Op, fn, col, literal } from 'sequelize';

export async function getStatsOverview() {
    const totalSales = await Order.sum('total_amount', {
        where: { payment_status: 'paid' }
    });

    const totalOrders = await Order.count();
    const totalUsers = await User.count({ where: { role: 'customer' } });
    const totalProducts = await Product.count({ where: { is_active: true } });

    const avgOrderValue = totalOrders > 0 ? (totalSales || 0) / totalOrders : 0;

    return {
        totalSales: totalSales || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        avgOrderValue
    };
}

export async function getSalesPerformance(period: 'daily' | 'monthly' = 'daily') {
    const dateFormat = period === 'daily' ? '%Y-%m-%d' : '%Y-%m';

    const sales = await Order.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('created_at'), dateFormat), 'date'],
            [fn('SUM', col('total_amount')), 'sales'],
            [fn('COUNT', col('id')), 'orders']
        ],
        where: {
            payment_status: 'paid',
            created_at: {
                [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 30 DAY)")
            }
        },
        group: ['date'],
        order: [[literal('date'), 'ASC']],
        raw: true
    }) as any;

    return sales;
}

export async function getRecentActivity() {
    const recentOrders = await Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    const recentUsers = await User.findAll({
        where: { role: 'customer' },
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'full_name', 'email', 'created_at']
    });

    return {
        recentOrders,
        recentUsers
    };
}

export async function getInventoryStatus() {
    const { ProductStock } = require('@repo/database');
    const lowStockCount = await ProductStock.count({
        where: { available_quantity: { [Op.gt]: 0, [Op.lte]: 10 } }
    });
    const outOfStockCount = await ProductStock.count({
        where: { available_quantity: { [Op.lte]: 0 } }
    });

    return {
        lowStockCount,
        outOfStockCount
    };
}

export async function getTopProducts(limit: number = 5) {
    const { OrderItem, ProductVariant, Product } = require('@repo/database');
    const items = await OrderItem.findAll({
        attributes: [
            'product_variant_id',
            [fn('SUM', col('quantity')), 'total_quantity'],
            [fn('SUM', col('price')), 'total_revenue']
        ],
        group: ['product_variant_id'],
        order: [[literal('total_quantity'), 'DESC']],
        limit,
        include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }]
        }]
    });

    return items;
}

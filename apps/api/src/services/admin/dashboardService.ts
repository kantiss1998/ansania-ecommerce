import { Order, User, Product, ProductStock, OrderItem, ProductVariant } from '@repo/database';
import { Op, fn, col, literal } from 'sequelize';
import { PAYMENT_STATUS, USER_ROLES, DASHBOARD_CONFIG } from '@repo/shared/constants';

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    avgOrderValue: number;
}

export interface SalesPerformanceResult {
    date: string;
    sales: string | number;
    orders: number;
}

export async function getStatsOverview(): Promise<DashboardStats> {
    const totalSales = await Order.sum('total_amount', {
        where: { payment_status: PAYMENT_STATUS.PAID }
    });

    const totalOrders = await Order.count();
    const totalUsers = await User.count({ where: { role: USER_ROLES.CUSTOMER } });
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

export async function getSalesPerformance(period: 'daily' | 'monthly' = 'daily'): Promise<SalesPerformanceResult[]> {
    const dateFormat = period === 'daily' ? '%Y-%m-%d' : '%Y-%m';

    const sales = await Order.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('created_at'), dateFormat), 'date'],
            [fn('SUM', col('total_amount')), 'sales'],
            [fn('COUNT', col('id')), 'orders']
        ],
        where: {
            payment_status: PAYMENT_STATUS.PAID,
            created_at: {
                [Op.gte]: literal(`DATE_SUB(NOW(), INTERVAL ${DASHBOARD_CONFIG.SALES_PERFORMANCE_DAYS} DAY)`)
            }
        },
        group: ['date'],
        order: [[literal('date'), 'ASC']],
        raw: true
    }) as any;

    return sales as unknown as SalesPerformanceResult[];
}

export async function getRecentActivity(): Promise<{ recentOrders: Order[]; recentUsers: User[] }> {
    const recentOrders = await Order.findAll({
        limit: DASHBOARD_CONFIG.RECENT_LIMIT,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    const recentUsers = await User.findAll({
        where: { role: USER_ROLES.CUSTOMER },
        limit: DASHBOARD_CONFIG.RECENT_LIMIT,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'full_name', 'email', 'created_at']
    });

    return {
        recentOrders,
        recentUsers
    };
}

export async function getInventoryStatus(): Promise<{ lowStockCount: number; outOfStockCount: number }> {
    const lowStockCount = await ProductStock.count({
        where: { available_quantity: { [Op.gt]: 0, [Op.lte]: DASHBOARD_CONFIG.LOW_STOCK_THRESHOLD } }
    });
    const outOfStockCount = await ProductStock.count({
        where: { available_quantity: { [Op.lte]: 0 } }
    });

    return {
        lowStockCount,
        outOfStockCount
    };
}

export async function getTopProducts(limit: number = DASHBOARD_CONFIG.RECENT_LIMIT): Promise<OrderItem[]> {
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


import { Order, OrderItem, User, Product, ProductVariant, Category, VoucherUsage } from '@repo/database';
import { Op, fn, col, literal } from 'sequelize';

export async function getSalesReport(startDate: Date, endDate: Date, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const dateFormat = period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%u' : '%Y-%m';

    const sales = await Order.findAll({
        attributes: [
            [fn('DATE_FORMAT', col('created_at'), dateFormat), 'period'],
            [fn('SUM', col('total_amount')), 'total_revenue'],
            [fn('SUM', col('subtotal')), 'subtotal'],
            [fn('SUM', col('shipping_cost')), 'total_shipping'],
            [fn('SUM', col('discount_amount')), 'total_discount'],
            [fn('COUNT', col('id')), 'order_count']
        ],
        where: {
            payment_status: 'paid',
            created_at: { [Op.between]: [startDate, endDate] }
        },
        group: ['period'],
        order: [[literal('period'), 'ASC']],
        raw: true
    });

    return sales;
}

export async function getProductPerformance(startDate: Date, endDate: Date, limit: number = 10) {
    const performance = await OrderItem.findAll({
        attributes: [
            'product_variant_id',
            [fn('SUM', col('OrderItem.quantity')), 'total_sold'],
            [fn('SUM', col('OrderItem.price')), 'total_revenue']
        ],
        include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }]
        }, {
            model: Order,
            as: 'order',
            attributes: [],
            where: {
                payment_status: 'paid',
                created_at: { [Op.between]: [startDate, endDate] }
            }
        }],
        group: ['product_variant_id', 'variant.id', 'variant.product.id'],
        order: [[literal('total_sold'), 'DESC']],
        limit
    });

    return performance;
}

export async function getCategoryPerformance(startDate: Date, endDate: Date) {
    const performance = await OrderItem.findAll({
        attributes: [
            [fn('SUM', col('OrderItem.quantity')), 'total_sold'],
            [fn('SUM', col('OrderItem.price')), 'total_revenue']
        ],
        include: [{
            model: ProductVariant,
            as: 'variant',
            include: [{
                model: Product,
                as: 'product',
                include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
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
        group: ['$variant.product.category.id$'],
        order: [[literal('total_revenue'), 'DESC']]
    });

    return performance;
}

export async function getCustomerSpenders(startDate: Date, endDate: Date, limit: number = 10) {
    const spenders = await Order.findAll({
        attributes: [
            'user_id',
            [fn('SUM', col('total_amount')), 'total_spent'],
            [fn('COUNT', col('id')), 'order_count']
        ],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }],
        where: {
            payment_status: 'paid',
            created_at: { [Op.between]: [startDate, endDate] }
        },
        group: ['user_id', 'user.id'],
        order: [[literal('total_spent'), 'DESC']],
        limit
    });

    return spenders;
}

export async function getVoucherUsageReport(startDate: Date, endDate: Date) {
    return VoucherUsage.findAll({
        attributes: [
            'voucher_id',
            [fn('COUNT', col('id')), 'usage_count']
        ],
        where: {
            used_at: { [Op.between]: [startDate, endDate] }
        },
        group: ['voucher_id'],
        include: ['voucher']
    });
}

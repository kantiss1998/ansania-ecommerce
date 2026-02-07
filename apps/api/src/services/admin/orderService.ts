
import { Order, OrderItem, User, Shipping, Payment } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

export async function listAllOrders(query: any) {
    const {
        page = 1,
        limit = 10,
        status,
        payment_status,
        search,
        startDate,
        endDate
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status && status !== 'all') where.status = status;
    if (payment_status && payment_status !== 'all') where.payment_status = payment_status;

    if (search) {
        where[Op.or] = [
            { order_number: { [Op.like]: `%${search}%` } },
            { '$user.full_name$': { [Op.like]: `%${search}%` } },
            { '$user.email$': { [Op.like]: `%${search}%` } }
        ];
    }

    if (startDate && endDate) {
        where.created_at = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        } as any;
    }

    const { count, rows } = await Order.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [
            { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
            { model: Payment, as: 'payment' }
        ],
        distinct: true
    });

    return {
        data: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
}

export async function getAdminOrderDetail(orderNumber: string) {
    const order = await Order.findOne({
        where: { order_number: orderNumber },
        include: [
            { model: User, as: 'user' },
            { model: OrderItem, as: 'items' },
            { model: Payment, as: 'payment' },
            { model: Shipping, as: 'shipping' }
        ]
    });

    if (!order) throw new NotFoundError('Order');
    return order;
}

export async function updateOrderStatus(orderNumber: string, status: string, adminNote?: string) {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    const updateData: any = { status };
    if (adminNote) updateData.admin_note = adminNote;

    // Specific timestamp updates
    if (status === 'paid') updateData.paid_at = new Date();
    if (status === 'shipped') updateData.shipped_at = new Date();
    if (status === 'delivered') updateData.delivered_at = new Date();
    if (status === 'cancelled') updateData.cancelled_at = new Date();

    await order.update(updateData);
    return order;
}

export async function deleteOrder(orderNumber: string) {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    // Soft delete or strictly restrictive deletion
    // For now, let's keep it simple
    await order.destroy();
    return { success: true };
}

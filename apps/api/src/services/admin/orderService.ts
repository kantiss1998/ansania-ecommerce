import { Order, OrderItem, User, Shipping, Payment } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';
import { ORDER_STATUS, PAYMENT_STATUS } from '@repo/shared/constants';

export interface ListOrdersQuery {
    page?: number | string;
    limit?: number | string;
    status?: string;
    payment_status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    export?: string;
}

export interface AdminOrderListResult {
    items: Order[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ShippingUpdateData {
    tracking_number: string;
    shipped_at?: Date;
}

export async function listAllOrders(query: ListOrdersQuery): Promise<AdminOrderListResult> {
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
            [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
        };
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
        items: rows,
        pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / Number(limit))
        }
    };
}

export async function getAdminOrderDetail(orderNumber: string): Promise<Order> {
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

export async function updateOrderStatus(orderNumber: string, status: string, adminNote?: string): Promise<Order> {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    const updateData: Partial<Order> = { status: status as any };
    if (adminNote) updateData.admin_note = adminNote;

    // Specific timestamp updates
    if (status === ORDER_STATUS.PAID) updateData.paid_at = new Date();
    if (status === ORDER_STATUS.SHIPPED) updateData.shipped_at = new Date();
    if (status === ORDER_STATUS.DELIVERED) updateData.delivered_at = new Date();
    if (status === ORDER_STATUS.CANCELLED) updateData.cancelled_at = new Date();

    await order.update(updateData);
    return order;
}

export async function updatePaymentStatus(orderNumber: string, payment_status: string): Promise<Order> {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    await order.update({ payment_status: payment_status as any });

    if (payment_status === PAYMENT_STATUS.PAID) {
        await order.update({ status: ORDER_STATUS.PAID as any, paid_at: new Date() });
    }

    return order;
}

export async function updateShippingInfo(orderNumber: string, shippingData: ShippingUpdateData): Promise<Order> {
    const order = await Order.findOne({
        where: { order_number: orderNumber },
        include: [{ model: Shipping, as: 'shipping' }]
    });

    if (!order || !order.shipping) throw new NotFoundError('Shipping record for this order');

    await order.shipping.update({
        tracking_number: shippingData.tracking_number,
        shipped_at: shippingData.shipped_at || new Date()
    });

    if (order.status === ORDER_STATUS.PAID) {
        await order.update({ status: ORDER_STATUS.SHIPPED as any, shipped_at: shippingData.shipped_at || new Date() });
    }

    return order;
}

export async function processRefund(orderNumber: string, refundReason: string): Promise<Order> {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    await order.update({
        status: ORDER_STATUS.REFUNDED as any,
        payment_status: PAYMENT_STATUS.REFUNDED as any,
        admin_note: order.admin_note ? `${order.admin_note}\nRefund Reason: ${refundReason}` : `Refund Reason: ${refundReason}`
    });

    return order;
}

export async function updateOrderNotes(orderNumber: string, adminNote: string): Promise<Order> {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    await order.update({ admin_note: adminNote });
    return order;
}

export async function exportOrders(query: ListOrdersQuery): Promise<Order[]> {
    const orders = await listAllOrders({ ...query, limit: 1000, page: 1 });
    return orders.items;
}

export async function deleteOrder(orderNumber: string): Promise<{ success: boolean }> {
    const order = await Order.findOne({ where: { order_number: orderNumber } });
    if (!order) throw new NotFoundError('Order');

    // Soft delete or strictly restrictive deletion
    // For now, let's keep it simple
    await order.destroy();
    return { success: true };
}

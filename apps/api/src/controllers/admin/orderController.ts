
import { toCSV } from '@repo/shared/utils';
import { Request, Response, NextFunction } from 'express';

import * as adminOrderService from '../../services/admin/orderService';

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminOrderService.listAllOrders(req.query);

        if (req.query.export === 'csv') {
            const csv = toCSV(result.items.map((o: any) => ({
                order_number: o.order_number,
                customer: o.user?.full_name,
                total: o.total_amount,
                status: o.status,
                payment: o.payment_status,
                date: o.created_at
            })));
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
            return res.send(csv);
        }

        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return next(error);
    }
}

export async function getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const order = await adminOrderService.getAdminOrderDetail(orderNumber);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const { status, admin_note } = req.body;
        const order = await adminOrderService.updateOrderStatus(orderNumber, status, admin_note);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const { payment_status } = req.body;
        const order = await adminOrderService.updatePaymentStatus(orderNumber, payment_status);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function updateShippingStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const order = await adminOrderService.updateShippingInfo(orderNumber, req.body);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function processRefund(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const { reason } = req.body;
        const order = await adminOrderService.processRefund(orderNumber, reason);
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        await adminOrderService.deleteOrder(orderNumber);
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function updateNotes(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;
        const { notes } = req.body;
        const order = await adminOrderService.updateOrderNotes(orderNumber, notes);
        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
}

export async function exportOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await adminOrderService.exportOrders(req.query);
        res.json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
}

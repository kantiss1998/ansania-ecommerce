
import { Order, Payment, User } from '@repo/database';
import { AppError, NotFoundError } from '@repo/shared/errors';

import { dokuClient, PaymentRequest } from '../integrations/doku/client';

export async function createPayment(orderId: number) {
    const order = await Order.findByPk(orderId, {
        include: [{ model: User, as: 'user' }]
    });

    if (!order) {
        throw new NotFoundError('Order');
    }

    if (order.payment_status === 'paid') {
        throw new AppError('Order has already been paid', 400);
    }

    const paymentRequest: PaymentRequest = {
        order_number: order.order_number,
        amount: Number(order.total_amount),
        customer_email: (order as any).user.email,
        customer_name: (order as any).user.full_name || 'Customer',
        customer_phone: (order as any).user.phone || undefined,
        // Doku Checkout will show all methods by default if not specified
    };

    const response = await dokuClient.generatePayment(paymentRequest);

    // Update order with transaction ID if needed
    // We'll record it in the Payments table as 'pending'
    await Payment.create({
        order_id: order.id,
        payment_method: 'pending',
        payment_provider: 'doku',
        transaction_id: response.transaction_id,
        amount: order.total_amount,
        status: 'pending',
        payment_response: response
    } as any);

    return response;
}

export async function verifyPayment(transactionId: string) {
    // In a real scenario, we'd call Doku API to check status
    const status = await dokuClient.getPaymentStatus(transactionId);

    // Logic to update order/payment based on status could be here,
    // but usually status check is for detail view or manual sync.
    // If status is SUCCESS, we might want to trigger the same logic as webhook.

    return status;
}

export async function getPaymentByTransactionId(transactionId: string) {
    const payment = await Payment.findOne({
        where: { transaction_id: transactionId },
        include: [{ model: Order, as: 'order' }]
    });

    if (!payment) {
        throw new NotFoundError('Payment');
    }

    return payment;
}

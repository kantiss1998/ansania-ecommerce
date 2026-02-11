import { Order, Payment, User, sequelize } from '@repo/database';
import { AppError, NotFoundError } from '@repo/shared/errors';
import { PAYMENT_STATUS, ORDER_STATUS, PAYMENT_PROVIDER } from '@repo/shared/constants';
import { Transaction } from 'sequelize';

import { dokuClient, PaymentRequest, DokuWebhookPayload } from '../integrations/doku/client';
import { OdooOrderService } from './odoo/order.service';

const odooOrderService = new OdooOrderService();

/**
 * Result of webhook processing
 */
export interface WebhookResult {
    success: boolean;
    message?: string;
}

/**
 * Create a new payment session
 */
export async function createPayment(orderId: number) {
    const order = await Order.findByPk(orderId, {
        include: [{ model: User, as: 'user' }]
    });

    if (!order) {
        throw new NotFoundError('Order');
    }

    if (order.payment_status === PAYMENT_STATUS.PAID) {
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
        payment_method: PAYMENT_STATUS.PENDING,
        payment_provider: PAYMENT_PROVIDER.DOKU,
        transaction_id: response.transaction_id,
        amount: order.total_amount,
        status: PAYMENT_STATUS.PENDING,
        payment_response: response
    } as any);

    return response;
}

/**
 * Handle Doku payment webhook notification logic
 */
export async function handleWebhook(payload: DokuWebhookPayload): Promise<WebhookResult> {
    const transaction = await sequelize.transaction();

    try {
        // Find Order
        const order = await Order.findOne({
            where: { order_number: payload.order.invoice_number },
            transaction
        });

        if (!order) {
            console.error('[PAYMENT_WEBHOOK] Order not found:', payload.order.invoice_number);
            await transaction.commit();
            return {
                success: false,
                message: 'Order not found'
            };
        }

        // Check if payment already processed
        const existingPayment = await Payment.findOne({
            where: {
                order_id: order.id,
                status: PAYMENT_STATUS.SUCCESS
            },
            transaction
        });

        if (existingPayment) {
            console.warn('[PAYMENT_WEBHOOK] Payment already processed for order:', order.order_number);
            await transaction.commit();
            return {
                success: true,
                message: 'Payment already processed'
            };
        }

        // Process payment based on status
        if (payload.transaction.status === 'SUCCESS') {
            await handleSuccessfulPayment(order, payload, transaction);
        } else if (payload.transaction.status === 'FAILED') {
            await handleFailedPayment(order, payload, transaction);
        } else if (payload.transaction.status === 'EXPIRED') {
            await handleExpiredPayment(order, payload, transaction);
        } else {
            console.log('[PAYMENT_WEBHOOK] Pending payment status, no action taken');
        }

        await transaction.commit();
        return { success: true };

    } catch (error) {
        await transaction.rollback();
        console.error('[PAYMENT_WEBHOOK] Error processing webhook in service:', error);
        throw error;
    }
}

/**
 * Handle successful payment (internal helper)
 */
async function handleSuccessfulPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing successful payment for:', order.order_number);

    // Update order status
    await order.update({
        status: ORDER_STATUS.PROCESSING,
        payment_status: PAYMENT_STATUS.PAID,
        paid_at: new Date()
    }, { transaction });

    // Create Payment Record
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method as any,
        payment_provider: PAYMENT_PROVIDER.DOKU,
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: PAYMENT_STATUS.SUCCESS,
        payment_response: payload,
        paid_at: new Date()
    }, { transaction });

    // Trigger Odoo Sync asynchronously
    odooOrderService.syncOrder(order.id).then(() => {
        console.log('[PAYMENT] Order synced to Odoo successfully');
    }).catch(err => {
        console.error('[PAYMENT] Odoo Sync Failed:', err);
    });
}

/**
 * Handle failed payment (internal helper)
 */
async function handleFailedPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing failed payment for:', order.order_number);

    await order.update({
        status: ORDER_STATUS.CANCELLED as any,
        payment_status: PAYMENT_STATUS.FAILED as any
    }, { transaction });

    // Create Payment Record (Failed)
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method,
        payment_provider: PAYMENT_PROVIDER.DOKU,
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: PAYMENT_STATUS.FAILED,
        payment_response: payload
    } as any, { transaction });
}

/**
 * Handle expired payment (internal helper)
 */
async function handleExpiredPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing expired payment for:', order.order_number);

    await order.update({
        status: ORDER_STATUS.CANCELLED as any,
        payment_status: PAYMENT_STATUS.EXPIRED as any
    }, { transaction });

    // Create Payment Record (Expired)
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method,
        payment_provider: PAYMENT_PROVIDER.DOKU,
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: PAYMENT_STATUS.EXPIRED,
        payment_response: payload
    } as any, { transaction });
}

/**
 * Explicitly verify payment status from provider
 */
export async function verifyPayment(transactionId: string) {
    const status = await dokuClient.getPaymentStatus(transactionId);
    return status;
}

/**
 * Get payment detail by transaction ID
 */
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

/**
 * Payment Controller
 * Handles Doku payment webhook notifications and payment status updates
 */

import { Request, Response, NextFunction } from 'express';
import { Order, sequelize, Payment } from '@repo/database';
import { Transaction } from 'sequelize';
import { dokuClient, DokuWebhookPayload } from '../integrations/doku/client';
import { OdooOrderService } from '../services/odoo/order.service';
const odooOrderService = new OdooOrderService();
import { AppError } from '@repo/shared/errors';
import * as paymentService from '../services/paymentService';

/**
 * Handle Doku payment webhook notification
 * This endpoint receives payment status updates from Doku
 */
export async function handleNotification(req: Request, res: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();

    try {
        console.log('[PAYMENT_WEBHOOK] Received webhook from Doku');
        console.log('[PAYMENT_WEBHOOK] Headers:', req.headers);
        console.log('[PAYMENT_WEBHOOK] Body:', req.body);

        // 1. Verify Signature
        const isValidSignature = dokuClient.verifySignature(req.headers, req.body);

        if (!isValidSignature && !dokuClient.isMockMode()) {
            console.error('[PAYMENT_WEBHOOK] Invalid signature detected');
            throw new AppError('Invalid Signature', 400);
        }

        // 2. Parse and validate webhook payload
        const payload: DokuWebhookPayload = dokuClient.parseWebhook(req.body);

        console.log('[PAYMENT_WEBHOOK] Parsed payload:', {
            invoice: payload.order.invoice_number,
            status: payload.transaction.status,
            method: payload.payment.method
        });

        // 3. Find Order
        const order = await Order.findOne({
            where: { order_number: payload.order.invoice_number },
            transaction
        });

        if (!order) {
            console.error('[PAYMENT_WEBHOOK] Order not found:', payload.order.invoice_number);
            await transaction.commit();
            // Return 200 to prevent Doku from retrying
            return res.status(200).json({
                success: false,
                message: 'Order not found'
            });
        }

        // 4. Check if payment already processed
        const existingPayment = await Payment.findOne({
            where: {
                order_id: order.id,
                status: 'success'
            },
            transaction
        });

        if (existingPayment) {
            console.warn('[PAYMENT_WEBHOOK] Payment already processed for order:', order.order_number);
            await transaction.commit();
            return res.json({
                success: true,
                message: 'Payment already processed'
            });
        }

        // 5. Process payment based on status
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

        // Return success response to Doku
        return res.json({ success: true });

    } catch (error) {
        await transaction.rollback();
        console.error('[PAYMENT_WEBHOOK] Error processing webhook:', error);
        return next(error);
    }
}

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing successful payment for:', order.order_number);

    // Update order status
    await order.update({
        status: 'processing', // Paid, move to processing
        payment_status: 'paid',
        paid_at: new Date()
    }, { transaction });

    // Create Payment Record
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method as any,
        payment_provider: 'doku',
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: 'success',
        payment_response: payload,
        paid_at: new Date()
    }, { transaction });

    console.log('[PAYMENT] Payment record created successfully');

    // Trigger Odoo Sync asynchronously
    // In production, this should be queued (e.g., BullMQ, Redis Queue)
    odooOrderService.syncOrder(order.id).then(() => {
        console.log('[PAYMENT] Order synced to Odoo successfully');
    }).catch(err => {
        console.error('[PAYMENT] Odoo Sync Failed:', err);
        // Don't fail the transaction - log for manual retry
        // In production: add to retry queue
    });

    // TODO: Send confirmation email
    // TODO: Send notification to customer
    // TODO: Update stock reservation
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing failed payment for:', order.order_number);

    await order.update({
        status: 'payment_failed' as any,
        payment_status: 'failed' as any
    }, { transaction });

    // Create Payment Record (Failed)
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method,
        payment_provider: 'doku',
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: 'failed',
        payment_response: payload
    } as any, { transaction });

    console.log('[PAYMENT] Failed payment recorded');

    // TODO: Release stock reservation
    // TODO: Send failure notification to customer
}

/**
 * Handle expired payment
 */
async function handleExpiredPayment(
    order: Order,
    payload: DokuWebhookPayload,
    transaction: Transaction
) {
    console.log('[PAYMENT] Processing expired payment for:', order.order_number);

    await order.update({
        status: 'payment_expired' as any,
        payment_status: 'expired' as any
    }, { transaction });

    // Create Payment Record (Expired)
    await Payment.create({
        order_id: order.id,
        payment_method: payload.payment.method,
        payment_provider: 'doku',
        transaction_id: payload.transaction.id,
        amount: order.total_amount,
        status: 'expired',
        payment_response: payload
    } as any, { transaction });

    console.log('[PAYMENT] Expired payment recorded');

    // TODO: Release stock reservation
    // TODO: Send expiry notification to customer
}

/**
 * Get payment status by order number
 * Optional endpoint for manual status checking
 */
export async function getPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderNumber } = req.params;

        const order = await Order.findOne({
            where: { order_number: orderNumber },
            include: [{ model: Payment, as: 'payment' }]
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        res.json({
            order_number: order.order_number,
            status: order.status,
            payment_status: order.payment_status,
            total_amount: order.total_amount,
            payment: order.payment
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Test webhook endpoint for development
 * Simulates a successful payment webhook
 */
export async function testWebhook(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }

    try {
        const { orderNumber } = req.body;

        if (!orderNumber) {
            throw new AppError('orderNumber is required', 400);
        }

        // Simulate Doku webhook payload
        const mockWebhook = {
            order: {
                invoice_number: orderNumber,
                amount: 100000
            },
            transaction: {
                id: `TRX-TEST-${Date.now()}`,
                status: 'SUCCESS',
                date: new Date().toISOString()
            },
            payment: {
                method: 'VIRTUAL_ACCOUNT',
                channel: 'BCA'
            }
        };

        // Process the webhook
        req.body = mockWebhook;
        return await handleNotification(req, res, next);

    } catch (error) {
        return next(error);
    }
}

/**
 * Create a new payment session
 */
export async function createPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const { order_id } = req.body;
        if (!order_id) {
            throw new AppError('order_id is required', 400);
        }

        const paymentResponse = await paymentService.createPayment(Number(order_id));

        res.status(201).json({
            success: true,
            data: paymentResponse
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get payment detail by transaction ID
 */
export async function getPaymentByTransactionId(req: Request, res: Response, next: NextFunction) {
    try {
        const { transactionId } = req.params;
        const payment = await paymentService.getPaymentByTransactionId(transactionId);

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Explicitly verify payment status from provider
 */
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const { transactionId } = req.body;
        if (!transactionId) {
            throw new AppError('transactionId is required', 400);
        }

        const status = await paymentService.verifyPayment(transactionId);

        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Payment Controller
 * Handles Doku payment webhook notifications and payment status updates
 */

import { Order, Payment } from "@repo/database";
import { AppError } from "@repo/shared/errors";
import { Request, Response, NextFunction } from "express";

import { dokuClient } from "../integrations/doku/client";
import * as paymentService from "../services/paymentService";

/**
 * Handle Doku payment webhook notification
 * This endpoint receives payment status updates from Doku
 */
export async function handleNotification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("[PAYMENT_WEBHOOK] Received webhook from Doku");

    // 1. Verify Signature
    const isValidSignature = dokuClient.verifySignature(req.headers, req.body);

    if (!isValidSignature && !dokuClient.isMockMode()) {
      console.error("[PAYMENT_WEBHOOK] Invalid signature detected");
      throw new AppError("Invalid Signature", 400);
    }

    // 2. Parse and validate webhook payload
    const payload = dokuClient.parseWebhook(req.body);

    console.log("[PAYMENT_WEBHOOK] Parsed payload:", {
      invoice: payload.order.invoice_number,
      status: payload.transaction.status,
      method: payload.payment.method,
    });

    // 3. Process via service
    const result = await paymentService.handleWebhook(payload);

    // 4. Return response
    if (!result.success) {
      return res.status(200).json(result);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("[PAYMENT_WEBHOOK] Error processing webhook:", error);
    return next(error);
  }
}

/**
 * Get payment status by order number
 */
export async function getPaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({
      where: { order_number: orderNumber },
      include: [{ model: Payment, as: "payment" }],
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json({
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      total_amount: order.total_amount,
      payment: order.payment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Test webhook endpoint for development
 */
export async function testWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Not available in production" });
  }

  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      throw new AppError("orderNumber is required", 400);
    }

    // Simulate Doku webhook payload
    const mockWebhook = {
      order: {
        invoice_number: orderNumber,
        amount: 100000,
      },
      transaction: {
        id: `TRX-TEST-${Date.now()}`,
        status: "SUCCESS",
        date: new Date().toISOString(),
      },
      payment: {
        method: "VIRTUAL_ACCOUNT",
        channel: "BCA",
      },
    };

    // Process the webhook by calling the notification handler
    req.body = mockWebhook;
    return await handleNotification(req, res, next);
  } catch (error) {
    return next(error);
  }
}

/**
 * Create a new payment session
 */
export async function createPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      throw new AppError("order_id is required", 400);
    }

    const paymentResponse = await paymentService.createPayment(
      Number(order_id),
    );

    res.status(201).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get payment detail by transaction ID
 */
export async function getPaymentByTransactionId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { transactionId } = req.params;
    const payment =
      await paymentService.getPaymentByTransactionId(transactionId);

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Explicitly verify payment status from provider
 */
export async function verifyPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      throw new AppError("transactionId is required", 400);
    }

    const status = await paymentService.verifyPayment(transactionId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

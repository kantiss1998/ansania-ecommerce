
import { Router } from 'express';

import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create payment session
router.post('/create', authenticate, paymentController.createPayment);

// Get payment detail by transaction ID
router.get('/:transactionId', authenticate, paymentController.getPaymentByTransactionId);

// Verify payment status (explicit check)
router.post('/verify', authenticate, paymentController.verifyPayment);

// Webhook notification from Doku (Public but signature verified)
router.post('/notification', paymentController.handleNotification);

// Get payment status by order number
router.get('/status/:orderNumber', paymentController.getPaymentStatus);

// Test webhook endpoint (Development only)
router.post('/test-webhook', paymentController.testWebhook);

export default router;

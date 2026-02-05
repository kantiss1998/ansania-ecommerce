
import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';

const router = Router();

// Webhook notification from Doku (Public but signature verified)
router.post('/notification', paymentController.handleNotification);

// Get payment status by order number
router.get('/status/:orderNumber', paymentController.getPaymentStatus);

// Test webhook endpoint (Development only)
router.post('/test-webhook', paymentController.testWebhook);

export default router;

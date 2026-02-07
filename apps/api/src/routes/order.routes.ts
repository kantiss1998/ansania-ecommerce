
import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all order routes
router.use(authenticate);

// Get all orders for the authenticated user
router.get('/', orderController.getOrders);

// Get specific order detail
router.get('/:orderNumber', orderController.getOrderDetail);

// Cancel an order
router.post('/:orderNumber/cancel', orderController.cancelOrder);

export default router;


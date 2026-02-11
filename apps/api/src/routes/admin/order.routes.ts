
import { Router } from 'express';

import * as adminOrderController from '../../controllers/admin/orderController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminOrderController.getAllOrders);
router.post('/export', adminOrderController.exportOrders);
router.get('/:orderNumber', adminOrderController.getOrderDetail);
router.put('/:orderNumber', adminOrderController.updateOrder);
router.patch('/:orderNumber/status', adminOrderController.updateOrder);
router.patch('/:orderNumber/payment-status', adminOrderController.updatePaymentStatus);
router.put('/:orderNumber/shipping', adminOrderController.updateShippingStatus);
router.patch('/:orderNumber/notes', adminOrderController.updateNotes);
router.post('/:orderNumber/refund', adminOrderController.processRefund);
router.delete('/:orderNumber', adminOrderController.deleteOrder);

export default router;

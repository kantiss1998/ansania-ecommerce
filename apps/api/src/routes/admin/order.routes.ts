
import { Router } from 'express';
import * as adminOrderController from '../../controllers/admin/orderController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminOrderController.getAllOrders);
router.get('/:orderNumber', adminOrderController.getOrderDetail);
router.put('/:orderNumber', adminOrderController.updateOrder);
router.patch('/:orderNumber/status', adminOrderController.updateOrder); // Alias to updateOrder for generic status
router.patch('/:orderNumber/payment-status', adminOrderController.updatePaymentStatus);
router.put('/:orderNumber/shipping', adminOrderController.updateShippingStatus);
router.post('/:orderNumber/refund', adminOrderController.processRefund);
router.delete('/:orderNumber', adminOrderController.deleteOrder);

export default router;


import { Router } from 'express';
import * as adminOrderController from '../../controllers/admin/orderController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminOrderController.getAllOrders);
router.get('/:orderNumber', adminOrderController.getOrderDetail);
router.put('/:orderNumber', adminOrderController.updateOrder);
router.delete('/:orderNumber', adminOrderController.deleteOrder);

export default router;

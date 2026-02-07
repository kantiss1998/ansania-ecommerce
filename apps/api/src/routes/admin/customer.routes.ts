
import { Router } from 'express';
import * as adminCustomerController from '../../controllers/admin/customerController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminCustomerController.getAllCustomers);
router.get('/:id', adminCustomerController.getCustomerDetail);
router.get('/:id/orders', adminCustomerController.getOrders);
router.get('/:id/addresses', adminCustomerController.getAddresses);
router.get('/:id/reviews', adminCustomerController.getReviews);
router.get('/:id/stats', adminCustomerController.getStats);
router.put('/:id', adminCustomerController.updateCustomer);
router.patch('/:id/toggle-status', adminCustomerController.toggleStatus);

export default router;


import { Router } from 'express';
import * as adminReportController from '../../controllers/admin/reportController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/sales', adminReportController.getSales);
router.get('/products', adminReportController.getProducts);
router.get('/products/worst', adminReportController.getWorstProducts);
router.get('/categories', adminReportController.getCategories);
router.get('/customers', adminReportController.getCustomers);
router.get('/customers/growth', adminReportController.getGrowth);
router.get('/customers/ltv', adminReportController.getLTV);
router.get('/vouchers', adminReportController.getVouchers);
router.get('/inventory', adminReportController.getInventory);

export default router;

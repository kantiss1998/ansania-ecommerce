
import { Router } from 'express';

import * as adminReportController from '../../controllers/admin/reportController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/sales', adminReportController.getSales);
router.get('/sales/daily', adminReportController.getDailySales);
router.get('/sales/weekly', adminReportController.getWeeklySales);
router.get('/sales/monthly', adminReportController.getMonthlySales);
router.get('/sales/yearly', adminReportController.getYearlySales);

router.get('/products', adminReportController.getProducts);
router.get('/products/best-sellers', adminReportController.getBestSellers);
router.get('/products/worst', adminReportController.getWorstProducts);
router.get('/products/stock-movement', adminReportController.getStockMovement);

router.get('/categories', adminReportController.getCategories);

router.get('/customers', adminReportController.getCustomers);
router.get('/customers/growth', adminReportController.getGrowth);
router.get('/customers/ltv', adminReportController.getLTV);
router.get('/customers/new', adminReportController.getNewCustomers);
router.get('/customers/top-spenders', adminReportController.getTopSpenders);

router.get('/vouchers', adminReportController.getVouchers);
router.get('/inventory', adminReportController.getInventory);
router.get('/worst-sellers', adminReportController.getWorstProducts);

export default router;


import { Router } from 'express';

import * as adminAnalyticsController from '../../controllers/admin/analyticsController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/product-views', adminAnalyticsController.getProductViews);
router.get('/search-history', adminAnalyticsController.getSearchHistory);
router.get('/conversion', adminAnalyticsController.getConversion);
router.get('/abandoned-carts', adminAnalyticsController.getAbandonedCarts);
router.get('/revenue-by-category', adminAnalyticsController.getRevenueByCategory);
router.get('/revenue-by-product', adminAnalyticsController.getRevenueByProduct);
router.get('/overview', adminAnalyticsController.getOverview);
router.get('/customer-behavior', adminAnalyticsController.getCustomerBehavior);

export default router;


import { Router } from 'express';
import * as adminAnalyticsController from '../../controllers/admin/analyticsController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/product-views', adminAnalyticsController.getProductViews);
router.get('/search-history', adminAnalyticsController.getSearchHistory);
router.get('/conversion', adminAnalyticsController.getConversion);

export default router;

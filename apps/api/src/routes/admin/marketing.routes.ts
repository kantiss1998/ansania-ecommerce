
import { Router } from 'express';
import * as adminMarketingController from '../../controllers/admin/marketingController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post('/process-abandoned-carts', adminMarketingController.processAbandonedCarts);
router.post('/send-promotions', adminMarketingController.sendPromotions);

export default router;


import { Router } from 'express';
import * as statsController from '../controllers/statsController';

const router = Router();

// Guest friendly tracking (extract user if auth present done by extractUser middleware or just leave optional)
// We might need a middleware to optionally extract user if header present, but not enforce it.
// Assuming currently auth middleware enforces it.
// Let's rely on standard endpoints being public or auth based on design?
// Tracking is usually public.

router.post('/search', statsController.recordSearch);
router.post('/view/:productId', statsController.recordProductView);
router.get('/top-searches', statsController.getTopSearches);
router.get('/trending-products', statsController.getMostViewedProducts);

export default router;

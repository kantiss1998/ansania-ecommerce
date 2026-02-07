
import { Router } from 'express';
import * as adminReviewController from '../../controllers/admin/reviewController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminReviewController.getAllReviews);
router.patch('/:id/moderate', adminReviewController.moderateReview);
router.delete('/:id', adminReviewController.deleteReview);

export default router;

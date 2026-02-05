
import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
// Need schema for review creation
import { authenticate } from '../middleware/auth';

const router = Router();

// router.post(
//     '/',
//     authenticate,
//     validateRequest(reviewSchema), // TODO: Add review schema
//     reviewController.createReview
// );

// For now without schema validation to speed up, or I add schema
router.post('/', authenticate, reviewController.createReview);

router.get('/:productId', reviewController.getReviewsByProduct);

export default router;

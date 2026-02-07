
import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { validateRequest } from '../middleware/validation';
import { reviewSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
    '/',
    authenticate,
    validateRequest(reviewSchemas.create),
    reviewController.createReview
);

router.get('/:productId', reviewController.getReviewsByProduct);

router.put('/:id', authenticate, reviewController.updateReview);

router.post('/:id/helpful', authenticate, reviewController.markReviewHelpful);

export default router;

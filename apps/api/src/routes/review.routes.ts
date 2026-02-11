
import { reviewSchemas } from '@repo/shared/schemas';
import { Router } from 'express';

import * as reviewController from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

router.post(
    '/',
    authenticate,
    validateRequest(reviewSchemas.create),
    reviewController.createReview
);

router.get('/pending', authenticate, reviewController.getPendingReviews);

router.get('/:productId', reviewController.getReviewsByProduct);

router.put('/:id', authenticate, reviewController.updateReview);

router.delete('/:id', authenticate, reviewController.deleteReview);

router.post('/:id/helpful', authenticate, reviewController.markReviewHelpful);

router.post('/:id/images', authenticate, reviewController.addReviewImage);

router.delete('/:id/images/:imageId', authenticate, reviewController.deleteReviewImage);

export default router;

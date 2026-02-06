
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

export default router;

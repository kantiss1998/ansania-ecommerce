
import { Router } from 'express';
import * as checkoutController from '../controllers/checkoutController';
import { validateRequest } from '../middleware/validation';
import { checkoutSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post(
    '/shipping',
    validateRequest(checkoutSchemas.calculateShipping),
    checkoutController.getShippingRates
);

router.post(
    '/order',
    validateRequest(checkoutSchemas.createOrder),
    checkoutController.createOrder
);

router.post('/validate', checkoutController.validateCheckout);

export default router;


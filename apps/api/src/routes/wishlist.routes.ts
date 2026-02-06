
import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { validateRequest } from '../middleware/validation';
import { wishlistSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    validateRequest(wishlistSchemas.list),
    wishlistController.getWishlist
);

router.post(
    '/',
    validateRequest(wishlistSchemas.add),
    wishlistController.addToWishlist
);

router.delete('/:id', wishlistController.removeFromWishlist);

export default router;

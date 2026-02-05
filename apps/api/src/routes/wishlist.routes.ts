
import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
// import { validateRequest } from '../middleware/validation';
// import { wishlistSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get(
    '/',
    // TODO: Add validation when wishlistSchemas is defined
    // validateRequest(wishlistSchemas.listWishlist),
    wishlistController.getWishlist
);

router.post(
    '/',
    // TODO: Add validation when wishlistSchemas is defined  
    // validateRequest(wishlistSchemas.addToWishlist),
    wishlistController.addToWishlist
);

router.delete('/:id', wishlistController.removeFromWishlist);

export default router;

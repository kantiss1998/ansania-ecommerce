
import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { validateRequest } from '../middleware/validation';
import { userSchemas } from '@repo/shared/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', profileController.getProfile);

router.put(
    '/',
    validateRequest(userSchemas.updateProfile),
    profileController.updateProfile
);

router.put(
    '/password',
    validateRequest(userSchemas.changePassword),
    profileController.changePassword
);

export default router;

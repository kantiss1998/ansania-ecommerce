
import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authSchemas } from '@repo/shared/schemas';
import * as authController from '../controllers/authController';

const router = Router();

router.post(
    '/register',
    validateRequest(authSchemas.register),
    authController.register
);

router.post(
    '/login',
    validateRequest(authSchemas.login),
    authController.login
);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;

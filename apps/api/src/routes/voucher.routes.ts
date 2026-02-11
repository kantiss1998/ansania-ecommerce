
import { cartSchemas } from '@repo/shared/schemas';
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as voucherController from '../controllers/voucherController';
import { validateRequest } from '../middleware/validation';
import { AuthenticatedRequest } from '../types/express';

const router = Router();

// Guest friendly auth extraction
const extractUser = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            (req as AuthenticatedRequest).user = decoded as { userId: number; email: string; role: string };
        } catch (e) { /* empty */ }
    }
    next();
};



router.use(extractUser);

router.get('/available', voucherController.getAvailableVouchers);

router.post(
    '/validate',
    voucherController.validateVoucher
);

router.get('/:code', voucherController.getVoucherByCode);

router.post(
    '/apply',
    validateRequest(cartSchemas.applyVoucher),
    voucherController.applyVoucher
);
router.delete('/remove', voucherController.removeVoucher);

export default router;

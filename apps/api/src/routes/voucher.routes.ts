
import { Router } from 'express';
import * as voucherController from '../controllers/voucherController';
// Need a schema for apply voucher body { code: string }
import jwt from 'jsonwebtoken';

const router = Router();

// Guest friendly auth extraction
const extractUser = (req: any, _res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
        } catch (e) { }
    }
    next();
};

router.use(extractUser);

router.post('/apply', voucherController.applyVoucher);
router.delete('/remove', voucherController.removeVoucher);

export default router;

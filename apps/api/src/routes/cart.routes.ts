
import { Router, Request, Response, NextFunction } from 'express';
import * as cartController from '../controllers/cartController';
import { validateRequest } from '../middleware/validation';
import { cartSchemas } from '@repo/shared/schemas';
import jwt from 'jsonwebtoken';

const router = Router();

// Standard simple optional auth
const extractUser = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            (req as any).user = decoded;
        } catch (e) {
            // Invalid token, ignore or return 401?
            // If they sent garbage, maybe warn.
        }
    }
    next();
};

router.use(extractUser);

router.get('/', cartController.getCart);

router.post(
    '/items',
    validateRequest(cartSchemas.addItem),
    cartController.addItem
);

router.put(
    '/items/:id', // Item ID
    validateRequest(cartSchemas.updateItem),
    cartController.updateItem
);

router.delete('/items/:id', cartController.removeItem);

export default router;

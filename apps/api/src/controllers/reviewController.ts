
import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';
import { AuthenticatedRequest } from '../types/express';
import { CreateReviewDTO } from '@repo/shared/schemas';

export async function createReview(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const body = req.body as CreateReviewDTO;
        const review = await reviewService.createReview(userId, body);
        res.status(201).json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
}

export async function getReviewsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { productId } = req.params;
        const reviews = await reviewService.getReviewsByProduct(Number(productId));
        res.json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
}

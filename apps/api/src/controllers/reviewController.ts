
import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';

export async function createReview(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const review = await reviewService.createReview(userId, req.body);
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

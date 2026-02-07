
import { Request, Response, NextFunction } from 'express';
import * as adminReviewService from '../../services/admin/reviewService';

export async function getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminReviewService.listAllReviews(req.query);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export async function moderateReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { is_approved } = req.body;
        const review = await adminReviewService.moderateReview(Number(id), is_approved);
        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await adminReviewService.deleteReview(Number(id));
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

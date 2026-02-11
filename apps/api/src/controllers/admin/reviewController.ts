
import { Request, Response, NextFunction } from 'express';

import * as adminReviewService from '../../services/admin/reviewService';

export async function getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminReviewService.listAllReviews(req.query);
        res.json({
            success: true,
            data: result
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

export async function bulkApprove(req: Request, res: Response, next: NextFunction) {
    try {
        const { ids } = req.body;
        const result = await adminReviewService.bulkApprove(ids);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function bulkReject(req: Request, res: Response, next: NextFunction) {
    try {
        const { ids } = req.body;
        const result = await adminReviewService.bulkReject(ids);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function approveReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const review = await adminReviewService.moderateReview(Number(id), true);
        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
}

export async function rejectReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const review = await adminReviewService.moderateReview(Number(id), false);
        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
}

export async function getPending(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminReviewService.getPendingReviews(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

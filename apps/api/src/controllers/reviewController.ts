
import { Order } from '@repo/database';
import { CreateReviewDTO } from '@repo/shared/schemas';
import { Request, Response, NextFunction } from 'express';

import * as reviewService from '../services/reviewService';
import { AuthenticatedRequest } from '../types/express';

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

export async function updateReview(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const body = req.body as Partial<CreateReviewDTO>;

        const review = await reviewService.updateReview(userId, Number(id), body);

        res.json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
}

export async function markReviewHelpful(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const result = await reviewService.markReviewHelpful(userId, Number(id));

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getPendingReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const pendingReviews = await reviewService.getPendingReviews(userId);

        res.json({
            success: true,
            data: pendingReviews,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const result = await reviewService.deleteReview(userId, Number(id));

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function addReviewImage(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const { image_url } = req.body;

        if (!image_url) {
            res.status(400).json({ success: false, error: 'Image URL is required' });
            return;
        }

        const reviewImage = await reviewService.addReviewImage(userId, Number(id), image_url);

        res.status(201).json({
            success: true,
            data: reviewImage,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewImage(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id, imageId } = req.params;
        const result = await reviewService.deleteReviewImage(userId, Number(id), Number(imageId));

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function createReviewFromOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { orderNumber } = req.params;
        const body = req.body as CreateReviewDTO;

        // Resolve orderNumber to orderId
        const order = await Order.findOne({ where: { order_number: orderNumber, user_id: userId } });
        if (!order) {
            res.status(404).json({ success: false, error: 'Order not found' });
            return;
        }

        const review = await reviewService.createReview(userId, { ...body, order_id: order.id });
        res.status(201).json({
            success: true,
            data: review,
        });
    } catch (error) {
        next(error);
    }
}


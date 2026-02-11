import { Request, Response, NextFunction } from 'express';

import * as userDashboardService from '../services/userDashboardService';
import { AuthenticatedRequest } from '../types/express';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const dashboard = await userDashboardService.getUserDashboard(userId);

        return res.json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const stats = await userDashboardService.getUserStats(userId);

        return res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getRecentlyViewed(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { limit } = req.query;
        const products = await userDashboardService.getRecentlyViewed(
            userId,
            limit ? Number(limit) : undefined
        );

        return res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { limit } = req.query;
        const recommendations = await userDashboardService.getRecommendations(
            userId,
            limit ? Number(limit) : undefined
        );

        return res.json({
            success: true,
            data: recommendations,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const vouchers = await userDashboardService.getUserVouchers(userId);

        return res.json({
            success: true,
            data: vouchers,
        });
    } catch (error) {
        return next(error);
    }
}

export async function subscribeNewsletter(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { email } = req.body;
        const result = await userDashboardService.subscribeNewsletter(userId, email);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        return next(error);
    }
}


import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../../services/admin/dashboardService';

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
        const overview = await dashboardService.getStatsOverview();
        const performance = await dashboardService.getSalesPerformance();
        const activity = await dashboardService.getRecentActivity();
        const inventory = await dashboardService.getInventoryStatus();

        res.json({
            success: true,
            data: {
                overview,
                performance,
                activity,
                inventory
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getRecentActivity(_req: Request, res: Response, next: NextFunction) {
    try {
        const activity = await dashboardService.getRecentActivity();
        res.json({
            success: true,
            data: activity
        });
    } catch (error) {
        next(error);
    }
}

export async function getTopProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { limit } = req.query;
        const products = await dashboardService.getTopProducts(limit ? Number(limit) : 5);
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
}

export async function getSalesPerformance(req: Request, res: Response, next: NextFunction) {
    try {
        const { period } = req.query;
        const performance = await dashboardService.getSalesPerformance(period as any);
        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        next(error);
    }
}

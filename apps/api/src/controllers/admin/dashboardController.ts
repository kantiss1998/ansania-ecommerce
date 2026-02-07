
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

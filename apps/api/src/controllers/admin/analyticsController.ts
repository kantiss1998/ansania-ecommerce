
import { Request, Response, NextFunction } from 'express';
import * as adminAnalyticsService from '../../services/admin/analyticsService';

function getDateRange(query: any) {
    const startDate = query.startDate ? new Date(query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate as string) : new Date();
    return { startDate, endDate };
}

export async function getProductViews(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getProductViewStats(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getSearchHistory(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getSearchAnalytics(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getConversion(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getConversionStats(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}


import { Request, Response, NextFunction } from 'express';
import * as adminAnalyticsService from '../../services/admin/analyticsService';
import { toCSV } from '@repo/shared/utils';

function getDateRange(query: any) {
    const startDate = query.startDate ? new Date(query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate as string) : new Date();
    return { startDate, endDate };
}

function handleReportResponse(req: Request, res: Response, data: any, filename: string): any {
    if (req.query.export === 'csv') {
        const csv = toCSV(Array.isArray(data) ? data : [data]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        return res.send(csv);
    }
    return res.json({ success: true, data });
}

export async function getProductViews(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getProductViewStats(startDate, endDate);
        handleReportResponse(req, res, data, 'product_views');
    } catch (error) {
        next(error);
    }
}

export async function getSearchHistory(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getSearchAnalytics(startDate, endDate);
        handleReportResponse(req, res, data, 'search_history');
    } catch (error) {
        next(error);
    }
}

export async function getConversion(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getConversionStats(startDate, endDate);
        handleReportResponse(req, res, data, 'conversion_stats');
    } catch (error) {
        next(error);
    }
}

export async function getAbandonedCarts(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getAbandonedCartStats(startDate, endDate);
        handleReportResponse(req, res, data, 'abandoned_carts');
    } catch (error) {
        next(error);
    }
}

export async function getRevenueByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminAnalyticsService.getRevenueByCategory(startDate, endDate);
        handleReportResponse(req, res, data, 'revenue_by_category');
    } catch (error) {
        next(error);
    }
}

export async function getRevenueByProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminAnalyticsService.getRevenueByProduct(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'revenue_by_product');
    } catch (error) {
        next(error);
    }
}

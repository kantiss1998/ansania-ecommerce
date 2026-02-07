
import { Request, Response, NextFunction } from 'express';
import * as adminReportService from '../../services/admin/reportService';

function getDateRange(query: any) {
    const startDate = query.startDate ? new Date(query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate as string) : new Date();
    return { startDate, endDate };
}

export async function getSales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const period = (req.query.period as any) || 'daily';
        const data = await adminReportService.getSalesReport(startDate, endDate, period);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getProductPerformance(startDate, endDate, limit);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getCategoryPerformance(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getCustomerSpenders(startDate, endDate, limit);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getVoucherUsageReport(startDate, endDate);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

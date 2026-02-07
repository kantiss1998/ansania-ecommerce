
import { Request, Response, NextFunction } from 'express';
import * as adminReportService from '../../services/admin/reportService';
import { toCSV } from '@repo/shared/utils';

function getDateRange(query: any) {
    const startDate = query.startDate ? new Date(query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = query.endDate ? new Date(query.endDate as string) : new Date();
    return { startDate, endDate };
}

function handleReportResponse(req: Request, res: Response, data: any, filename: string): any {
    if (req.query.export === 'csv') {
        const csv = toCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
        return res.send(csv);
    }
    return res.json({ success: true, data });
}

export async function getSales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const period = (req.query.period as any) || 'daily';
        const data = await adminReportService.getSalesReport(startDate, endDate, period);
        handleReportResponse(req, res, data, `sales_report_${period}`);
    } catch (error) {
        next(error);
    }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getProductPerformance(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'product_performance');
    } catch (error) {
        next(error);
    }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getCategoryPerformance(startDate, endDate);
        handleReportResponse(req, res, data, 'category_performance');
    } catch (error) {
        next(error);
    }
}

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getCustomerSpenders(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'customer_spenders');
    } catch (error) {
        next(error);
    }
}

export async function getVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getVoucherUsageReport(startDate, endDate);
        handleReportResponse(req, res, data, 'voucher_usage');
    } catch (error) {
        next(error);
    }
}

export async function getGrowth(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const period = (req.query.period as any) || 'daily';
        const data = await adminReportService.getNewCustomersGrowth(startDate, endDate, period);
        handleReportResponse(req, res, data, `customer_growth_${period}`);
    } catch (error) {
        next(error);
    }
}

export async function getLTV(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getCustomerLTV(limit);
        handleReportResponse(req, res, data, 'customer_ltv');
    } catch (error) {
        next(error);
    }
}

export async function getInventory(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminReportService.getInventoryValuation();
        handleReportResponse(req, res, data, 'inventory_valuation');
    } catch (error) {
        next(error);
    }
}

export async function getWorstProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await adminReportService.getWorstSellers(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'worst_products');
    } catch (error) {
        next(error);
    }
}
export async function getDailySales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getSalesReport(startDate, endDate, 'daily');
        handleReportResponse(req, res, data, 'daily_sales');
    } catch (error) {
        next(error);
    }
}

export async function getWeeklySales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getSalesReport(startDate, endDate, 'weekly');
        handleReportResponse(req, res, data, 'weekly_sales');
    } catch (error) {
        next(error);
    }
}

export async function getMonthlySales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getSalesReport(startDate, endDate, 'monthly');
        handleReportResponse(req, res, data, 'monthly_sales');
    } catch (error) {
        next(error);
    }
}

export async function getYearlySales(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getSalesReport(startDate, endDate, 'yearly');
        handleReportResponse(req, res, data, 'yearly_sales');
    } catch (error) {
        next(error);
    }
}

export async function getBestSellers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const data = await adminReportService.getProductPerformance(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'best_sellers');
    } catch (error) {
        next(error);
    }
}

export async function getStockMovement(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getStockMovement(startDate, endDate);
        handleReportResponse(req, res, data, 'stock_movement');
    } catch (error) {
        next(error);
    }
}

export async function getNewCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const data = await adminReportService.getNewCustomersList(startDate, endDate);
        handleReportResponse(req, res, data, 'new_customers');
    } catch (error) {
        next(error);
    }
}

export async function getTopSpenders(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = getDateRange(req.query);
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const data = await adminReportService.getCustomerSpenders(startDate, endDate, limit);
        handleReportResponse(req, res, data, 'top_spenders');
    } catch (error) {
        next(error);
    }
}

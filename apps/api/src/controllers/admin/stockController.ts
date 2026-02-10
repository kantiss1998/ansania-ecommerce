
import { Request, Response, NextFunction } from 'express';
import * as adminStockService from '../../services/admin/stockService';
import { OdooProductService } from '../../services/odoo/product.service';

const odooProductService = new OdooProductService();

export async function getStockLevels(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminStockService.listStockLevels(req.query);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function getVariantStock(req: Request, res: Response, next: NextFunction) {
    try {
        const { variantId } = req.params;
        const result = await adminStockService.getVariantStock(Number(variantId));
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
        const { threshold } = req.query;
        const result = await adminStockService.getLowStock(threshold ? Number(threshold) : 10);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getOutOfStock(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminStockService.getOutOfStock();
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function exportStock(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminStockService.exportStock(req.query);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function syncFromOdoo(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await odooProductService.syncStock();
        res.json({
            success: true,
            message: 'Stock sync initiated successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
}


import { Request, Response, NextFunction } from 'express';
import * as adminStockService from '../../services/admin/stockService';
import { OdooProductService } from '../../services/odoo/product.service';

const odooProductService = new OdooProductService();

export async function getStockLevels(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminStockService.listStockLevels(req.query);
        res.json({
            success: true,
            ...result
        });
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


import { Request, Response, NextFunction } from 'express';
import * as adminStockService from '../../services/admin/stockService';

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

export async function updateStock(req: Request, res: Response, next: NextFunction) {
    try {
        const { variantId } = req.params;
        const { quantity } = req.body;
        const stock = await adminStockService.updateStock(Number(variantId), quantity);
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        next(error);
    }
}

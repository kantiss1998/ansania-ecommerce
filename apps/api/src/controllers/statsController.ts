
import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/statsService';

export async function recordSearch(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { query } = req.body;
        const ipAddress = req.ip;

        await statsService.recordSearch(userId, query, ipAddress);
        res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function recordProductView(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { productId } = req.params;
        const ipAddress = req.ip;

        await statsService.recordProductView(userId, Number(productId), ipAddress);
        res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function getTopSearches(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await statsService.getTopSearches();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getMostViewedProducts(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await statsService.getMostViewedProducts();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

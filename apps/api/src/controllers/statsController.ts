import { Request, Response, NextFunction } from 'express';

import * as statsService from '../services/statsService';
import { AuthenticatedRequest } from '../types/express';

export async function recordSearch(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        const { query } = req.body as { query: string };
        const ipAddress = req.ip;

        await statsService.recordSearch(userId || null, query, ipAddress);
        res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function recordProductView(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        const { productId } = req.params;
        const ipAddress = req.ip;

        await statsService.recordProductView(userId || null, Number(productId), ipAddress);
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


import { Request, Response, NextFunction } from 'express';

import * as marketingService from '../../services/marketingService';

export async function processAbandonedCarts(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await marketingService.processAbandonedCarts();
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function sendPromotions(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await marketingService.sendPromotionalOffers();
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

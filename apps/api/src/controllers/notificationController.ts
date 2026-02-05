
import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const data = await notificationService.getUserNotifications(userId);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        await notificationService.markAsRead(Number(id), userId);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        await notificationService.markAllAsRead(userId);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

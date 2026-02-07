
import { Request, Response, NextFunction } from 'express';
import * as adminSystemService from '../../services/admin/systemService';

// Email Queue
export async function getEmailQueue(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listEmailQueue(req.query);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function retryEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminSystemService.retryEmail(Number(id));
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

// Activity Logs
export async function getActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listActivityLogs(req.query);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// Sync Logs
export async function getSyncLogs(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listSyncLogs(req.query);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

// Notifications
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listSystemNotifications(req.query);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
        const notification = await adminSystemService.createSystemNotification(req.body);
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
}


import { Request, Response, NextFunction } from 'express';

import * as adminSystemService from '../../services/admin/systemService';

// Email Queue
export async function getEmailQueue(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listEmailQueue(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getEmailDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminSystemService.getEmailDetail(Number(id));
        res.json({ success: true, data: result });
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

export async function deleteEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminSystemService.deleteEmail(Number(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function bulkRetryEmails(req: Request, res: Response, next: NextFunction) {
    try {
        const { ids } = req.body;
        const result = await adminSystemService.bulkRetryEmails(ids);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function clearFailedEmails(_req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.clearFailedEmails();
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Activity Logs
export async function getActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listActivityLogs(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getActivityLogsByUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params;
        const result = await adminSystemService.listActivityLogsByUser(Number(userId), req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getActivityLogsByEntity(req: Request, res: Response, next: NextFunction) {
    try {
        const { entityType, entityId } = req.params;
        const result = await adminSystemService.listActivityLogsByEntity(entityType, entityId, req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getActivityLogDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminSystemService.getActivityLogDetail(Number(id));
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

// Sync Logs
export async function getSyncLogs(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listSyncLogs(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getSyncLogDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminSystemService.getSyncLogDetail(Number(id));
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

// Sync Settings
export async function getSyncSettings(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminSystemService.getSyncSettings();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateSyncSettings(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.updateSyncSettings(req.body);
        res.json({ ...result });
    } catch (error) {
        next(error);
    }
}

// Site Settings
export async function getSiteSettings(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminSystemService.getSiteSettings();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateSiteSettings(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.updateSiteSettings(req.body);
        res.json({ ...result });
    } catch (error) {
        next(error);
    }
}

// Notifications
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminSystemService.listSystemNotifications(req.query);
        res.json({ success: true, data: result });
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

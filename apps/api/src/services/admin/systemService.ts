
import { EmailQueue, ActivityLog, SyncLog, Notification, User, CmsSetting } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { EMAIL_STATUS } from '@repo/shared/constants';
import { Op } from 'sequelize';

// Email Queue
export async function listEmailQueue(query: {
    page?: number | string;
    limit?: number | string;
    status?: string;
}): Promise<{ items: EmailQueue[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 20, status } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await EmailQueue.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function retryEmail(id: number): Promise<EmailQueue | null> {
    const email = await EmailQueue.findByPk(id);
    if (email && email.status === EMAIL_STATUS.FAILED) {
        await email.update({ status: EMAIL_STATUS.PENDING, attempts: 0 });
    }
    return email;
}

export async function getEmailDetail(id: number): Promise<EmailQueue> {
    const email = await EmailQueue.findByPk(id);
    if (!email) throw new NotFoundError('Email not found');
    return email;
}

// Activity Logs
export async function listActivityLogs(query: {
    page?: number | string;
    limit?: number | string;
    user_id?: number | string;
    action?: string;
}): Promise<{ items: ActivityLog[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 50, user_id, action } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (user_id) where.user_id = user_id;
    if (action) where.action = action;

    const { count, rows } = await ActivityLog.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function getActivityLogDetail(id: number): Promise<ActivityLog> {
    const log = await ActivityLog.findByPk(id, {
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });
    if (!log) throw new NotFoundError('Activity Log not found');
    return log;
}

export async function deleteEmail(id: number): Promise<{ success: boolean }> {
    const email = await EmailQueue.findByPk(id);
    if (!email) throw new NotFoundError('Email not found');
    await email.destroy();
    return { success: true };
}

export async function bulkRetryEmails(ids: number[]): Promise<{ success: boolean; count: number }> {
    const [updatedCount] = await EmailQueue.update(
        { status: EMAIL_STATUS.PENDING, attempts: 0 },
        { where: { id: ids, status: EMAIL_STATUS.FAILED } }
    );
    return { success: true, count: updatedCount };
}

export async function clearFailedEmails(): Promise<{ success: boolean; count: number }> {
    const deletedCount = await EmailQueue.destroy({ where: { status: EMAIL_STATUS.FAILED } });
    return { success: true, count: deletedCount };
}

export async function listActivityLogsByUser(userId: number, query: any): Promise<{ items: ActivityLog[]; meta: any }> {
    return listActivityLogs({ ...query, user_id: userId });
}

export async function listActivityLogsByEntity(entityType: string, _entityId: string, query: any): Promise<{ items: ActivityLog[]; meta: any }> {
    const { page = 1, limit = 50 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await ActivityLog.findAndCountAll({
        where: {
            action: { [Op.like]: `%${entityType}%` },
        },
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

// Sync Logs
export async function listSyncLogs(query: {
    page?: number | string;
    limit?: number | string;
    sync_type?: string;
}): Promise<{ items: SyncLog[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 50, sync_type } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (sync_type) where.sync_type = sync_type;

    const { count, rows } = await SyncLog.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function getSyncLogDetail(id: number): Promise<SyncLog> {
    const log = await SyncLog.findByPk(id);
    if (!log) throw new NotFoundError('SyncLog not found');
    return log;
}

// System Notifications
export async function listSystemNotifications(query: {
    page?: number | string;
    limit?: number | string;
}): Promise<{ items: Notification[]; meta: { total: number; page: number; limit: number } }> {
    const { page = 1, limit = 20 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Notification.findAndCountAll({
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function createSystemNotification(data: Partial<Notification>): Promise<Notification> {
    return Notification.create(data as any);
}

// Site Settings
export async function getSyncSettings(): Promise<CmsSetting[]> {
    return CmsSetting.findAll({ where: { setting_group: 'sync' } });
}

export async function getSiteSettings(): Promise<CmsSetting[]> {
    return CmsSetting.findAll({ where: { setting_group: 'site' } });
}

export async function updateSyncSettings(settings: Record<string, any>): Promise<{ success: boolean }> {
    const { odooClient } = require('../../services/odoo/odoo.client');

    for (const [key, value] of Object.entries(settings)) {
        await CmsSetting.update(
            { setting_value: typeof value === 'string' ? value : JSON.stringify(value) },
            { where: { setting_key: key, setting_group: 'sync' } }
        );
    }

    // Refresh Odoo configuration
    const updatedSettings = await getSyncSettings();
    await odooClient.refreshFromSettings(updatedSettings);

    return { success: true };
}

export async function updateSiteSettings(settings: Record<string, any>): Promise<{ success: boolean }> {
    for (const [key, value] of Object.entries(settings)) {
        await CmsSetting.update(
            { setting_value: typeof value === 'string' ? value : JSON.stringify(value) },
            { where: { setting_key: key, setting_group: 'site' } }
        );
    }
    return { success: true };
}

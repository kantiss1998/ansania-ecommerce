
import { EmailQueue, ActivityLog, SyncLog, Notification, User, CmsSetting } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';

// Email Queue
export async function listEmailQueue(query: any) {
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

    return { data: rows, meta: { total: count, page, limit } };
}

export async function retryEmail(id: number) {
    const email = await EmailQueue.findByPk(id);
    if (email && email.status === 'failed') {
        await email.update({ status: 'pending', attempts: 0 });
    }
    return email;
}

export async function getEmailDetail(id: number) {
    const email = await EmailQueue.findByPk(id);
    if (!email) throw new NotFoundError('Email not found');
    return email;
}

// Activity Logs
export async function listActivityLogs(query: any) {
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

    return { data: rows, meta: { total: count, page, limit } };
}

export async function getActivityLogDetail(id: number) {
    const log = await ActivityLog.findByPk(id, {
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });
    if (!log) throw new NotFoundError('Activity Log not found');
    return log;
}

// Sync Logs
export async function listSyncLogs(query: any) {
    const { page = 1, limit = 50, entity_type } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (entity_type) where.entity_type = entity_type;

    const { count, rows } = await SyncLog.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
    });

    return { data: rows, meta: { total: count, page, limit } };
}

export async function getSyncLogDetail(id: number) {
    const log = await SyncLog.findByPk(id);
    if (!log) throw new NotFoundError('SyncLog not found');
    return log;
}

// System Notifications
export async function listSystemNotifications(query: any) {
    const { page = 1, limit = 20 } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Notification.findAndCountAll({
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
    });

    return { data: rows, meta: { total: count, page, limit } };
}

export async function createSystemNotification(data: any) {
    return Notification.create(data);
}

// Sync Settings
export async function getSyncSettings() {
    return CmsSetting.findAll({ where: { setting_group: 'sync' } });
}

export async function updateSyncSettings(settings: Record<string, any>) {
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

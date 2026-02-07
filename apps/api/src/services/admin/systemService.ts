
import { EmailQueue, ActivityLog, SyncLog, Notification, User } from '@repo/database';

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

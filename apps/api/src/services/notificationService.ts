
import { Notification } from '@repo/database';

export async function getUserNotifications(userId: number) {
    return Notification.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
    });
}

export async function markAsRead(notificationId: number, userId: number) {
    const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId }
    });

    if (notification) {
        await notification.update({ is_read: true });
    }

    return notification;
}

export async function markAllAsRead(userId: number) {
    return Notification.update(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
    );
}

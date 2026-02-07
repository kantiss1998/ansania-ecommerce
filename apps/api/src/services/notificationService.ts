
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

// Get unread notifications
export async function getUnreadNotifications(userId: number) {
    return Notification.findAll({
        where: {
            user_id: userId,
            is_read: false
        },
        order: [['created_at', 'DESC']]
    });
}

// Delete a notification
export async function deleteNotification(notificationId: number, userId: number) {
    const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId }
    });

    if (notification) {
        await notification.destroy();
    }

    return { success: true };
}

// Get unread notification count
export async function getNotificationCount(userId: number) {
    const count = await Notification.count({
        where: {
            user_id: userId,
            is_read: false
        }
    });

    return { unread_count: count };
}


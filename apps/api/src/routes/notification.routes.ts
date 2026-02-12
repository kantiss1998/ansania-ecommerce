import { Router } from "express";

import * as notificationController from "../controllers/notificationController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", notificationController.getNotifications);
router.get("/unread", notificationController.getUnreadNotifications);
router.get("/count", notificationController.getNotificationCount);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;

import { Router } from "express";

import * as adminSystemController from "../../controllers/admin/systemController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/email-queue", adminSystemController.getEmailQueue);
router.get("/email-queue/:id", adminSystemController.getEmailDetail);
router.post("/email-queue/:id/retry", adminSystemController.retryEmail);
router.delete("/email-queue/:id", adminSystemController.deleteEmail);
router.post("/email-queue/bulk-retry", adminSystemController.bulkRetryEmails);
router.delete(
  "/email-queue/clear-failed",
  adminSystemController.clearFailedEmails,
);

router.get("/activity-logs", adminSystemController.getActivityLogs);
router.get("/activity-logs/:id", adminSystemController.getActivityLogDetail);
router.get(
  "/activity-logs/user/:userId",
  adminSystemController.getActivityLogsByUser,
);
router.get(
  "/activity-logs/entity/:entityType/:entityId",
  adminSystemController.getActivityLogsByEntity,
);

router.get("/sync-logs", adminSystemController.getSyncLogs);
router.get("/sync-logs/:id", adminSystemController.getSyncLogDetail);

router.get("/settings", adminSystemController.getSiteSettings);
router.put("/settings", adminSystemController.updateSiteSettings);

router.get("/notifications", adminSystemController.getNotifications);
router.post("/notifications", adminSystemController.sendNotification);

export default router;


import { Router } from 'express';
import * as adminSystemController from '../../controllers/admin/systemController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/email-queue', adminSystemController.getEmailQueue);
router.get('/email-queue/:id', adminSystemController.getEmailDetail);
router.post('/email-queue/:id/retry', adminSystemController.retryEmail);

router.get('/activity-logs', adminSystemController.getActivityLogs);
router.get('/activity-logs/:id', adminSystemController.getActivityLogDetail);

router.get('/sync-logs', adminSystemController.getSyncLogs);
router.get('/sync-logs/:id', adminSystemController.getSyncLogDetail);

router.get('/notifications', adminSystemController.getNotifications);
router.post('/notifications', adminSystemController.sendNotification);

export default router;

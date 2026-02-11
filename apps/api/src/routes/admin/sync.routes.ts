
import { Router } from 'express';

import * as adminSystemController from '../../controllers/admin/systemController';
import * as odooController from '../../controllers/odooController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

// Core Sync Operations (from Odoo)
router.post('/products', odooController.syncProducts);
router.post('/stock', odooController.syncStock);
router.post('/categories', odooController.syncCategories);
router.post('/orders/status', odooController.syncOrderStatus);
router.post('/orders/:orderId', odooController.syncOrder);
router.post('/customers/:userId', odooController.syncCustomer);

// Sync Status & Logs
router.get('/status', odooController.getSyncStatus);
router.get('/logs', adminSystemController.getSyncLogs);
router.get('/logs/:id', adminSystemController.getSyncLogDetail);

// Sync Settings
router.get('/settings', adminSystemController.getSyncSettings);
router.put('/settings', adminSystemController.updateSyncSettings);

export default router;

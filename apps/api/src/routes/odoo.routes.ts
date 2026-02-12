import { Router } from "express";

import * as odooController from "../controllers/odooController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All Odoo sync endpoints require authentication
router.use(authenticate);

// Sync products from Odoo to local database
router.post("/sync/products", odooController.syncProducts);

// Sync stock from Odoo to local database
router.post("/sync/stock", odooController.syncStock);

// Sync customer to Odoo
router.post("/sync/customer/:userId", odooController.syncCustomer);

// Sync order to Odoo (manual re-sync)
router.post("/sync/order/:orderId", odooController.syncOrder);

// Sync order status from Odoo (polling)
router.post("/sync/order-status", odooController.syncOrderStatus);

// Get sync status
router.get("/sync/status", odooController.getSyncStatus);

export default router;

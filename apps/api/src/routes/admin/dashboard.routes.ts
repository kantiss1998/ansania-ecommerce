import { Router } from "express";

import * as dashboardController from "../../controllers/admin/dashboardController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/stats", dashboardController.getDashboardStats);
router.get("/recent-activity", dashboardController.getRecentActivity);
router.get("/top-products", dashboardController.getTopProducts);
router.get("/performance", dashboardController.getSalesPerformance);
router.get("/revenue-chart", dashboardController.getSalesPerformance);

export default router;

import { Router } from "express";

import * as userDashboardController from "../controllers/userDashboardController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All user dashboard routes require authentication
router.use(authenticate);

// Dashboard summary
router.get("/dashboard", userDashboardController.getDashboard);

// User statistics
router.get("/stats", userDashboardController.getStats);

// Recently viewed products
router.get("/recently-viewed", userDashboardController.getRecentlyViewed);

// Personalized recommendations
router.get("/recommendations", userDashboardController.getRecommendations);

// User's vouchers
router.get("/vouchers", userDashboardController.getVouchers);

// Subscribe to newsletter
router.post(
  "/subscribe-newsletter",
  userDashboardController.subscribeNewsletter,
);

export default router;

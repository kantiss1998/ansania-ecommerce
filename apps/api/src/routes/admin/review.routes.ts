import { Router } from "express";

import * as adminReviewController from "../../controllers/admin/reviewController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", adminReviewController.getAllReviews);
router.get("/pending", adminReviewController.getPending);
router.patch("/:id/moderate", adminReviewController.moderateReview);
router.patch("/:id/approve", adminReviewController.moderateReview); // Alias
router.patch("/:id/reject", adminReviewController.moderateReview); // Alias
router.post("/bulk-approve", adminReviewController.bulkApprove);
router.post("/bulk-reject", adminReviewController.bulkReject);
router.delete("/:id", adminReviewController.deleteReview);

export default router;

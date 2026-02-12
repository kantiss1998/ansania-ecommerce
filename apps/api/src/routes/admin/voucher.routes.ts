import { Router } from "express";

import * as adminVoucherController from "../../controllers/admin/voucherController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", adminVoucherController.getAllVouchers);
router.post("/", adminVoucherController.createVoucher);
router.post("/bulk-delete", adminVoucherController.bulkDeleteVouchers);
router.get("/:id", adminVoucherController.getVoucherDetail);
router.get("/:id/history", adminVoucherController.getVoucherHistory); // Added for history
router.put("/:id", adminVoucherController.updateVoucher);
router.delete("/:id", adminVoucherController.deleteVoucher);
router.patch("/:id/toggle-active", adminVoucherController.toggleVoucherActive);
router.get("/:id/stats", adminVoucherController.getVoucherStats);

export default router;

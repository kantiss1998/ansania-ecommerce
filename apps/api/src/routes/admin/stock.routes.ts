import { Router } from "express";

import * as adminStockController from "../../controllers/admin/stockController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", adminStockController.getStockLevels);
router.post("/sync", adminStockController.syncFromOdoo);
router.post("/export", adminStockController.exportStock);
router.get("/low-stock", adminStockController.getLowStock);
router.get("/out-of-stock", adminStockController.getOutOfStock);
router.get("/:variantId", adminStockController.getVariantStock);

export default router;

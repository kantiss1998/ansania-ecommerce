import { Router } from "express";

import * as adminCategoryController from "../../controllers/admin/categoryController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", adminCategoryController.getAllCategories);
router.post("/reorder", adminCategoryController.reorderCategories);
router.post("/:id/image", upload.single("image"), adminCategoryController.uploadCategoryImage);
router.get("/:id", adminCategoryController.getCategoryDetail);
router.get("/:id/stats", adminCategoryController.getCategoryStats);
router.put("/:id", adminCategoryController.updateCategory);
router.put("/:id/seo", adminCategoryController.updateCategorySeo);
router.patch("/:id/toggle-active", adminCategoryController.toggleActive);

export default router;

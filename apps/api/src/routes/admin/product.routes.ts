import { Router } from "express";

import * as adminProductController from "../../controllers/admin/productController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

const router = Router();
router.use(authenticate, authorizeAdmin);

// Product Browsing
router.get("/", adminProductController.getAllProducts);
router.get("/:id", adminProductController.getProductDetail);

// Limited Local Updates
router.put("/:id", adminProductController.updateProduct);
router.patch("/:id/toggle-active", adminProductController.toggleActive);
router.patch("/:id/toggle-featured", adminProductController.toggleFeatured);
router.put("/:id/seo", adminProductController.updateSEO);
router.put("/:id/description", adminProductController.updateDescription);

// Image Management
router.get("/:id/images", adminProductController.getImages);
router.post(
  "/:id/images",
  upload.single("image"),
  adminProductController.uploadImage,
);
router.delete("/:id/images/:imageId", adminProductController.deleteImage);
router.patch(
  "/:id/images/:imageId/set-primary",
  adminProductController.setPrimaryImage,
);

// Variants
router.get("/:id/variants", adminProductController.getVariants);
router.get("/:id/variants/:variantId", adminProductController.getVariantDetail);

export default router;

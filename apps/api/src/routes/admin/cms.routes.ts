import { Router } from "express";

import * as adminCmsController from "../../controllers/admin/cmsController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

// Banners
router.get("/banners", adminCmsController.getAllBanners);
router.get("/banners/:id", adminCmsController.getBannerDetail);
router.post("/banners", adminCmsController.createBanner);
router.put("/banners/:id", adminCmsController.updateBanner);
router.delete("/banners/:id", adminCmsController.deleteBanner);
router.patch(
  "/banners/:id/toggle-active",
  adminCmsController.toggleBannerActive,
);
router.post("/banners/reorder", adminCmsController.reorderBanners);

// Pages
router.get("/pages", adminCmsController.getAllPages);
router.get("/pages/:id", adminCmsController.getPageDetail);
router.post("/pages", adminCmsController.createPage);
router.put("/pages/:id", adminCmsController.updatePage);
router.delete("/pages/:id", adminCmsController.deletePage);
router.patch("/pages/:id/publish", (req, res, next) => {
  req.body.publish = true;
  adminCmsController.togglePagePublish(req, res, next);
});
router.patch("/pages/:id/unpublish", (req, res, next) => {
  req.body.publish = false;
  adminCmsController.togglePagePublish(req, res, next);
});

// Settings
router.get("/settings", adminCmsController.getAllSettings);
router.get("/settings/:key", adminCmsController.getSettingByKey);
router.put("/settings/:key", adminCmsController.updateSetting);
router.post("/settings/bulk", adminCmsController.bulkUpdateSettings);

export default router;

import { Router } from "express";

import * as cmsController from "../controllers/cmsController";

const router = Router();

router.get("/banners", cmsController.getBanners);
router.get("/pages", cmsController.getAllPages);
router.get("/pages/:slug", cmsController.getPage);
router.put("/pages/:id", cmsController.updatePage);
router.get("/settings", cmsController.getSettings);
router.get("/settings/:key", cmsController.getSettingByKey);

export default router;

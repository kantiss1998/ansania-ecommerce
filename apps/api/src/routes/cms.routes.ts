
import { Router } from 'express';
import * as cmsController from '../controllers/cmsController';

const router = Router();

router.get('/banners', cmsController.getBanners);
router.get('/pages/:slug', cmsController.getPage);
router.get('/settings', cmsController.getSettings);

export default router;

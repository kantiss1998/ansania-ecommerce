
import { Router } from 'express';
import * as adminCmsController from '../../controllers/admin/cmsController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

// Banners
router.get('/banners', adminCmsController.getAllBanners);
router.post('/banners', adminCmsController.createBanner);
router.put('/banners/:id', adminCmsController.updateBanner);
router.delete('/banners/:id', adminCmsController.deleteBanner);

// Pages
router.get('/pages', adminCmsController.getAllPages);
router.post('/pages', adminCmsController.createPage);
router.put('/pages/:id', adminCmsController.updatePage);
router.delete('/pages/:id', adminCmsController.deletePage);

// Settings
router.get('/settings', adminCmsController.getAllSettings);
router.put('/settings/:key', adminCmsController.updateSetting);
router.post('/settings/bulk', adminCmsController.bulkUpdateSettings);

export default router;

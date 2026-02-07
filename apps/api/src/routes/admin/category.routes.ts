
import { Router } from 'express';
import * as adminCategoryController from '../../controllers/admin/categoryController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminCategoryController.getAllCategories);
router.post('/reorder', adminCategoryController.reorderCategories);
router.get('/:id', adminCategoryController.getCategoryDetail);
router.get('/:id/stats', adminCategoryController.getCategoryStats);
router.put('/:id', adminCategoryController.updateCategory);
router.put('/:id/seo', adminCategoryController.updateCategorySeo);
router.patch('/:id/toggle-active', adminCategoryController.toggleActive);

export default router;

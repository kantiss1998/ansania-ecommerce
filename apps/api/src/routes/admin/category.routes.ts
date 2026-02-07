
import { Router } from 'express';
import * as adminCategoryController from '../../controllers/admin/categoryController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminCategoryController.getAllCategories);
router.get('/:id', adminCategoryController.getCategoryDetail);
router.get('/:id/stats', adminCategoryController.getCategoryStats);
router.put('/:id', adminCategoryController.updateCategory);

export default router;

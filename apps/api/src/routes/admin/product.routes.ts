
import { Router } from 'express';
import * as adminProductController from '../../controllers/admin/productController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminProductController.getAllProducts);
router.post('/', adminProductController.createProduct);
router.put('/:id', adminProductController.updateProduct);
router.delete('/:id', adminProductController.deleteProduct);

router.post('/:id/variants', adminProductController.addVariant);

export default router;

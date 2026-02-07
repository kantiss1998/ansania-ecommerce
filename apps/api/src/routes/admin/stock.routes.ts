
import { Router } from 'express';
import * as adminStockController from '../../controllers/admin/stockController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminStockController.getStockLevels);
router.put('/:variantId', adminStockController.updateStock);

export default router;

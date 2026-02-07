
import { Router } from 'express';
import * as adminFlashSaleController from '../../controllers/admin/flashSaleController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminFlashSaleController.getAllFlashSales);
router.get('/:id', adminFlashSaleController.getFlashSaleDetail);
router.post('/', adminFlashSaleController.createFlashSale);
router.put('/:id', adminFlashSaleController.updateFlashSale);
router.delete('/:id', adminFlashSaleController.deleteFlashSale);

router.post('/:id/products', adminFlashSaleController.addProducts);
router.delete('/products/:id', adminFlashSaleController.removeProduct);

export default router;

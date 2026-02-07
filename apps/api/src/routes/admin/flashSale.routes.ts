
import { Router } from 'express';
import * as adminFlashSaleController from '../../controllers/admin/flashSaleController';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', adminFlashSaleController.getAllFlashSales);
router.post('/', adminFlashSaleController.createFlashSale);
router.get('/:id', adminFlashSaleController.getFlashSaleDetail);
router.put('/:id', adminFlashSaleController.updateFlashSale);
router.delete('/:id', adminFlashSaleController.deleteFlashSale);
router.patch('/:id/toggle-active', adminFlashSaleController.toggleFlashSaleActive);

// Product management within Flash Sale
router.get('/:id/products', adminFlashSaleController.getFlashSaleProducts);
router.post('/:id/products', adminFlashSaleController.addProducts);
router.put('/products/:id', adminFlashSaleController.updateFlashSaleProduct);
router.delete('/products/:id', adminFlashSaleController.removeProduct);

export default router;

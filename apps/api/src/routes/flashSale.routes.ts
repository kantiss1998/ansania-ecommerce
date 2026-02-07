
import { Router } from 'express';
import * as flashSaleController from '../controllers/flashSaleController';

const router = Router();

router.get('/active', flashSaleController.getActiveFlashSales);
router.get('/:id', flashSaleController.getFlashSale);
router.get('/:id/products', flashSaleController.getFlashSaleProducts);

export default router;


import { Router } from 'express';
import * as flashSaleController from '../controllers/flashSaleController';

const router = Router();

router.get('/active', flashSaleController.getActiveFlashSales);
router.get('/:id', flashSaleController.getFlashSale);

export default router;


import { Router } from 'express';
import * as shippingController from '../controllers/shippingController';

const router = Router();

// Public routes (used in checkout/address forms)
router.get('/provinces', shippingController.getProvinces);
router.get('/cities', shippingController.getCities);

export default router;

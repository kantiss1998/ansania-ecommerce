
import { Router } from 'express';

import * as shippingController from '../controllers/shippingController';

const router = Router();

// Public routes (used in checkout/address forms)
router.get('/provinces', shippingController.getProvinces);
router.get('/cities', shippingController.getCities);
router.get('/couriers', shippingController.getCouriers);

// Calculation & Tracking
router.post('/calculate', shippingController.calculateShipping);
router.get('/track/:trackingNumber', shippingController.trackShipment);

export default router;

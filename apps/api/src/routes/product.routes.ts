
import { Router } from 'express';
import * as productController from '../controllers/productController';
import { validateRequest } from '../middleware/validation';
import { productSchemas } from '@repo/shared/schemas';

const router = Router();

router.get(
    '/',
    validateRequest(productSchemas.listProducts),
    productController.getProducts
);

router.get('/:slug', productController.getProductDetail);

// Product Filters/Attributes
router.get('/attributes/:attribute', productController.getAttributes);

// Search Stats
router.post('/stats/search', productController.recordSearch);

// Temporary Sync Endpoint
router.post('/sync', productController.syncProducts);

export default router;

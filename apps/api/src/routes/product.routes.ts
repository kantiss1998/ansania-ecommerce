
import { Router } from 'express';
import * as productController from '../controllers/productController';
import * as reviewController from '../controllers/reviewController';
import { validateRequest } from '../middleware/validation';
import { productSchemas } from '@repo/shared/schemas';

const router = Router();

router.get(
    '/',
    validateRequest(productSchemas.listProducts),
    productController.getProducts
);

// Specific routes BEFORE dynamic :slug route
router.get('/featured', productController.getFeaturedProducts);

router.get('/new-arrivals', productController.getNewArrivals);

router.get('/recommended', productController.getRecommendedProducts);

router.get('/:slug', productController.getProductDetail);

// Routes with :id parameter
router.get('/:id/variants', productController.getProductVariants);

// Reviews for a product
router.get('/:productId/reviews', reviewController.getReviewsByProduct);

router.get('/related/:productId', productController.getRelatedProducts);

router.get('/similar/:productId', productController.getSimilarProducts);

// Product Filters/Attributes
router.get('/attributes/:attribute', productController.getAttributes);

// Search Stats
router.post('/stats/search', productController.recordSearch);

// Temporary Sync Endpoint
router.post('/sync', productController.syncProducts);

export default router;


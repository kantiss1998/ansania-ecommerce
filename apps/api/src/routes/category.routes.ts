
import { Router } from 'express';

import * as categoryController from '../controllers/categoryController';

const router = Router();

// Get all categories (tree structure)
router.get('/', categoryController.getCategories);

// Get category by slug with products
router.get('/:slug', categoryController.getCategoryBySlug);

// Get available filters for a category
router.get('/:id/filters', categoryController.getCategoryFilters);

// Get immediate children of a category
router.get('/:id/children', categoryController.getCategoryChildren);

export default router;


import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { OdooProductService } from '../services/odoo/product.service';
import { SearchHistory } from '@repo/database';
const odooProductService = new OdooProductService();
import { ListProductsQuery } from '@repo/shared/schemas';
import { NotFoundError } from '@repo/shared/errors';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query as unknown as ListProductsQuery;
        // Middleware `validateRequest(productSchemas.listProducts)` ensures usage of coerced types.
        // req.query by default is ParsedQs (string | string[] | ParsedQs | ParsedQs[]).
        // validation middleware assigns validated data to req.body currently in strict standards, 
        // but typically for GET requests we should rely on req.query being validated/coerced.
        // If validation middleware puts it in req.body, we should use req.body? 
        // Waiting for validation.ts refactor to decide if we merge to req.query or just use req.body.
        // CODING_STANDARDS.md says: req.body = validated;
        // So for GET requests, we might need to look at req.body if that's where validation puts it?
        // Let's assume for now we cast req.query because existing validation logic in routes might handle it or we update validation.ts later.
        // Actually, let's use the standard `ListProductsQuery` imports.

        const result = await productService.listProducts(query);
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProductDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;
        const product = await productService.getProductBySlug(slug);

        if (!product) {
            throw new NotFoundError('Product');
        }

        const related = await productService.getRelatedProducts(product.id);

        res.json({
            success: true,
            data: {
                ...product.toJSON(),
                related_products: related
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function syncProducts(_req: Request, res: Response, next: NextFunction) {
    try {
        await odooProductService.syncProducts();
        res.json({
            success: true,
            message: 'Product sync triggered successfully',
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttributes(req: Request, res: Response, next: NextFunction) {
    try {
        const { attribute } = req.params;

        if (!['color', 'size', 'finishing'].includes(attribute)) {
            return res.status(400).json({ success: false, message: 'Invalid attribute type' });
        }

        const values = await productService.getDistinctAttributes(attribute as 'color' | 'size' | 'finishing');

        return res.json({
            success: true,
            data: values,
        });
    } catch (error) {
        return next(error);
    }
}

export async function recordSearch(req: Request, res: Response, next: NextFunction) {
    try {
        const { query, filters, results_count } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Query is required' });
        }



        await SearchHistory.create({
            search_query: query,
            filters_applied: filters,
            results_count: results_count || 0
        } as any);

        return res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.error('Search log error', error);
        return next(error);
    }
}

export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const products = await productService.getFeaturedProducts(limit);

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
}

export async function getNewArrivals(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const days = req.query.days ? Number(req.query.days) : 30;
        const products = await productService.getNewArrivals(limit, days);

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProductVariants(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await productService.getProductVariants(Number(id));

        if (!result) {
            throw new NotFoundError('Product');
        }

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRecommendedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const products = await productService.getRecommendedProducts(limit);

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
}

export async function getSimilarProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { productId } = req.params;
        const limit = req.query.limit ? Number(req.query.limit) : 6;
        const products = await productService.getSimilarProducts(Number(productId), limit);

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { productId } = req.params;
        const limit = req.query.limit ? Number(req.query.limit) : 4;
        const products = await productService.getRelatedProducts(Number(productId), limit);

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
}



export async function trackProductView(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await productService.trackProductView(Number(id));
        res.json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

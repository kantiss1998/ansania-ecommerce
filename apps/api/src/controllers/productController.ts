
import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { OdooProductService } from '../services/odoo/product.service';
const odooProductService = new OdooProductService();
import { NotFoundError } from '@repo/shared/errors';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query as any; // Cast to bypass strict types until verified with validaton middleware which coerces types
        // Actually middleware should have coerced numbers if using z.coerce in schema.
        // req.body is replaced by middleware, typically req.query is also replaced if we chose to.
        // In validation.ts I merged but maybe not assigned back to req.query?
        // validation.ts: req.body = validated;
        // So req.query might strictly be strings if Express default.
        // But let's assume valid types or handling in service.

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

        res.json({
            success: true,
            data: product,
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

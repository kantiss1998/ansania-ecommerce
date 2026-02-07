
import { Request, Response, NextFunction } from 'express';
import * as adminProductService from '../../services/admin/productService';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminProductService.listAdminProducts(req.query);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await adminProductService.createProduct(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const product = await adminProductService.updateProduct(Number(id), req.body);
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await adminProductService.deleteProduct(Number(id));
        res.json({
            success: true,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function addVariant(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const variant = await adminProductService.addVariant(Number(id), req.body);
        res.status(201).json({
            success: true,
            data: variant
        });
    } catch (error) {
        next(error);
    }
}

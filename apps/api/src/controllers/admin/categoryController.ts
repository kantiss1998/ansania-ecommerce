
import { Request, Response, NextFunction } from 'express';
import * as adminCategoryService from '../../services/admin/categoryService';

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await adminCategoryService.listAdminCategories(req.query);
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await adminCategoryService.getCategoryDetail(Number(id));
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await adminCategoryService.updateCategory(Number(id), req.body);
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
}

export async function toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const category = await adminCategoryService.toggleCategoryActive(Number(id));
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryStats(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const stats = await adminCategoryService.getCategoryStats(Number(id));
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
}

export async function reorderCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const { orders } = req.body;
        const result = await adminCategoryService.reorderCategories(orders);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
export async function updateCategorySeo(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { meta_title, meta_description, keywords } = req.body;
        const category = await adminCategoryService.updateCategory(Number(id), { meta_title, meta_description, keywords });
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
}

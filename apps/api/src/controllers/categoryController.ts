
import { Request, Response, NextFunction } from 'express';

import * as categoryService from '../services/categoryService';

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
        const tree = await categoryService.getCategoryTree();
        res.json({
            success: true,
            data: tree,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;
        const { page, limit, sortBy, order } = req.query;

        const result = await categoryService.getCategoryBySlug(slug, {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            sortBy: sortBy as string,
            order: order as 'ASC' | 'DESC'
        });

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryFilters(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const filters = await categoryService.getAvailableFilters(Number(id));

        res.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryChildren(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const children = await categoryService.getCategoryChildren(Number(id));

        res.json({
            success: true,
            data: children,
        });
    } catch (error) {
        next(error);
    }
}

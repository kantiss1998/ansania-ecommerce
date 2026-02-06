
import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlistService';
import { AuthenticatedRequest } from '../types/express';
import { ListWishlistQuery, AddToWishlistDTO } from '@repo/shared/schemas';

export async function getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const query = req.query as unknown as ListWishlistQuery;
        const result = await wishlistService.getWishlist(userId, query);
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const body = req.body as AddToWishlistDTO;
        const item = await wishlistService.addToWishlist(userId, body);
        res.status(201).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        await wishlistService.removeFromWishlist(userId, Number(id));
        res.json({
            success: true,
            message: 'Item removed from wishlist',
        });
    } catch (error) {
        next(error);
    }
}


import { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profileService';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const user = await profileService.getProfile(userId);
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const user = await profileService.updateProfile(userId, req.body);
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        await profileService.changePassword(userId, req.body);
        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
}

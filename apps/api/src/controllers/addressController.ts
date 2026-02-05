
import { Request, Response, NextFunction } from 'express';
import * as addressService from '../services/addressService';

export async function createAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const address = await addressService.createAddress(userId, req.body);
        res.status(201).json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const addresses = await addressService.getAddresses(userId);
        res.json({
            success: true,
            data: addresses,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const address = await addressService.getAddress(userId, Number(id));
        res.json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const address = await addressService.updateAddress(userId, Number(id), req.body);
        res.json({
            success: true,
            data: address,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        await addressService.deleteAddress(userId, Number(id));
        res.json({
            success: true,
            message: 'Address deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

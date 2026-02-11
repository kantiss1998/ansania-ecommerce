
import { CreateAddressDTO } from '@repo/shared/schemas';
import { Request, Response, NextFunction } from 'express';

import * as addressService from '../services/addressService';
import { AuthenticatedRequest } from '../types/express';

export async function createAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

        const body = req.body as CreateAddressDTO;
        const address = await addressService.createAddress(userId, body);
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
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

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
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

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
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

        const { id } = req.params;
        const body = req.body as Partial<CreateAddressDTO>;
        const address = await addressService.updateAddress(userId, Number(id), body);
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
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

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

export async function setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        if (!userId) throw new Error('User not found');

        const { id } = req.params;
        const address = await addressService.setDefaultAddress(userId, Number(id));
        res.json({
            success: true,
            data: address,
            message: 'Default address updated successfully',
        });
    } catch (error) {
        next(error);
    }
}


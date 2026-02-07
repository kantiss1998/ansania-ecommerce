
import { Request, Response, NextFunction } from 'express';
import * as shippingService from '../services/shippingService';

export const getProvinces = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const provinces = await shippingService.getProvinces();
        res.json({
            success: true,
            data: provinces
        });
    } catch (error) {
        next(error);
    }
};

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const provinceId = req.query.province_id ? Number(req.query.province_id) : undefined;
        const cities = await shippingService.getCities(provinceId);
        res.json({
            success: true,
            data: cities
        });
    } catch (error) {
        next(error);
    }
};
export const getCouriers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const couriers = await shippingService.getCouriers();
        res.json({
            success: true,
            data: couriers
        });
    } catch (error) {
        next(error);
    }
};

export const calculateShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address_id, cart_id } = req.body;
        if (!address_id || !cart_id) {
            throw new AppError('address_id and cart_id are required', 400);
        }

        const rates = await shippingService.calculateShipping(Number(address_id), Number(cart_id));
        res.json({
            success: true,
            data: rates
        });
    } catch (error) {
        next(error);
    }
};

export const trackShipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { trackingNumber } = req.params;
        const tracking = await shippingService.trackShipment(trackingNumber);
        res.json({
            success: true,
            data: tracking
        });
    } catch (error) {
        next(error);
    }
};

import { AppError } from '@repo/shared/errors';

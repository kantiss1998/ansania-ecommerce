
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

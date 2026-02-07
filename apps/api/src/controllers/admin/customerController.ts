
import { Request, Response, NextFunction } from 'express';
import * as adminCustomerService from '../../services/admin/customerService';

export async function getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminCustomerService.listCustomers(req.query);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export async function getCustomerDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const customer = await adminCustomerService.getCustomerDetail(Number(id));
        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const customer = await adminCustomerService.updateCustomer(Number(id), req.body);
        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
}

export async function toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const customer = await adminCustomerService.toggleCustomerStatus(Number(id));
        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
}

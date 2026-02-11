
import { Request, Response, NextFunction } from 'express';

import * as adminVoucherService from '../../services/admin/voucherService';

export async function getAllVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminVoucherService.listVouchers(req.query);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function getVoucherDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucher = await adminVoucherService.getVoucherDetail(Number(id));
        res.json({
            success: true,
            data: voucher
        });
    } catch (error) {
        next(error);
    }
}

export async function createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const voucher = await adminVoucherService.createVoucher(req.body);
        res.status(201).json({
            success: true,
            data: voucher
        });
    } catch (error) {
        next(error);
    }
}

export async function updateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucher = await adminVoucherService.updateVoucher(Number(id), req.body);
        res.json({
            success: true,
            data: voucher
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await adminVoucherService.deleteVoucher(Number(id));
        res.json({
            success: true,
            message: 'Voucher deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

export async function toggleVoucherActive(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const voucher = await adminVoucherService.toggleVoucherActive(Number(id));
        res.json({ success: true, data: voucher });
    } catch (error) {
        next(error);
    }
}

export async function getVoucherStats(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const stats = await adminVoucherService.getVoucherStats(Number(id));
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
}

export async function getVoucherHistory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminVoucherService.getVoucherUsageHistory(Number(id), req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function bulkDeleteVouchers(req: Request, res: Response, next: NextFunction) {
    try {
        const { ids } = req.body;
        await adminVoucherService.bulkDeleteVouchers(ids);
        res.json({ success: true, message: 'Vouchers deleted successfully' });
    } catch (error) {
        next(error);
    }
}

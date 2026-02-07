
import { Request, Response, NextFunction } from 'express';
import * as voucherService from '../services/voucherService';
import * as cartService from '../services/cartService';
import { AuthenticatedRequest } from '../types/express';

export async function applyVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        const sessionId = req.headers['x-session-id'] as string;
        const { code } = req.body as { code: string };

        if (!code) {
            res.status(400).json({ success: false, error: 'Voucher code is required' });
            return;
        }

        // Get Cart ID first
        const cart = await cartService.getCart(userId, sessionId);
        if (!cart) {
            res.status(404).json({ success: false, error: 'Cart not found' });
            return;
        }

        const updatedCart = await voucherService.applyVoucher(cart.id, code);

        res.json({
            success: true,
            data: updatedCart,
        });
    } catch (error) {
        next(error);
    }
}

export async function removeVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as AuthenticatedRequest).user?.userId;
        const sessionId = req.headers['x-session-id'] as string;

        const cart = await cartService.getCart(userId, sessionId);
        if (!cart) {
            res.status(404).json({ success: false, error: 'Cart not found' });
            return;
        }

        const updatedCart = await voucherService.removeVoucher(cart.id);

        res.json({
            success: true,
            data: updatedCart,
        });
    } catch (error) {
        next(error);
    }
}
export async function getAvailableVouchers(_req: Request, res: Response, next: NextFunction) {
    try {
        const vouchers = await voucherService.getAvailableVouchers();
        res.json({
            success: true,
            data: vouchers,
        });
    } catch (error) {
        next(error);
    }
}

export async function getVoucherByCode(req: Request, res: Response, next: NextFunction) {
    try {
        const { code } = req.params;
        const voucher = await voucherService.getVoucherByCode(code);
        res.json({
            success: true,
            data: voucher,
        });
    } catch (error) {
        next(error);
    }
}

export async function validateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const { code, cart_total } = req.body;
        if (!code) {
            res.status(400).json({ success: false, error: 'Voucher code is required' });
            return;
        }

        const voucher = await voucherService.validateVoucher(code, Number(cart_total || 0));

        // Calculate potential discount
        const discountAmount = (voucher as any).calculateDiscount(Number(cart_total || 0));

        res.json({
            success: true,
            data: {
                voucher,
                discount_amount: discountAmount,
                total_after_discount: Math.max(0, Number(cart_total || 0) - discountAmount)
            },
        });
    } catch (error) {
        next(error);
    }
}

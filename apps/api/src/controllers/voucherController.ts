
import { Request, Response, NextFunction } from 'express';
import * as voucherService from '../services/voucherService';
import * as cartService from '../services/cartService';

export async function applyVoucher(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        const sessionId = req.headers['x-session-id'] as string;
        const { code } = req.body;

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
        const userId = (req as any).user?.userId;
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

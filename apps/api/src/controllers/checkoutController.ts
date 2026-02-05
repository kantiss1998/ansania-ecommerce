
import { Request, Response, NextFunction } from 'express';
import * as shippingService from '../services/shippingService';
import * as orderService from '../services/orderService';
import * as cartService from '../services/cartService'; // To get active cart

export async function getShippingRates(req: Request, res: Response, next: NextFunction) {
    try {
        const { shipping_address_id } = req.body;
        const userId = (req as any).user?.userId;
        const sessionId = req.headers['x-session-id'] as string; // Allow guest? Maybe not for shipping if address needed.

        // Address usually implies User?
        // If guest checkout allowed, address would be passed fully or ID if temp stored.
        // Let's assume User for now or Guest if they provide address ID (which implies they created it).

        if (!userId && !sessionId) {
            res.status(400).json({ success: false, error: 'Session required' });
            return;
        }

        const cart = await cartService.getCart(userId, sessionId);
        if (!cart || !cart.items || cart.items.length === 0) {
            res.status(400).json({ success: false, error: 'Cart is empty' });
            return;
        }

        const rates = await shippingService.calculateShipping(shipping_address_id, cart.id);

        res.json({
            success: true,
            data: rates,
        });
    } catch (error) {
        next(error);
    }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const order = await orderService.createOrder(userId, req.body);
        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
}

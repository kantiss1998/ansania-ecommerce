
import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';
import { AuthenticatedRequest } from '../types/express';
import { AddToCartDTO } from '@repo/shared/schemas';

function getSession(req: Request) {
    // If authenticated (via auth middleware), use user.
    // If not, check for 'x-session-id' header or similar for guests.
    const user = (req as AuthenticatedRequest).user;
    const userId = user ? user.userId : undefined;
    const sessionId = req.headers['x-session-id'] as string || undefined;

    return { userId, sessionId };
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, sessionId } = getSession(req);
        if (!userId && !sessionId) {
            // Generate session ID if neither exists? 
            // Better to Ask frontend to generate UUID for session.
            // Or return empty with a new session ID hint?
            // For now, assume client sends x-session-id or is logged in.
            res.status(400).json({ success: false, error: 'Session ID or Login required' });
            return;
        }

        const cart = await cartService.getCart(userId, sessionId);
        res.json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, sessionId } = getSession(req);
        if (!userId && !sessionId) {
            res.status(400).json({ success: false, error: 'Session ID required' });
            return;
        }

        const body = req.body as AddToCartDTO;
        const cart = await cartService.addToCart(userId, sessionId, body);
        res.status(201).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, sessionId } = getSession(req);
        const { id } = req.params;
        const { quantity } = req.body as { quantity: number };

        const cart = await cartService.updateItem(userId, sessionId, Number(id), quantity);
        res.json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
}

export async function removeItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, sessionId } = getSession(req);
        const { id } = req.params;

        const cart = await cartService.removeItem(userId, sessionId, Number(id));
        res.json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
}

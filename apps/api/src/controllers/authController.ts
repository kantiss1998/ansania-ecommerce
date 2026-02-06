
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterDTO, LoginDTO } from '@repo/shared/schemas';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body as RegisterDTO;
        const result = await authService.register(body);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body as LoginDTO;
        const result = await authService.login(body);
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body as { email: string };
        await authService.forgotPassword(email);
        res.json({ success: true, message: 'If email exists, reset token sent.' });
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, password } = req.body as { token: string; password: string };
        await authService.resetPassword(token, password);
        res.json({ success: true, message: 'Password reset successful.' });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body as { token: string };
        const result = await authService.refreshToken(token);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
    try {
        // Logout logic placeholder
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
}

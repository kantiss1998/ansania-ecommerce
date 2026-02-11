import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticatedRequest } from '../types/express';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            success: false,
            error: 'No token provided',
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded as { userId: number; email: string; role: string };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
        return;
    }
};

export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: 'Forbidden: Admin access required',
        });
        return;
    }
    next();
};

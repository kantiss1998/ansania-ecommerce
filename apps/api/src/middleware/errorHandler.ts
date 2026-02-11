
import { AppError } from '@repo/shared/errors';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            code: err.code,
        });
    }

    // Handle SyntaxError (e.g., invalid JSON)
    if (err instanceof SyntaxError && 'status' in err && err['status'] === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON format',
            code: 'INVALID_JSON',
        });
    }

    // Default error
    console.error('Unhandled error:', err);
    return res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
}

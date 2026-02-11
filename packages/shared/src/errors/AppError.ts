/**
 * Base Application Error Class
 * 
 * All custom errors should extend this class
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error (400)
 * Used when input validation fails
 */
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Unauthorized Error (401)
 * Used when authentication is required or fails
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

/**
 * Forbidden Error (403)
 * Used when user doesn't have permission
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Conflict Error (409)
 * Used when there's a conflict (e.g., duplicate entry)
 */
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}

/**
 * Bad Request Error (400)
 * Used for general bad requests
 */
export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST');
    }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
    }
}

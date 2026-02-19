"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.BadRequestError = exports.VoucherError = exports.InsufficientStockError = exports.ServiceUnavailableError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 500, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, "VALIDATION_ERROR");
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, "FORBIDDEN");
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, "CONFLICT");
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = "Rate limit exceeded") {
        super(message, 429, "RATE_LIMIT_EXCEEDED");
    }
}
exports.RateLimitError = RateLimitError;
class ServiceUnavailableError extends AppError {
    constructor(service) {
        super(`${service} is currently unavailable`, 503, "SERVICE_UNAVAILABLE");
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class InsufficientStockError extends AppError {
    constructor(productName) {
        super(`Insufficient stock for ${productName}`, 400, "INSUFFICIENT_STOCK");
    }
}
exports.InsufficientStockError = InsufficientStockError;
class VoucherError extends AppError {
    constructor(message, code) {
        super(message, 400, code);
    }
}
exports.VoucherError = VoucherError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400, "BAD_REQUEST");
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500, "INTERNAL_SERVER_ERROR");
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=index.js.map
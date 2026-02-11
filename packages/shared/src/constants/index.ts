// Export colors
export * from './colors';

// Export status constants
export * from './status';

// Export API constants
export * from './api';

// Stock Status Constants
export const STOCK_STATUS = {
    IN_STOCK: 'in_stock',
    LIMITED_STOCK: 'limited_stock',
    OUT_OF_STOCK: 'out_of_stock',
    PRE_ORDER: 'pre_order',
} as const;

// Courier Constants
export const COURIER = {
    JNT: 'jnt',
    JNE: 'jne',
    SICEPAT: 'sicepat',
    POS: 'pos',
    TIKI: 'tiki',
} as const;

// Pagination Constants
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

// Stock Thresholds
export const STOCK_THRESHOLD = {
    LIMITED: 10,
    MINIMUM: 1,
} as const;

// Cart Expiry (in days)
export const CART_EXPIRY = {
    GUEST: 1,
    USER: 7,
} as const;

// File Upload Constants
export const UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_IMAGES_PER_REVIEW: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// JWT Constants
export const JWT = {
    ACCESS_TOKEN_EXPIRES: '1h',
    REFRESH_TOKEN_EXPIRES: '7d',
} as const;

// Rate Limiting
export const RATE_LIMIT = {
    ANONYMOUS_REQUESTS: 100,
    AUTHENTICATED_REQUESTS: 1000,
    WINDOW_MINUTES: 15,
} as const;

// Odoo Sync Intervals (in minutes)
export const ODOO_SYNC_INTERVAL = {
    PRODUCTS: 30,
    STOCK: 30,
    CATEGORIES: 60,
} as const;

// Error Codes
export const ERROR_CODE = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    VOUCHER_INVALID: 'VOUCHER_INVALID',
    VOUCHER_EXPIRED: 'VOUCHER_EXPIRED',
    VOUCHER_USAGE_LIMIT: 'VOUCHER_USAGE_LIMIT',
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

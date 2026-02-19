export declare const API_RESPONSE_CODE: {
    readonly SUCCESS: "SUCCESS";
    readonly ERROR: "ERROR";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly CONFLICT: "CONFLICT";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 1;
};
export declare const CART_LIMITS: {
    readonly MAX_ITEMS: 50;
    readonly MAX_QUANTITY_PER_ITEM: 99;
    readonly MIN_QUANTITY: 1;
};
export declare const VOUCHER_LIMITS: {
    readonly MAX_CODE_LENGTH: 50;
    readonly MIN_CODE_LENGTH: 3;
    readonly MAX_DISCOUNT_PERCENTAGE: 100;
    readonly MIN_DISCOUNT_PERCENTAGE: 0;
};
export declare const PRODUCT_LIMITS: {
    readonly MAX_NAME_LENGTH: 255;
    readonly MAX_DESCRIPTION_LENGTH: 5000;
    readonly MAX_SKU_LENGTH: 100;
    readonly MAX_IMAGES: 10;
    readonly NEW_ARRIVAL_DAYS: 30;
    readonly RELATED_PRODUCTS: 4;
    readonly SIMILAR_PRODUCTS: 6;
};
export declare const USER_LIMITS: {
    readonly MAX_NAME_LENGTH: 100;
    readonly MAX_EMAIL_LENGTH: 255;
    readonly MIN_PASSWORD_LENGTH: 8;
    readonly MAX_PASSWORD_LENGTH: 128;
    readonly MAX_PHONE_LENGTH: 20;
};
export declare const ADDRESS_LIMITS: {
    readonly MAX_ADDRESSES_PER_USER: 10;
    readonly MAX_LABEL_LENGTH: 50;
    readonly MAX_ADDRESS_LENGTH: 500;
};
export declare const FILE_UPLOAD: {
    readonly MAX_IMAGE_SIZE: number;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly MAX_FILE_SIZE: number;
};
export declare const JWT_CONFIG: {
    readonly ACCESS_TOKEN_EXPIRY: "15m";
    readonly REFRESH_TOKEN_EXPIRY: "7d";
    readonly RESET_PASSWORD_TOKEN_EXPIRY: "1h";
    readonly EMAIL_VERIFICATION_TOKEN_EXPIRY: "24h";
};
export declare const RATE_LIMIT: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 100;
    readonly LOGIN_MAX_ATTEMPTS: 5;
    readonly LOGIN_WINDOW_MS: number;
};
export declare const CACHE_TTL: {
    readonly PRODUCTS: 300;
    readonly CATEGORIES: 600;
    readonly USER_SESSION: 900;
    readonly SHIPPING_RATES: 1800;
};
export declare const ODOO_CONFIG: {
    readonly CHUNK_SIZE: 100;
    readonly DEFAULT_WAREHOUSE_ID: 1;
};
export declare const SHIPPING_CONFIG: {
    readonly DEFAULT_WEIGHT_G: 500;
};
export declare const SEARCH_WEIGHTS: {
    readonly SKU: 10;
    readonly FULL_NAME: 8;
    readonly PARTIAL_NAME: 5;
    readonly DESCRIPTION: 2;
};
export declare const CART_CONFIG: {
    readonly GUEST_EXPIRY_DAYS: 7;
};
export declare const REVIEW_LIMITS: {
    readonly MAX_IMAGES: 5;
};
export declare const DASHBOARD_CONFIG: {
    readonly SALES_PERFORMANCE_DAYS: 30;
    readonly LOW_STOCK_THRESHOLD: 10;
    readonly RECENT_LIMIT: 5;
};
export declare const MARKETING_CONFIG: {
    readonly ABANDONED_CART_MIN_HOURS: 24;
    readonly ABANDONED_CART_MAX_HOURS: 48;
    readonly INACTIVE_USER_DAYS: 30;
};
export declare const REPORT_LIMITS: {
    readonly DEFAULT_TOP_ITEMS: 10;
};
//# sourceMappingURL=api.d.ts.map
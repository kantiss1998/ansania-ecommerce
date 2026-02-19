export * from "./colors";
export * from "./status";
export * from "./api";
export declare const STOCK_STATUS: {
    readonly IN_STOCK: "in_stock";
    readonly LIMITED_STOCK: "limited_stock";
    readonly OUT_OF_STOCK: "out_of_stock";
    readonly PRE_ORDER: "pre_order";
};
export declare const COURIER: {
    readonly JNT: "jnt";
    readonly JNE: "jne";
    readonly SICEPAT: "sicepat";
    readonly POS: "pos";
    readonly TIKI: "tiki";
};
export declare const STOCK_THRESHOLD: {
    readonly LIMITED: 10;
    readonly MINIMUM: 1;
};
export declare const CART_EXPIRY: {
    readonly GUEST: 1;
    readonly USER: 7;
};
export declare const UPLOAD: {
    readonly MAX_SIZE: number;
    readonly MAX_IMAGES_PER_REVIEW: 5;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
};
export declare const JWT: {
    readonly ACCESS_TOKEN_EXPIRES: "1h";
    readonly REFRESH_TOKEN_EXPIRES: "7d";
};
export declare const ODOO_SYNC_INTERVAL: {
    readonly PRODUCTS: 30;
    readonly STOCK: 30;
    readonly CATEGORIES: 60;
};
export declare const ERROR_CODE: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly VOUCHER_INVALID: "VOUCHER_INVALID";
    readonly VOUCHER_EXPIRED: "VOUCHER_EXPIRED";
    readonly VOUCHER_USAGE_LIMIT: "VOUCHER_USAGE_LIMIT";
    readonly INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
    readonly PAYMENT_FAILED: "PAYMENT_FAILED";
};
//# sourceMappingURL=index.d.ts.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODE = exports.ODOO_SYNC_INTERVAL = exports.JWT = exports.UPLOAD = exports.CART_EXPIRY = exports.STOCK_THRESHOLD = exports.COURIER = exports.STOCK_STATUS = void 0;
__exportStar(require("./colors"), exports);
__exportStar(require("./status"), exports);
__exportStar(require("./api"), exports);
exports.STOCK_STATUS = {
    IN_STOCK: "in_stock",
    LIMITED_STOCK: "limited_stock",
    OUT_OF_STOCK: "out_of_stock",
    PRE_ORDER: "pre_order",
};
exports.COURIER = {
    JNT: "jnt",
    JNE: "jne",
    SICEPAT: "sicepat",
    POS: "pos",
    TIKI: "tiki",
};
exports.STOCK_THRESHOLD = {
    LIMITED: 10,
    MINIMUM: 1,
};
exports.CART_EXPIRY = {
    GUEST: 1,
    USER: 7,
};
exports.UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024,
    MAX_IMAGES_PER_REVIEW: 5,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};
exports.JWT = {
    ACCESS_TOKEN_EXPIRES: "1h",
    REFRESH_TOKEN_EXPIRES: "7d",
};
exports.ODOO_SYNC_INTERVAL = {
    PRODUCTS: 30,
    STOCK: 30,
    CATEGORIES: 60,
};
exports.ERROR_CODE = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    VOUCHER_INVALID: "VOUCHER_INVALID",
    VOUCHER_EXPIRED: "VOUCHER_EXPIRED",
    VOUCHER_USAGE_LIMIT: "VOUCHER_USAGE_LIMIT",
    INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
    PAYMENT_FAILED: "PAYMENT_FAILED",
};
//# sourceMappingURL=index.js.map
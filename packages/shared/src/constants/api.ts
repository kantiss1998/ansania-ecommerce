/**
 * API Constants
 *
 * Centralized API configuration values
 * Following CODING_STANDARDS.md - No Magic Values
 */

/**
 * API Response Codes
 */
export const API_RESPONSE_CODE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

/**
 * Cart Limits
 */
export const CART_LIMITS = {
  MAX_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 99,
  MIN_QUANTITY: 1,
} as const;

/**
 * Voucher Limits
 */
export const VOUCHER_LIMITS = {
  MAX_CODE_LENGTH: 50,
  MIN_CODE_LENGTH: 3,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_DISCOUNT_PERCENTAGE: 0,
} as const;

/**
 * Product Limits
 */
export const PRODUCT_LIMITS = {
  MAX_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_SKU_LENGTH: 100,
  MAX_IMAGES: 10,
  NEW_ARRIVAL_DAYS: 30,
  RELATED_PRODUCTS: 4,
  SIMILAR_PRODUCTS: 6,
} as const;

/**
 * User Limits
 */
export const USER_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_PHONE_LENGTH: 20,
} as const;

/**
 * Address Limits
 */
export const ADDRESS_LIMITS = {
  MAX_ADDRESSES_PER_USER: 10,
  MAX_LABEL_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 500,
} as const;

/**
 * File Upload Limits
 */
export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
  RESET_PASSWORD_TOKEN_EXPIRY: "1h",
  EMAIL_VERIFICATION_TOKEN_EXPIRY: "24h",
} as const;

/**
 * Rate Limiting
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  LOGIN_MAX_ATTEMPTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  PRODUCTS: 300, // 5 minutes
  CATEGORIES: 600, // 10 minutes
  USER_SESSION: 900, // 15 minutes
  SHIPPING_RATES: 1800, // 30 minutes
} as const;

/**
 * Odoo Configuration
 */
export const ODOO_CONFIG = {
  CHUNK_SIZE: 100,
  DEFAULT_WAREHOUSE_ID: 1,
} as const;

/**
 * Shipping Configuration
 */
export const SHIPPING_CONFIG = {
  DEFAULT_WEIGHT_G: 500,
} as const;

/**
 * Search Ranking Weights
 */
export const SEARCH_WEIGHTS = {
  SKU: 10,
  FULL_NAME: 8,
  PARTIAL_NAME: 5,
  DESCRIPTION: 2,
} as const;

/**
 * Cart Configuration
 */
export const CART_CONFIG = {
  GUEST_EXPIRY_DAYS: 7,
} as const;

/**
 * Review Limits
 */
export const REVIEW_LIMITS = {
  MAX_IMAGES: 5,
} as const;

/**
 * Dashboard Configuration
 */
export const DASHBOARD_CONFIG = {
  SALES_PERFORMANCE_DAYS: 30,
  LOW_STOCK_THRESHOLD: 10,
  RECENT_LIMIT: 5,
} as const;

/**
 * Marketing Configuration
 */
export const MARKETING_CONFIG = {
  ABANDONED_CART_MIN_HOURS: 24,
  ABANDONED_CART_MAX_HOURS: 48,
  INACTIVE_USER_DAYS: 30,
} as const;

/**
 * Report Limits
 */
export const REPORT_LIMITS = {
  DEFAULT_TOP_ITEMS: 10,
} as const;

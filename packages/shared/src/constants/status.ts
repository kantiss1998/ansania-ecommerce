/**
 * Order Status Constants
 *
 * Defines all possible order statuses in the system
 * Following CODING_STANDARDS.md - No Magic Values
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/**
 * Payment Status Constants
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

/**
 * Shipping Status Constants
 */
export const SHIPPING_STATUS = {
  PENDING: "pending",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  FAILED: "failed",
  RETURNED: "returned",
} as const;

export type ShippingStatus =
  (typeof SHIPPING_STATUS)[keyof typeof SHIPPING_STATUS];

/**
 * Product Visibility Status
 */
export const PRODUCT_VISIBILITY = {
  VISIBLE: true,
  HIDDEN: false,
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Voucher Types
 */
export const VOUCHER_TYPE = {
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixed_amount",
  FREE_SHIPPING: "free_shipping",
} as const;

export type VoucherType = (typeof VOUCHER_TYPE)[keyof typeof VOUCHER_TYPE];

/**
 * Payment Methods
 */
export const PAYMENT_METHOD = {
  VIRTUAL_ACCOUNT: "virtual_account",
  CREDIT_CARD: "credit_card",
  EWALLET: "ewallet",
  QRIS: "qris",
  CONVENIENCE_STORE: "convenience_store",
  COD: "cod",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

/**
 * Shipping Providers
 */
export const SHIPPING_PROVIDER = {
  JNT: "jnt",
  JNE: "jne",
  SICEPAT: "sicepat",
  ANTERAJA: "anteraja",
} as const;

export type ShippingProvider =
  (typeof SHIPPING_PROVIDER)[keyof typeof SHIPPING_PROVIDER];

/**
 * Payment Providers
 */
export const PAYMENT_PROVIDER = {
  DOKU: "doku",
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

/**
 * Review Status
 */
export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

/**
 * Email Status
 */
export const EMAIL_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];

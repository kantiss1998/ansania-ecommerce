export declare const ORDER_STATUS: {
    readonly PENDING_PAYMENT: "pending_payment";
    readonly PAID: "paid";
    readonly PROCESSING: "processing";
    readonly SHIPPED: "shipped";
    readonly DELIVERED: "delivered";
    readonly CANCELLED: "cancelled";
    readonly REFUNDED: "refunded";
    readonly FAILED: "failed";
};
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export declare const PAYMENT_STATUS: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly SUCCESS: "success";
    readonly PAID: "paid";
    readonly FAILED: "failed";
    readonly EXPIRED: "expired";
    readonly CANCELLED: "cancelled";
    readonly REFUNDED: "refunded";
};
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export declare const SHIPPING_STATUS: {
    readonly PENDING: "pending";
    readonly PICKED_UP: "picked_up";
    readonly IN_TRANSIT: "in_transit";
    readonly OUT_FOR_DELIVERY: "out_for_delivery";
    readonly DELIVERED: "delivered";
    readonly FAILED: "failed";
    readonly RETURNED: "returned";
};
export type ShippingStatus = (typeof SHIPPING_STATUS)[keyof typeof SHIPPING_STATUS];
export declare const PRODUCT_VISIBILITY: {
    readonly VISIBLE: true;
    readonly HIDDEN: false;
};
export declare const USER_ROLES: {
    readonly CUSTOMER: "customer";
    readonly ADMIN: "admin";
    readonly SUPER_ADMIN: "super_admin";
};
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export declare const VOUCHER_TYPE: {
    readonly PERCENTAGE: "percentage";
    readonly FIXED_AMOUNT: "fixed_amount";
    readonly FREE_SHIPPING: "free_shipping";
};
export type VoucherType = (typeof VOUCHER_TYPE)[keyof typeof VOUCHER_TYPE];
export declare const PAYMENT_METHOD: {
    readonly VIRTUAL_ACCOUNT: "virtual_account";
    readonly CREDIT_CARD: "credit_card";
    readonly EWALLET: "ewallet";
    readonly QRIS: "qris";
    readonly CONVENIENCE_STORE: "convenience_store";
    readonly COD: "cod";
};
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export declare const SHIPPING_PROVIDER: {
    readonly JNT: "jnt";
    readonly JNE: "jne";
    readonly SICEPAT: "sicepat";
    readonly ANTERAJA: "anteraja";
};
export type ShippingProvider = (typeof SHIPPING_PROVIDER)[keyof typeof SHIPPING_PROVIDER];
export declare const PAYMENT_PROVIDER: {
    readonly DOKU: "doku";
};
export type PaymentProvider = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];
export declare const REVIEW_STATUS: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];
export declare const EMAIL_STATUS: {
    readonly PENDING: "pending";
    readonly SENT: "sent";
    readonly FAILED: "failed";
};
export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
//# sourceMappingURL=status.d.ts.map
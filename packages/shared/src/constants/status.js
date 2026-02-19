"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_STATUS = exports.REVIEW_STATUS = exports.PAYMENT_PROVIDER = exports.SHIPPING_PROVIDER = exports.PAYMENT_METHOD = exports.VOUCHER_TYPE = exports.USER_ROLES = exports.PRODUCT_VISIBILITY = exports.SHIPPING_STATUS = exports.PAYMENT_STATUS = exports.ORDER_STATUS = void 0;
exports.ORDER_STATUS = {
    PENDING_PAYMENT: "pending_payment",
    PAID: "paid",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    FAILED: "failed",
};
exports.PAYMENT_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    SUCCESS: "success",
    PAID: "paid",
    FAILED: "failed",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
};
exports.SHIPPING_STATUS = {
    PENDING: "pending",
    PICKED_UP: "picked_up",
    IN_TRANSIT: "in_transit",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    FAILED: "failed",
    RETURNED: "returned",
};
exports.PRODUCT_VISIBILITY = {
    VISIBLE: true,
    HIDDEN: false,
};
exports.USER_ROLES = {
    CUSTOMER: "customer",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
};
exports.VOUCHER_TYPE = {
    PERCENTAGE: "percentage",
    FIXED_AMOUNT: "fixed_amount",
    FREE_SHIPPING: "free_shipping",
};
exports.PAYMENT_METHOD = {
    VIRTUAL_ACCOUNT: "virtual_account",
    CREDIT_CARD: "credit_card",
    EWALLET: "ewallet",
    QRIS: "qris",
    CONVENIENCE_STORE: "convenience_store",
    COD: "cod",
};
exports.SHIPPING_PROVIDER = {
    JNT: "jnt",
    JNE: "jne",
    SICEPAT: "sicepat",
    ANTERAJA: "anteraja",
};
exports.PAYMENT_PROVIDER = {
    DOKU: "doku",
};
exports.REVIEW_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
exports.EMAIL_STATUS = {
    PENDING: "pending",
    SENT: "sent",
    FAILED: "failed",
};
//# sourceMappingURL=status.js.map
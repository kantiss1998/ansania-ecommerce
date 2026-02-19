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
exports.wishlistSchemas = exports.reviewSchemas = exports.checkoutSchemas = exports.cartSchemas = exports.productSchemas = exports.addressSchemas = exports.userSchemas = exports.authSchemas = void 0;
const zod_1 = require("zod");
__exportStar(require("./dtos"), exports);
exports.authSchemas = {
    register: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
        phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
        full_name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    }),
    login: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z.string().min(1, "Password is required"),
        remember_me: zod_1.z.boolean().optional(),
    }),
    forgotPassword: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format"),
    }),
    resetPassword: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
        new_password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    }),
};
exports.userSchemas = {
    updateProfile: zod_1.z.object({
        full_name: zod_1.z
            .string()
            .min(2, "Name must be at least 2 characters")
            .optional(),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .optional(),
    }),
    changePassword: zod_1.z.object({
        current_password: zod_1.z.string().min(1, "Current password is required"),
        new_password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    }),
};
exports.addressSchemas = {
    create: zod_1.z.object({
        label: zod_1.z.string().optional(),
        recipient_name: zod_1.z.string().min(2, "Recipient name is required"),
        phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits"),
        address_line1: zod_1.z.string().min(5, "Address is required"),
        address_line2: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2, "City is required"),
        district: zod_1.z.string().optional(),
        subdistrict: zod_1.z.string().optional(),
        province: zod_1.z.string().min(2, "Province is required"),
        postal_code: zod_1.z.string().min(5, "Postal code is required"),
        is_default: zod_1.z.boolean().optional(),
    }),
    update: zod_1.z.object({
        label: zod_1.z.string().optional(),
        recipient_name: zod_1.z.string().min(2, "Recipient name is required").optional(),
        phone: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .optional(),
        address_line1: zod_1.z.string().min(5, "Address is required").optional(),
        address_line2: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2, "City is required").optional(),
        district: zod_1.z.string().optional(),
        subdistrict: zod_1.z.string().optional(),
        province: zod_1.z.string().min(2, "Province is required").optional(),
        postal_code: zod_1.z.string().min(5, "Postal code is required").optional(),
        is_default: zod_1.z.boolean().optional(),
    }),
};
exports.productSchemas = {
    listProducts: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).optional(),
        limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
        sort: zod_1.z
            .enum([
            "newest",
            "price_asc",
            "price_desc",
            "popular",
            "rating",
            "name_asc",
            "name_desc",
        ])
            .optional(),
        category: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        finishing: zod_1.z.string().optional(),
        size: zod_1.z.string().optional(),
        price_min: zod_1.z.coerce.number().min(0).optional(),
        price_max: zod_1.z.coerce.number().min(0).optional(),
        rating_min: zod_1.z.coerce.number().int().min(1).max(5).optional(),
        search: zod_1.z.string().optional(),
        in_stock: zod_1.z.coerce.boolean().optional(),
        is_featured: zod_1.z
            .preprocess((val) => val === "true" || val === true, zod_1.z.boolean())
            .optional(),
        is_new: zod_1.z
            .preprocess((val) => val === "true" || val === true, zod_1.z.boolean())
            .optional(),
        has_discount: zod_1.z
            .preprocess((val) => val === "true" || val === true, zod_1.z.boolean())
            .optional(),
        excludeId: zod_1.z.coerce.number().optional(),
    }),
};
exports.cartSchemas = {
    addItem: zod_1.z.object({
        product_variant_id: zod_1.z
            .number()
            .int()
            .positive("Product variant ID is required"),
        quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    }),
    updateItem: zod_1.z.object({
        quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    }),
    applyVoucher: zod_1.z.object({
        code: zod_1.z.string().min(1, "Voucher code is required"),
    }),
};
exports.checkoutSchemas = {
    calculateShipping: zod_1.z.object({
        shipping_address_id: zod_1.z
            .number()
            .int()
            .positive("Shipping address is required"),
        courier: zod_1.z.string().min(1, "Courier is required"),
    }),
    createOrder: zod_1.z.object({
        shipping_address_id: zod_1.z
            .number()
            .int()
            .positive("Shipping address is required"),
        shipping_courier: zod_1.z.string().min(1, "Shipping courier is required"),
        shipping_service: zod_1.z.string().min(1, "Shipping service is required"),
        payment_method: zod_1.z.enum([
            "virtual_account",
            "credit_card",
            "ewallet",
            "qris",
            "convenience_store",
        ]),
        payment_channel: zod_1.z.string().optional(),
        customer_note: zod_1.z.string().max(500).optional(),
    }),
};
exports.reviewSchemas = {
    create: zod_1.z.object({
        order_id: zod_1.z.number().int().positive("Order ID is required"),
        product_id: zod_1.z.number().int().positive("Product ID is required"),
        rating: zod_1.z
            .number()
            .int()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating must be at most 5"),
        title: zod_1.z
            .string()
            .min(2, "Title is required")
            .max(255, "Title is too long")
            .optional(),
        comment: zod_1.z.string().max(2000, "Comment is too long").optional(),
        images: zod_1.z.array(zod_1.z.string()).max(5, "Maximum 5 images allowed").optional(),
    }),
};
exports.wishlistSchemas = {
    list: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).optional(),
        limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    }),
    add: zod_1.z.object({
        product_id: zod_1.z.number().int().positive(),
        product_variant_id: zod_1.z.number().int().positive().optional(),
    }),
};
//# sourceMappingURL=index.js.map
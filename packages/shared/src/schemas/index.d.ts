import { z } from "zod";
export * from "./dtos";
export declare const authSchemas: {
    register: z.ZodObject<{
        email: z.ZodString;
        phone: z.ZodString;
        full_name: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        phone: string;
        password: string;
        full_name: string;
    }, {
        email: string;
        phone: string;
        password: string;
        full_name: string;
    }>;
    login: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        remember_me: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        remember_me?: boolean | undefined;
    }, {
        email: string;
        password: string;
        remember_me?: boolean | undefined;
    }>;
    forgotPassword: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
    resetPassword: z.ZodObject<{
        token: z.ZodString;
        new_password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        token: string;
        new_password: string;
    }, {
        token: string;
        new_password: string;
    }>;
};
export declare const userSchemas: {
    updateProfile: z.ZodObject<{
        full_name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phone?: string | undefined;
        full_name?: string | undefined;
    }, {
        phone?: string | undefined;
        full_name?: string | undefined;
    }>;
    changePassword: z.ZodObject<{
        current_password: z.ZodString;
        new_password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        new_password: string;
        current_password: string;
    }, {
        new_password: string;
        current_password: string;
    }>;
};
export declare const addressSchemas: {
    create: z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        recipient_name: z.ZodString;
        phone: z.ZodString;
        address_line1: z.ZodString;
        address_line2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        district: z.ZodOptional<z.ZodString>;
        subdistrict: z.ZodOptional<z.ZodString>;
        province: z.ZodString;
        postal_code: z.ZodString;
        is_default: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        recipient_name: string;
        city: string;
        province: string;
        postal_code: string;
        address_line1: string;
        label?: string | undefined;
        address_line2?: string | undefined;
        district?: string | undefined;
        subdistrict?: string | undefined;
        is_default?: boolean | undefined;
    }, {
        phone: string;
        recipient_name: string;
        city: string;
        province: string;
        postal_code: string;
        address_line1: string;
        label?: string | undefined;
        address_line2?: string | undefined;
        district?: string | undefined;
        subdistrict?: string | undefined;
        is_default?: boolean | undefined;
    }>;
    update: z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        recipient_name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        address_line1: z.ZodOptional<z.ZodString>;
        address_line2: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        district: z.ZodOptional<z.ZodString>;
        subdistrict: z.ZodOptional<z.ZodString>;
        province: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        is_default: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        phone?: string | undefined;
        recipient_name?: string | undefined;
        city?: string | undefined;
        province?: string | undefined;
        postal_code?: string | undefined;
        label?: string | undefined;
        address_line1?: string | undefined;
        address_line2?: string | undefined;
        district?: string | undefined;
        subdistrict?: string | undefined;
        is_default?: boolean | undefined;
    }, {
        phone?: string | undefined;
        recipient_name?: string | undefined;
        city?: string | undefined;
        province?: string | undefined;
        postal_code?: string | undefined;
        label?: string | undefined;
        address_line1?: string | undefined;
        address_line2?: string | undefined;
        district?: string | undefined;
        subdistrict?: string | undefined;
        is_default?: boolean | undefined;
    }>;
};
export declare const productSchemas: {
    listProducts: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
        sort: z.ZodOptional<z.ZodEnum<["newest", "price_asc", "price_desc", "popular", "rating", "name_asc", "name_desc"]>>;
        category: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        finishing: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodString>;
        price_min: z.ZodOptional<z.ZodNumber>;
        price_max: z.ZodOptional<z.ZodNumber>;
        rating_min: z.ZodOptional<z.ZodNumber>;
        search: z.ZodOptional<z.ZodString>;
        in_stock: z.ZodOptional<z.ZodBoolean>;
        is_featured: z.ZodOptional<z.ZodEffects<z.ZodBoolean, boolean, unknown>>;
        is_new: z.ZodOptional<z.ZodEffects<z.ZodBoolean, boolean, unknown>>;
        has_discount: z.ZodOptional<z.ZodEffects<z.ZodBoolean, boolean, unknown>>;
        excludeId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        in_stock?: boolean | undefined;
        search?: string | undefined;
        sort?: "rating" | "newest" | "price_asc" | "price_desc" | "popular" | "name_asc" | "name_desc" | undefined;
        is_featured?: boolean | undefined;
        category?: string | undefined;
        color?: string | undefined;
        finishing?: string | undefined;
        size?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        price_min?: number | undefined;
        price_max?: number | undefined;
        rating_min?: number | undefined;
        is_new?: boolean | undefined;
        has_discount?: boolean | undefined;
        excludeId?: number | undefined;
    }, {
        in_stock?: boolean | undefined;
        search?: string | undefined;
        sort?: "rating" | "newest" | "price_asc" | "price_desc" | "popular" | "name_asc" | "name_desc" | undefined;
        is_featured?: unknown;
        category?: string | undefined;
        color?: string | undefined;
        finishing?: string | undefined;
        size?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        price_min?: number | undefined;
        price_max?: number | undefined;
        rating_min?: number | undefined;
        is_new?: unknown;
        has_discount?: unknown;
        excludeId?: number | undefined;
    }>;
};
export declare const cartSchemas: {
    addItem: z.ZodObject<{
        product_variant_id: z.ZodNumber;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        product_variant_id: number;
        quantity: number;
    }, {
        product_variant_id: number;
        quantity: number;
    }>;
    updateItem: z.ZodObject<{
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
    }, {
        quantity: number;
    }>;
    applyVoucher: z.ZodObject<{
        code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
    }, {
        code: string;
    }>;
};
export declare const checkoutSchemas: {
    calculateShipping: z.ZodObject<{
        shipping_address_id: z.ZodNumber;
        courier: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        courier: string;
        shipping_address_id: number;
    }, {
        courier: string;
        shipping_address_id: number;
    }>;
    createOrder: z.ZodObject<{
        shipping_address_id: z.ZodNumber;
        shipping_courier: z.ZodString;
        shipping_service: z.ZodString;
        payment_method: z.ZodEnum<["virtual_account", "credit_card", "ewallet", "qris", "convenience_store"]>;
        payment_channel: z.ZodOptional<z.ZodString>;
        customer_note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        payment_method: "virtual_account" | "credit_card" | "ewallet" | "qris" | "convenience_store";
        shipping_address_id: number;
        shipping_courier: string;
        shipping_service: string;
        customer_note?: string | undefined;
        payment_channel?: string | undefined;
    }, {
        payment_method: "virtual_account" | "credit_card" | "ewallet" | "qris" | "convenience_store";
        shipping_address_id: number;
        shipping_courier: string;
        shipping_service: string;
        customer_note?: string | undefined;
        payment_channel?: string | undefined;
    }>;
};
export declare const reviewSchemas: {
    create: z.ZodObject<{
        order_id: z.ZodNumber;
        product_id: z.ZodNumber;
        rating: z.ZodNumber;
        title: z.ZodOptional<z.ZodString>;
        comment: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        order_id: number;
        product_id: number;
        rating: number;
        images?: string[] | undefined;
        title?: string | undefined;
        comment?: string | undefined;
    }, {
        order_id: number;
        product_id: number;
        rating: number;
        images?: string[] | undefined;
        title?: string | undefined;
        comment?: string | undefined;
    }>;
};
export declare const wishlistSchemas: {
    list: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page?: number | undefined;
        limit?: number | undefined;
    }, {
        page?: number | undefined;
        limit?: number | undefined;
    }>;
    add: z.ZodObject<{
        product_id: z.ZodNumber;
        product_variant_id: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        product_id: number;
        product_variant_id?: number | undefined;
    }, {
        product_id: number;
        product_variant_id?: number | undefined;
    }>;
};
export type RegisterDTO = z.infer<typeof authSchemas.register>;
export type LoginDTO = z.infer<typeof authSchemas.login>;
export type UpdateProfileDTO = z.infer<typeof userSchemas.updateProfile>;
export type ChangePasswordDTO = z.infer<typeof userSchemas.changePassword>;
export type CreateAddressDTO = z.infer<typeof addressSchemas.create>;
export type ListProductsQuery = z.infer<typeof productSchemas.listProducts>;
export type AddToCartDTO = z.infer<typeof cartSchemas.addItem>;
export type CreateOrderDTO = z.infer<typeof checkoutSchemas.createOrder>;
export type CreateReviewDTO = z.infer<typeof reviewSchemas.create>;
export type AddToWishlistDTO = z.infer<typeof wishlistSchemas.add>;
export type ListWishlistQuery = z.infer<typeof wishlistSchemas.list>;
//# sourceMappingURL=index.d.ts.map
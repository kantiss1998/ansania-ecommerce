import { z } from 'zod';
export * from './dtos';


// Auth schemas
export const authSchemas = {
    register: z.object({
        email: z.string().email('Invalid email format'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits'),
        full_name: z.string().min(2, 'Name must be at least 2 characters'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),

    login: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
        remember_me: z.boolean().optional(),
    }),

    forgotPassword: z.object({
        email: z.string().email('Invalid email format'),
    }),

    resetPassword: z.object({
        token: z.string().min(1, 'Token is required'),
        new_password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
};

// User schemas
export const userSchemas = {
    updateProfile: z.object({
        full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    }),

    changePassword: z.object({
        current_password: z.string().min(1, 'Current password is required'),
        new_password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
};

// Address schemas
export const addressSchemas = {
    create: z.object({
        label: z.string().optional(),
        recipient_name: z.string().min(2, 'Recipient name is required'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits'),
        address_line1: z.string().min(5, 'Address is required'),
        address_line2: z.string().optional(),
        city: z.string().min(2, 'City is required'),
        district: z.string().optional(),
        subdistrict: z.string().optional(),
        province: z.string().min(2, 'Province is required'),
        postal_code: z.string().min(5, 'Postal code is required'),
        is_default: z.boolean().optional(),
    }),

    update: z.object({
        label: z.string().optional(),
        recipient_name: z.string().min(2, 'Recipient name is required').optional(),
        phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
        address_line1: z.string().min(5, 'Address is required').optional(),
        address_line2: z.string().optional(),
        city: z.string().min(2, 'City is required').optional(),
        district: z.string().optional(),
        subdistrict: z.string().optional(),
        province: z.string().min(2, 'Province is required').optional(),
        postal_code: z.string().min(5, 'Postal code is required').optional(),
        is_default: z.boolean().optional(),
    }),
};

// Product schemas
export const productSchemas = {
    listProducts: z.object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        sort: z.enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating', 'name_asc', 'name_desc']).optional(),
        category: z.string().optional(),
        color: z.string().optional(),
        finishing: z.string().optional(),
        size: z.string().optional(),
        price_min: z.coerce.number().min(0).optional(),
        price_max: z.coerce.number().min(0).optional(),
        rating_min: z.coerce.number().int().min(1).max(5).optional(),
        search: z.string().optional(),
        in_stock: z.coerce.boolean().optional(),
        is_featured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
        is_new: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
        has_discount: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
        excludeId: z.coerce.number().optional(),
    }),
};

// Cart schemas
export const cartSchemas = {
    addItem: z.object({
        product_variant_id: z.number().int().positive('Product variant ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    }),

    updateItem: z.object({
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    }),

    applyVoucher: z.object({
        code: z.string().min(1, 'Voucher code is required'),
    }),
};

// Checkout schemas
export const checkoutSchemas = {
    calculateShipping: z.object({
        shipping_address_id: z.number().int().positive('Shipping address is required'),
        courier: z.string().min(1, 'Courier is required'),
    }),

    createOrder: z.object({
        shipping_address_id: z.number().int().positive('Shipping address is required'),
        shipping_courier: z.string().min(1, 'Shipping courier is required'),
        shipping_service: z.string().min(1, 'Shipping service is required'),
        payment_method: z.enum([
            'virtual_account',
            'credit_card',
            'ewallet',
            'qris',
            'convenience_store',
        ]),
        payment_channel: z.string().optional(),
        customer_note: z.string().max(500).optional(),
    }),
};

// Review schemas
export const reviewSchemas = {
    create: z.object({
        order_id: z.number().int().positive('Order ID is required'),
        rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
        title: z.string().min(2, 'Title is required').max(255, 'Title is too long').optional(),
        comment: z.string().max(2000, 'Comment is too long').optional(),
        images: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
    }),
};

// Wishlist schemas
export const wishlistSchemas = {
    list: z.object({
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
    }),
    add: z.object({
        product_id: z.number().int().positive(),
        product_variant_id: z.number().int().positive().optional(),
    }),
};

// Infer TypeScript types from schemas
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

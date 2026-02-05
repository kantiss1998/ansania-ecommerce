// Common API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    meta?: {
        timestamp: string;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// User types
export interface User {
    id: number;
    email: string;
    phone?: string;
    full_name?: string;
    odoo_user_id: number;
    odoo_partner_id?: number;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

// Address types
export interface Address {
    id: number;
    user_id: number;
    label?: string;
    recipient_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    district?: string;
    subdistrict?: string;
    province: string;
    postal_code: string;
    is_default: boolean;
    latitude?: number;
    longitude?: number;
}

// Product types
export interface Product {
    id: number;
    slug: string;
    name: string;
    description?: string;
    short_description?: string;
    selling_price: number;
    compare_price?: number;
    images: string[];
    rating?: number;
    total_reviews?: number;
    is_featured: boolean;
    stock_status: 'in_stock' | 'limited_stock' | 'out_of_stock' | 'pre_order';
}

export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    color?: string;
    finishing?: string;
    size?: string;
    price: number;
    stock: number;
    is_visible: boolean;
}

// Cart types
export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    product_variant_id: number;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Cart {
    id: number;
    user_id?: number;
    session_id?: string;
    items: CartItem[];
    subtotal: number;
    discount_amount: number;
    voucher_id?: number;
    total: number;
}

// Order types
export type OrderStatus =
    | 'pending_payment'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    order_number: string;
    user_id: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    created_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
}

// Voucher types
export type VoucherType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface Voucher {
    code: string;
    name: string;
    description?: string;
    discount_type: VoucherType;
    discount_value: number;
    max_discount_amount?: number;
    min_purchase_amount: number;
    start_date: string;
    end_date: string;
}

// Config types
export interface OdooConfig {
    baseUrl: string;
    database: string;
    username: string;
    apiKey: string;
}

export interface DokuConfig {
    clientId: string;
    secretKey: string;
    merchantId: string;
    environment: 'sandbox' | 'production';
    apiUrl: string;
}

export interface JNTConfig {
    apiKey: string;
    customerCode: string;
    apiUrl: string;
    branchCode: string;
}

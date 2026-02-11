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
export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    name?: string;
    color?: string;
    size?: string;
    finishing?: string;
    price: number;
    stock: number;
    image_url?: string;
    is_visible?: boolean;
    odoo_variant_id?: number;
}

export interface Product {
    id: number;
    slug: string;
    name: string;
    description?: string;
    short_description?: string;
    category_id: number;
    category?: Category;
    selling_price: number;
    compare_price?: number;
    images: string[];
    main_image?: string;
    rating?: number;
    total_reviews?: number;
    is_featured: boolean;
    is_visible: boolean;
    stock_status: 'in_stock' | 'limited_stock' | 'out_of_stock' | 'pre_order';
    variants?: ProductVariant[];
    odoo_id?: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    is_active: boolean;
    parent_id?: number;
}

export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string;
    label: string;
    extra_data?: string; // e.g., hex color code
}

export interface Attribute {
    id: number;
    name: string;
    code: string; // e.g., 'color', 'size'
    type: 'select' | 'radio' | 'text';
    is_required: boolean;
    values?: AttributeValue[];
}

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    is_approved: boolean;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    user?: {
        full_name: string;
        email: string;
    };
    product?: {
        name: string;
        slug: string;
        image?: string;
    };
}

export interface StockItem {
    id: number;
    product_id: number;
    sku: string;
    name: string; // Product name + variant info
    color?: string;
    size?: string;
    stock: number;
    last_sync_at: string;
}

// ProductVariant moved to line 55

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
    | 'pending'
    | 'pending_payment'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
    | 'expired';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    sku?: string;
    quantity: number;
    price: number;
    subtotal: number;
    product?: {
        image?: string;
    };
}

export interface OrderAddress {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    shipping_cost: number;
    voucher_discount: number;
    voucher_code?: string;
    payment_method: string;
    payment_transaction_id?: string;
    shipping_method: string;
    shipping_courier?: string;
    shipping_tracking_number?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    shipping_address?: OrderAddress;
    billing_address?: OrderAddress;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
}

// Voucher types
export type VoucherType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface Voucher {
    id: number;
    code: string;
    name: string;
    description?: string;
    discount_type: VoucherType;
    discount_value: number;
    max_discount_amount?: number;
    min_purchase_amount: number;
    usage_limit?: number;
    usage_count: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface FlashSaleItem {
    id: number;
    flash_sale_id: number;
    product_id: number;
    product_name: string;
    product_image?: string;
    discount_price: number;
    stock_limit: number;
    sold_count: number;
}

export interface FlashSale {
    id: number;
    name: string;
    description?: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
    items?: FlashSaleItem[];
    odoo_id?: number;
    created_at: string;
    updated_at: string;
}

export interface Banner {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
    sequence: number;
    is_active: boolean;
    position: 'home_hero' | 'home_sidebar' | 'promo_page';
}

export interface CMSPage {
    id: number;
    slug: string;
    title: string;
    content?: string;
    is_published: boolean;
    metadata?: Record<string, unknown>;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface SyncStatus {
    products: { last_sync: string; status: 'idle' | 'running' | 'failed' };
    stock: { last_sync: string; status: 'idle' | 'running' | 'failed' };
    categories: { last_sync: string; status: 'idle' | 'running' | 'failed' };
    orders: { last_sync: string; status: 'idle' | 'running' | 'failed' };
}

export interface SyncLog {
    id: number;
    entity_type: string;
    entity_id?: string;
    action: string;
    status: 'success' | 'failed';
    message?: string;
    created_at: string;
}

export interface SalesReportData {
    period: string;
    total_revenue: number;
    total_orders: number;
    total_tax: number;
    total_shipping: number;
    performance: { date: string; amount: number; count: number }[];
}

export interface CustomerReportData {
    total_customers: number;
    new_customers: number;
    active_customers: number;
    growth_performance: { date: string; count: number }[];
}

export interface InventoryReportData {
    total_items: number;
    valuation: number;
    low_stock_items: number;
    out_of_stock_items: number;
}

export interface AnalyticsData {
    views: number;
    clicks: number;
    conversion_rate: number;
    chart_data: { label: string; value: number }[];
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
// Admin Dashboard types
export interface DashboardOverview {
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    avgOrderValue: number;
}

export interface SalesPerformance {
    date: string;
    sales: number;
    orders: number;
}

export interface InventoryStatus {
    lowStockCount: number;
    outOfStockCount: number;
}

export interface DashboardStats {
    overview: DashboardOverview;
    performance: SalesPerformance[];
    activity: {
        recentOrders: Order[];
        recentUsers: User[];
    };
    inventory: InventoryStatus;
}

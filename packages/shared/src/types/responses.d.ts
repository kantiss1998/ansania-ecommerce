type User = {
    id: number;
    email: string;
    phone?: string;
    full_name?: string;
};
type Product = {
    id: number;
    slug: string;
    name: string;
    selling_price: number;
};
type ProductVariant = {
    id: number;
    product_id: number;
    sku: string;
    price: number;
};
type Order = {
    order_number: string;
    user_id: number;
    status: string;
    payment_status: string;
    total_amount: number;
};
export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    order_id?: number;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
    is_verified_purchase: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
}
export interface Wishlist {
    id: number;
    user_id: number;
    product_id: number;
    product_variant_id?: number;
    created_at: string;
}
export interface FlashSale {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    products: FlashSaleProduct[];
}
export interface FlashSaleProduct {
    id: number;
    flash_sale_id: number;
    product_id: number;
    discount_percentage: number;
    flash_price: number;
    stock_allocated: number;
    stock_sold: number;
}
export interface Notification {
    id: number;
    user_id: number;
    type: "order" | "promotion" | "system";
    title: string;
    message: string;
    is_read: boolean;
    related_entity_type?: string;
    related_entity_id?: number;
    created_at: string;
}
export interface CmsBanner {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
    link_type: "product" | "category" | "external" | "none";
    display_order: number;
    is_active: boolean;
}
export interface CmsPage {
    id: number;
    slug: string;
    title: string;
    content: string;
    seo_title?: string;
    seo_description?: string;
}
export interface CmsSetting {
    key: string;
    value: string;
    description?: string;
}
export interface ShippingRate {
    service: string;
    price: number;
    description: string;
    etd?: string;
}
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    variant_name?: string;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
}
export interface OrderDetail extends Order {
    items: OrderItem[];
    shipping?: {
        recipient_name: string;
        phone: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
        courier: string;
        service: string;
        tracking_number?: string;
    };
}
export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token?: string;
}
export interface ProductDetail extends Product {
    variants: ProductVariant[];
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    reviews?: Review[];
    ratings_summary?: {
        total_reviews: number;
        average_rating: number;
        rating_5_count: number;
        rating_4_count: number;
        rating_3_count: number;
        rating_2_count: number;
        rating_1_count: number;
    };
}
export interface FilterColor {
    id: number;
    name: string;
    hex_code: string;
}
export interface FilterSize {
    id: number;
    name: string;
}
export interface FilterFinishing {
    id: number;
    name: string;
}
export interface ListOrdersQuery {
    page?: number;
    limit?: number;
    status?: string;
}
export interface ListNotificationsQuery {
    page?: number;
    limit?: number;
    is_read?: boolean;
}
export {};
//# sourceMappingURL=responses.d.ts.map
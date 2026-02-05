import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';
// Import DTOs from shared package if possible, or define locally
// import { AddToCartDTO } from '@repo/shared/schemas/dtos'; 

export interface CartItem {
    id: number;
    product_variant_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        thumbnail_url?: string;
        base_price: number;
    };
    variant?: {
        id: number;
        color: string;
        size: string;
        price: number;
        stock: number;
    };
}

export interface Cart {
    items: CartItem[];
    total_quantity: number;
    total_amount: number;
}

export const cartService = {
    async getCart(): Promise<Cart> {
        try {
            const response = await apiClient.get<ApiResponse<Cart>>('/cart');
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async addToCart(item: { product_variant_id: number; quantity: number }): Promise<Cart> {
        try {
            const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', item);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateItem(itemId: number, quantity: number): Promise<Cart> {
        try {
            const response = await apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
                quantity,
            });
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async removeItem(itemId: number): Promise<Cart> {
        try {
            const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};

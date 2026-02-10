import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';
import { Product } from '@/services/productService';

export interface WishlistItem {
    id: number;
    product_id: number;
    product: Product;
    created_at: string;
}

export const wishlistService = {
    async getWishlist(): Promise<WishlistItem[]> {
        try {
            const response = await apiClient.get<ApiResponse<{ items: WishlistItem[] }>>('/wishlist');
            return response.data.data?.items || [];
        } catch (error) {
            // Return empty array if 404 or auth error to avoid breaking UI
            console.error('Failed to fetch wishlist', error);
            return [];
        }
    },

    async addToWishlist(productId: number): Promise<WishlistItem> {
        try {
            const response = await apiClient.post<ApiResponse<WishlistItem>>('/wishlist', { product_id: productId });
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async removeFromWishlist(id: number): Promise<void> {
        try {
            await apiClient.delete(`/wishlist/${id}`);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Helper to check if product is in wishlist (requires fetching all list first usually, or dedicated endpoint)
    // For now, simple list fetch
};

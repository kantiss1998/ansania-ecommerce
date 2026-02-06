import apiClient, { ApiResponse } from '@/lib/api';
import { Product } from './productService';

export interface FlashSaleProduct {
    id: number;
    flash_sale_id: number;
    product_id: number;
    flash_sale_price: number;
    original_price: number;
    stock: number;
    sold: number;
    product: Product;
}

export interface FlashSale {
    id: number;
    name: string;
    description?: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    products: FlashSaleProduct[];
}

export const flashSaleService = {
    async getActiveFlashSales(): Promise<FlashSale[]> {
        try {
            const response = await apiClient.get<ApiResponse<FlashSale[]>>('/flash-sales/active');
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch active flash sales:', error);
            return [];
        }
    },

    async getFlashSale(id: number): Promise<FlashSale | null> {
        try {
            const response = await apiClient.get<ApiResponse<FlashSale>>(`/flash-sales/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Failed to fetch flash sale ${id}:`, error);
            return null;
        }
    }
};

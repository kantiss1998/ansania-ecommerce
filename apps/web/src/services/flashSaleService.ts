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
    start_date: string; // ISO string 2026-06-01T00:00:00Z
    end_date: string;
    is_active: boolean;
    products: FlashSaleProduct[];
}

export const flashSaleService = {
    async getAllFlashSales(
        params?: { page?: number; limit?: number; status?: 'active' | 'upcoming' | 'expired' | 'all' },
        token?: string
    ): Promise<{ items: FlashSale[]; meta: unknown }> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.status) query.append('status', params.status);

        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await apiClient.get<ApiResponse<{ items: FlashSale[]; meta: unknown }>>(`/admin/flash-sales?${query.toString()}`, config);
        return response.data.data!;
    },

    async getActiveFlashSales(): Promise<FlashSale[]> {
        try {
            const response = await apiClient.get<ApiResponse<FlashSale[]>>('/flash-sales/active');
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch active flash sales:', error);
            return [];
        }
    },

    async getFlashSale(id: number, token?: string): Promise<FlashSale | null> {
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            // Use admin endpoint if token is present, otherwise use public endpoint
            const endpoint = token ? `/admin/flash-sales/${id}` : `/flash-sales/${id}`;
            const response = await apiClient.get<ApiResponse<FlashSale>>(endpoint, config);
            return response.data.data || null;
        } catch (error) {
            console.error(`Failed to fetch flash sale ${id}:`, error);
            return null;
        }
    },

    async createFlashSale(data: Omit<FlashSale, 'id' | 'products'>): Promise<FlashSale> {
        const response = await apiClient.post<ApiResponse<FlashSale>>('/admin/flash-sales', data);
        return response.data.data!;
    },

    async updateFlashSale(id: number, data: Partial<Omit<FlashSale, 'id' | 'products'>>): Promise<FlashSale> {
        const response = await apiClient.patch<ApiResponse<FlashSale>>(`/admin/flash-sales/${id}`, data);
        return response.data.data!;
    },

    async deleteFlashSale(id: number): Promise<void> {
        await apiClient.delete(`/admin/flash-sales/${id}`);
    },

    async addProductToFlashSale(flashSaleId: number, data: { product_id: number; flash_sale_price: number; stock: number }): Promise<void> {
        await apiClient.post(`/admin/flash-sales/${flashSaleId}/products`, data);
    },

    async removeProductFromFlashSale(flashSaleId: number, productId: number): Promise<void> {
        await apiClient.delete(`/admin/flash-sales/${flashSaleId}/products/${productId}`);
    }
};

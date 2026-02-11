import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';
import { Product } from './productService';

export const adminProductService = {
    async createProduct(data: Partial<Product>): Promise<Product> {
        try {
            const response = await apiClient.post<ApiResponse<Product>>('/admin/products', data);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
        try {
            const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, data);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async deleteProduct(id: number): Promise<void> {
        try {
            await apiClient.delete(`/admin/products/${id}`);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async bulkDeleteProducts(ids: number[]): Promise<void> {
        try {
            await apiClient.post('/admin/products/bulk-delete', { ids });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async uploadProductImage(productId: number, file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await apiClient.post<ApiResponse<{ image_url: string }>>(
                `/admin/products/${productId}/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data!.image_url;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};

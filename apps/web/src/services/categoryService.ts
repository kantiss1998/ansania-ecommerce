import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';
import { Category } from '@repo/shared';

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch categories', error);
            return [];
        }
    },

    async getCategoryBySlug(slug: string): Promise<Category> {
        try {
            const response = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};

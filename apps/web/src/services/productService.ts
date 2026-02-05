import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    discount_price?: number;
    thumbnail_url?: string;
    stock_status: string;
    rating_average: number;
    total_reviews: number;
    is_featured: boolean;
    is_new: boolean;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    images?: string[];
    variants?: any[]; // Refine type as needed
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    stock_status?: string;
}

export interface ProductListResponse {
    items: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const productService = {
    async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
        try {
            const response = await apiClient.get<ApiResponse<ProductListResponse>>('/products', {
                params,
            });
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getProductBySlug(slug: string): Promise<Product> {
        try {
            const response = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};

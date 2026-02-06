import apiClient, { ApiResponse } from '@/lib/api';

export interface Province {
    province_id: string;
    province: string;
}

export interface City {
    city_id: string;
    province_id: string;
    province: string;
    type: string;
    city_name: string;
    postal_code: string;
}

export const shippingService = {
    async getProvinces(): Promise<Province[]> {
        try {
            const response = await apiClient.get<ApiResponse<Province[]>>('/shipping-info/provinces');
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch provinces', error);
            return [];
        }
    },

    async getCities(provinceId?: number): Promise<City[]> {
        try {
            const params = provinceId ? { province_id: provinceId } : {};
            const response = await apiClient.get<ApiResponse<City[]>>('/shipping-info/cities', { params });
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch cities', error);
            return [];
        }
    }
};

import apiClient, { ApiResponse } from '@/lib/api';

export interface Voucher {
    id: number;
    code: string;
    description?: string;
    discount_type: 'percent' | 'fixed';
    discount_amount: number;
    min_purchase?: number;
    max_discount?: number;
    start_date: string;
    end_date: string;
    usage_limit?: number;
    usage_count: number;
    is_active: boolean;
}

export const adminVoucherService = {
    async getAllVouchers(params?: { page?: number; limit?: number; status?: 'active' | 'upcoming' | 'expired' | 'all' }): Promise<{ items: Voucher[]; meta: any }> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.status) query.append('status', params.status);

        const response = await apiClient.get<ApiResponse<{ items: Voucher[]; meta: any }>>(`/admin/vouchers?${query.toString()}`);
        return response.data.data!;
    },

    async getVoucher(id: number): Promise<Voucher | null> {
        try {
            const response = await apiClient.get<ApiResponse<Voucher>>(`/admin/vouchers/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Failed to fetch voucher ${id}:`, error);
            return null;
        }
    },

    async createVoucher(data: Omit<Voucher, 'id' | 'usage_count'>): Promise<Voucher> {
        const response = await apiClient.post<ApiResponse<Voucher>>('/admin/vouchers', data);
        return response.data.data!;
    },

    async updateVoucher(id: number, data: Partial<Omit<Voucher, 'id' | 'usage_count'>>): Promise<Voucher> {
        const response = await apiClient.patch<ApiResponse<Voucher>>(`/admin/vouchers/${id}`, data);
        return response.data.data!;
    },

    async deleteVoucher(id: number): Promise<void> {
        await apiClient.delete(`/admin/vouchers/${id}`);
    }
};

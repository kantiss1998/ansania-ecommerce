import { Voucher, PaginatedResponse } from "@repo/shared";

import apiClient, { ApiResponse } from "@/lib/api";

export const adminVoucherService = {
  async getAllVouchers(
    params?: {
      page?: number;
      limit?: number;
      status?: "active" | "upcoming" | "expired" | "all";
    },
    token?: string,
  ): Promise<PaginatedResponse<Voucher>> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    interface PaginationMeta {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
    const response = await apiClient.get<
      ApiResponse<{ items: Voucher[]; meta: PaginationMeta }>
    >(`/admin/vouchers?${query.toString()}`, config);

    const { items, meta } = response.data.data!;

    return {
      items,
      pagination: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages,
      },
    };
  },

  async getVoucher(id: number, token?: string): Promise<Voucher | null> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<ApiResponse<Voucher>>(
        `/admin/vouchers/${id}`,
        config,
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch voucher ${id}:`, error);
      return null;
    }
  },

  async createVoucher(
    data: Omit<Voucher, "id" | "usage_count" | "created_at" | "updated_at">,
  ): Promise<Voucher> {
    const response = await apiClient.post<ApiResponse<Voucher>>(
      "/admin/vouchers",
      data,
    );
    return response.data.data!;
  },

  async updateVoucher(
    id: number,
    data: Partial<Omit<Voucher, "id" | "usage_count">>,
  ): Promise<Voucher> {
    const response = await apiClient.patch<ApiResponse<Voucher>>(
      `/admin/vouchers/${id}`,
      data,
    );
    return response.data.data!;
  },

  async deleteVoucher(id: number): Promise<void> {
    await apiClient.delete(`/admin/vouchers/${id}`);
  },
};

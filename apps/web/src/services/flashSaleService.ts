import { FlashSale, PaginatedResponse } from "@repo/shared";

import apiClient, { ApiResponse } from "@/lib/api";

export const flashSaleService = {
  async getAllFlashSales(
    params?: {
      page?: number;
      limit?: number;
      status?: "active" | "upcoming" | "expired" | "all";
    },
    token?: string,
  ): Promise<PaginatedResponse<FlashSale>> {
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
      ApiResponse<{ items: FlashSale[]; meta: PaginationMeta }>
    >(`/admin/flash-sales?${query.toString()}`, config);

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

  async getActiveFlashSales(): Promise<FlashSale[]> {
    try {
      const response = await apiClient.get<ApiResponse<FlashSale[]>>(
        "/flash-sales/active",
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch active flash sales:", error);
      return [];
    }
  },

  async getFlashSale(id: number, token?: string): Promise<FlashSale | null> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      // Use admin endpoint if token is present, otherwise use public endpoint
      const endpoint = token
        ? `/admin/flash-sales/${id}`
        : `/flash-sales/${id}`;
      const response = await apiClient.get<ApiResponse<FlashSale>>(
        endpoint,
        config,
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch flash sale ${id}:`, error);
      return null;
    }
  },

  async createFlashSale(
    data: Omit<FlashSale, "id" | "products" | "created_at" | "updated_at">,
  ): Promise<FlashSale> {
    const response = await apiClient.post<ApiResponse<FlashSale>>(
      "/admin/flash-sales",
      data,
    );
    return response.data.data!;
  },

  async updateFlashSale(
    id: number,
    data: Partial<Omit<FlashSale, "id" | "products">>,
  ): Promise<FlashSale> {
    const response = await apiClient.patch<ApiResponse<FlashSale>>(
      `/admin/flash-sales/${id}`,
      data,
    );
    return response.data.data!;
  },

  async deleteFlashSale(id: number): Promise<void> {
    await apiClient.delete(`/admin/flash-sales/${id}`);
  },

  async addProductToFlashSale(
    flashSaleId: number,
    data: { product_id: number; flash_sale_price: number; stock: number },
  ): Promise<void> {
    await apiClient.post(`/admin/flash-sales/${flashSaleId}/products`, data);
  },

  async removeProductFromFlashSale(
    flashSaleId: number,
    productId: number,
  ): Promise<void> {
    await apiClient.delete(
      `/admin/flash-sales/${flashSaleId}/products/${productId}`,
    );
  },
};

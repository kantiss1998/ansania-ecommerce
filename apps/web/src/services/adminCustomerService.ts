import apiClient, { ApiResponse } from "@/lib/api";

export interface CustomerStats {
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  total_reviews: number;
  avg_rating: number;
  last_order_date?: string;
  first_order_date?: string;
  is_blocked?: boolean;
}

export interface CustomerActivity {
  id: number;
  type: "order" | "review" | "login" | "registration";
  description: string;
  created_at: string;
  metadata?: Record<string, unknown> | null;
}

export const adminCustomerService = {
  async getCustomerStats(userId: number): Promise<CustomerStats> {
    const response = await apiClient.get<ApiResponse<CustomerStats>>(
      `/admin/customers/${userId}/stats`,
    );
    return response.data.data!;
  },

  async getCustomerActivity(userId: number): Promise<CustomerActivity[]> {
    const response = await apiClient.get<ApiResponse<CustomerActivity[]>>(
      `/admin/customers/${userId}/activity`,
    );
    return response.data.data || [];
  },

  async getCustomerReviews(userId: number): Promise<unknown[]> {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      `/admin/customers/${userId}/reviews`,
    );
    return response.data.data || [];
  },
};

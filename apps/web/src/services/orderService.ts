import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface OrderItem {
  id: number;
  product_name: string;
  variant_info: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  shipping_address_id: number;
  created_at: string;
  items?: OrderItem[];
  customer?: {
    name: string;
    email: string;
  };
  shipping_address?: {
    recipient_name: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
  };
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface OrderListResponse {
  items: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const orderService = {
  async getOrders(params?: OrderListParams): Promise<OrderListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<OrderListResponse>>(
        "/orders",
        { params },
      );
      // Handle if data is directly array or paginated object.
      // Based on typical API, it should be pagination object.
      // If backend returns simple array, we might need to adapt.
      // Checking backend controller... it typically uses `paginatedResult`.
      if (Array.isArray(response.data.data)) {
        return {
          items: response.data.data as unknown as Order[],
          meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        };
      }
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getOrder(orderNumber: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(
        `/orders/${orderNumber}`,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

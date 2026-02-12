import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface ShippingRate {
  service: string;
  description: string;
  cost: number;
  estimated_days: string;
}

export interface OrderItem {
  product_variant_id: number;
  quantity: number;
}

export interface CreateOrderData {
  shipping_address_id: number;
  payment_method: string;
  payment_provider: string; // 'doku', etc.
  items?: OrderItem[]; // Optional if backend uses cart directly
  notes?: string;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_url?: string; // If Doku returns a redirect URL
}

export const checkoutService = {
  async getShippingRates(shippingAddressId: number): Promise<ShippingRate[]> {
    try {
      const response = await apiClient.post<ApiResponse<ShippingRate[]>>(
        "/checkout/shipping",
        {
          shipping_address_id: shippingAddressId,
        },
      );
      return response.data.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    try {
      const response = await apiClient.post<ApiResponse<OrderResponse>>(
        "/checkout/order",
        data,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

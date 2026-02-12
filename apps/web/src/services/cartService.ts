import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface CartItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail_url?: string;
    base_price: number;
  };
  variant?: {
    id: number;
    color?: string;
    size?: string;
    finishing?: string;
    price: number;
    stock: number;
    sku: string;
  };
}

export interface Voucher {
  code: string;
  discount_type: "percentage" | "fixed" | "free_shipping";
  discount_value: number;
  discount_amount: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  voucher: Voucher | null;
  total: number;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<ApiResponse<Cart>>("/cart");
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async addToCart(item: {
    product_variant_id: number;
    quantity: number;
  }): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>(
        "/cart/items",
        item,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateItem(itemId: number, quantity: number): Promise<Cart> {
    try {
      const response = await apiClient.patch<ApiResponse<Cart>>(
        `/cart/items/${itemId}`,
        {
          quantity,
        },
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async removeItem(itemId: number): Promise<Cart> {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>(
        `/cart/items/${itemId}`,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async applyVoucher(code: string): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>(
        "/cart/voucher",
        { code },
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async removeVoucher(): Promise<Cart> {
    try {
      const response =
        await apiClient.delete<ApiResponse<Cart>>("/cart/voucher");
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

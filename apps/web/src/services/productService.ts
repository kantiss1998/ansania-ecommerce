import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface ProductVariant {
  id: number;
  color?: string;
  size?: string;
  finishing?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  helpful_count: number;
  user_avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  discount_price?: number;
  selling_price?: number;
  compare_price?: number;
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
  category_name?: string;
  images?: string[];
  variants?: ProductVariant[];
  reviews?: Review[];
  related_products?: Product[];
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
  isFeatured?: boolean;
  hasDiscount?: boolean;
  excludeId?: number;
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
      // Map camelCase params to snake_case for API
      const apiParams: Record<string, unknown> = { ...params };
      if (params?.minPrice !== undefined) {
        apiParams.price_min = params.minPrice;
        delete apiParams.minPrice;
      }
      if (params?.maxPrice !== undefined) {
        apiParams.price_max = params.maxPrice;
        delete apiParams.maxPrice;
      }
      if (params?.isFeatured !== undefined) {
        apiParams.is_featured = params.isFeatured;
        delete apiParams.isFeatured;
      }
      if (params?.hasDiscount !== undefined) {
        apiParams.has_discount = params.hasDiscount;
        delete apiParams.hasDiscount;
      }
      if (params?.excludeId !== undefined) {
        apiParams.excludeId = params.excludeId;
        delete apiParams.excludeId;
      }

      const response = await apiClient.get<ApiResponse<ProductListResponse>>(
        "/products",
        {
          params: apiParams,
        },
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${slug}`,
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getColors(): Promise<string[]> {
    try {
      const response =
        await apiClient.get<ApiResponse<({ name: string } | string)[]>>(
          "/attributes/colors",
        );
      return (response.data.data || []).map((item) =>
        typeof item === "object" && item !== null && "name" in item
          ? item.name
          : String(item),
      );
    } catch (error) {
      console.error("Failed to fetch colors:", error);
      return [];
    }
  },

  async getSizes(): Promise<string[]> {
    try {
      const response =
        await apiClient.get<ApiResponse<({ name: string } | string)[]>>(
          "/attributes/sizes",
        );
      return (response.data.data || []).map((item) =>
        typeof item === "object" && item !== null && "name" in item
          ? item.name
          : String(item),
      );
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
      return [];
    }
  },

  async getFinishings(): Promise<string[]> {
    try {
      const response = await apiClient.get<
        ApiResponse<({ name: string } | string)[]>
      >("/attributes/finishings");
      return (response.data.data || []).map((item) =>
        typeof item === "object" && item !== null && "name" in item
          ? item.name
          : String(item),
      );
    } catch (error) {
      console.error("Failed to fetch finishings:", error);
      return [];
    }
  },

  async recordSearch(
    query: string,
    filters?: Record<string, unknown>,
    results_count?: number,
  ): Promise<void> {
    try {
      await apiClient.post("/products/stats/search", {
        query,
        filters,
        results_count,
      });
    } catch (error) {
      console.error("Failed to record search:", error);
    }
  },

  async getRelatedProducts(
    productId: number,
    category: string,
  ): Promise<Product[]> {
    try {
      const searchParams: ProductListParams = {
        category,
        limit: 4,
        excludeId: productId,
      };
      const response = await this.getProducts(searchParams);
      return response.items;
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      return [];
    }
  },

  async recordProductView(productId: number): Promise<void> {
    try {
      await apiClient.post(`/stats/view/${productId}`);
    } catch (error) {
      console.error("Failed to record product view:", error);
    }
  },

  async getReviews(productId: number): Promise<Review[]> {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(
        `/reviews/${productId}`,
      );
      return response.data.data!;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return [];
    }
  },
};

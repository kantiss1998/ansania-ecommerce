import { Banner, CMSPage } from "@repo/shared";

import apiClient, { ApiResponse } from "@/lib/api";

// Remove local interfaces that are duplicates of @repo/shared
export interface BannerData {
  title: string;
  image_url: string;
  link_url?: string;
  position: "home_hero" | "home_sidebar" | "promo_page";
  sequence: number;
  is_active: boolean;
}

export const adminCmsService = {
  // --- PAGES ---
  async getAllPages(token?: string): Promise<CMSPage[]> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<ApiResponse<CMSPage[]>>(
        "/admin/cms/pages",
        config,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Fetch pages error:", error);
      return [];
    }
  },

  async getPage(id: number, token?: string): Promise<CMSPage | null> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<ApiResponse<CMSPage>>(
        `/admin/cms/pages/${id}`,
        config,
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Fetch page ${id} error:`, error);
      return null;
    }
  },

  async createPage(
    data: Omit<
      CMSPage,
      "id" | "updated_at" | "published_at" | "created_at" | "publishedAt"
    >,
  ): Promise<CMSPage> {
    const response = await apiClient.post<ApiResponse<CMSPage>>(
      "/admin/cms/pages",
      data,
    );
    return response.data.data!;
  },

  async updatePage(
    id: number,
    data: Partial<Omit<CMSPage, "id" | "updated_at" | "created_at">>,
  ): Promise<CMSPage> {
    const response = await apiClient.put<ApiResponse<CMSPage>>(
      `/admin/cms/pages/${id}`,
      data,
    );
    return response.data.data!;
  },

  async deletePage(id: number): Promise<void> {
    await apiClient.delete(`/admin/cms/pages/${id}`);
  },

  // --- BANNERS ---
  async getAllBanners(token?: string): Promise<Banner[]> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<ApiResponse<Banner[]>>(
        "/admin/cms/banners",
        config,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Fetch banners error:", error);
      return [];
    }
  },

  async getBanner(id: number, token?: string): Promise<Banner | null> {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await apiClient.get<ApiResponse<Banner>>(
        `/admin/cms/banners/${id}`,
        config,
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Fetch banner ${id} error:`, error);
      return null;
    }
  },

  async createBanner(data: BannerData): Promise<Banner> {
    const response = await apiClient.post<ApiResponse<Banner>>(
      "/admin/cms/banners",
      data,
    );
    return response.data.data!;
  },

  async updateBanner(id: number, data: Partial<BannerData>): Promise<Banner> {
    const response = await apiClient.put<ApiResponse<Banner>>(
      `/admin/cms/banners/${id}`,
      data,
    );
    return response.data.data!;
  },

  async deleteBanner(id: number): Promise<void> {
    await apiClient.delete(`/admin/cms/banners/${id}`);
  },
};

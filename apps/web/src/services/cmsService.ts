import apiClient, { ApiResponse, getErrorMessage } from "@/lib/api";

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  updated_at: string;
  publishedAt?: string; // Optional if not always present, but used by admin/components
}

export interface CmsSettings {
  [key: string]: string;
}

export interface CmsBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  display_order: number;
}

export const cmsService = {
  async getBanners(): Promise<CmsBanner[]> {
    try {
      const response =
        await apiClient.get<ApiResponse<CmsBanner[]>>("/cms/banners");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch banners", error);
      return [];
    }
  },

  async getPage(slug: string): Promise<CMSPage> {
    try {
      const response = await apiClient.get<
        ApiResponse<Record<string, unknown>>
      >(`/cms/pages/${slug}`);
      // Map backend response if necessary, assuming backend returns snake_case
      const data = response.data.data!;
      return {
        ...data,
        publishedAt:
          (data.published_at as string) || (data.updated_at as string), // Fallback to updated_at if published_at missing
      } as unknown as CMSPage;
    } catch (error) {
      throw new Error(getErrorMessage(error)); // Allow 404 to bubble up for Next.js notFound()
    }
  },

  async getSettings(): Promise<CmsSettings> {
    try {
      const response =
        await apiClient.get<ApiResponse<CmsSettings>>("/cms/settings");
      return response.data.data!;
    } catch (error) {
      console.error("Failed to fetch settings", error);
      return {};
    }
  },
};

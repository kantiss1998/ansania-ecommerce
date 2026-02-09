import apiClient, { ApiResponse } from '@/lib/api';
import { Banner, CMSPage } from '@repo/shared';

// Remove local interfaces that are duplicates of @repo/shared
export interface BannerData {
    title: string;
    image_url: string;
    link_url?: string;
    position: 'home_hero' | 'home_sidebar' | 'promo_page';
    sequence: number;
    is_active: boolean;
}

export const adminCmsService = {
    // --- PAGES ---
    async getAllPages(): Promise<CMSPage[]> {
        try {
            const response = await apiClient.get<ApiResponse<CMSPage[]>>('/admin/pages');
            return response.data.data || [];
        } catch (error) {
            console.error('Fetch pages error:', error);
            return [];
        }
    },

    async getPage(id: number): Promise<CMSPage | null> {
        try {
            const response = await apiClient.get<ApiResponse<CMSPage>>(`/admin/pages/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Fetch page ${id} error:`, error);
            return null;
        }
    },

    async createPage(data: Omit<CMSPage, 'id' | 'updated_at' | 'published_at' | 'created_at' | 'publishedAt'>): Promise<CMSPage> {
        const response = await apiClient.post<ApiResponse<CMSPage>>('/admin/pages', data);
        return response.data.data!;
    },

    async updatePage(id: number, data: Partial<Omit<CMSPage, 'id' | 'updated_at' | 'created_at'>>): Promise<CMSPage> {
        const response = await apiClient.put<ApiResponse<CMSPage>>(`/admin/pages/${id}`, data);
        return response.data.data!;
    },

    async deletePage(id: number): Promise<void> {
        await apiClient.delete(`/admin/pages/${id}`);
    },

    // --- BANNERS ---
    async getAllBanners(): Promise<Banner[]> {
        try {
            const response = await apiClient.get<ApiResponse<Banner[]>>('/admin/banners');
            return response.data.data || [];
        } catch (error) {
            console.error('Fetch banners error:', error);
            return [];
        }
    },

    async getBanner(id: number): Promise<Banner | null> {
        try {
            const response = await apiClient.get<ApiResponse<Banner>>(`/admin/banners/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Fetch banner ${id} error:`, error);
            return null;
        }
    },

    async createBanner(data: BannerData): Promise<Banner> {
        const response = await apiClient.post<ApiResponse<Banner>>('/admin/banners', data);
        return response.data.data!;
    },

    async updateBanner(id: number, data: Partial<BannerData>): Promise<Banner> {
        const response = await apiClient.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data);
        return response.data.data!;
    },

    async deleteBanner(id: number): Promise<void> {
        await apiClient.delete(`/admin/banners/${id}`);
    }
};

export default adminCmsService;

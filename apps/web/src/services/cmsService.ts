import apiClient, { ApiResponse, getErrorMessage } from '@/lib/api';

// Reusing types from existing lib/cms.ts or defining them here
export interface CMSBanner {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    linkText: string;
}

export interface CMSPage {
    id: number;
    slug: string;
    title: string;
    content: string;
    publishedAt: string;
}

export interface SiteSettings {
    siteName: string;
    logos: {
        header: string;
        footer: string;
    };
    socialLinks: {
        instagram: string;
        facebook: string;
        whatsapp: string;
    };
}

export const cmsService = {
    async getBanners(): Promise<CMSBanner[]> {
        try {
            const response = await apiClient.get<ApiResponse<CMSBanner[]>>('/cms/banners');
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            return []; // Fallback to empty array to allow UI to render
        }
    },

    async getPage(slug: string): Promise<CMSPage | null> {
        try {
            const response = await apiClient.get<ApiResponse<CMSPage>>(`/cms/pages/${slug}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Failed to fetch page ${slug}:`, error);
            return null;
        }
    },

    async getSettings(): Promise<SiteSettings> {
        try {
            const response = await apiClient.get<ApiResponse<SiteSettings>>('/cms/settings');
            return response.data.data!;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};

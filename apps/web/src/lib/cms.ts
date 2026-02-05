import { cmsService } from '@/services/cmsService';

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
    content: string; // Markdown or HTML
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

export const cmsClient = {
    getBanners: async (): Promise<CMSBanner[]> => {
        return cmsService.getBanners();
    },

    getPage: async (slug: string): Promise<CMSPage | null> => {
        return cmsService.getPage(slug);
    },

    getSettings: async (): Promise<SiteSettings> => {
        return cmsService.getSettings();
    },
};

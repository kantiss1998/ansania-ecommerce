import { cmsService, CMSPage, CmsBanner } from '@/services/cmsService';

export type { CMSPage };
export type CMSBanner = CmsBanner;

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
        try {
            return await cmsService.getPage(slug);
        } catch (error) {
            console.error(`Failed to fetch CMS page: ${slug}`, error);
            return null;
        }
    },

    getSettings: async (): Promise<SiteSettings> => {
        const settings = await cmsService.getSettings();
        // Map generic settings to typed SiteSettings
        // Using defaults or casting if structure matches
        return {
            siteName: settings['site_name'] || 'Ansania',
            logos: {
                header: settings['logo_header'] || '/logo.svg',
                footer: settings['logo_footer'] || '/logo-white.svg',
            },
            socialLinks: {
                instagram: settings['social_instagram'] || '#',
                facebook: settings['social_facebook'] || '#',
                whatsapp: settings['social_whatsapp'] || '#',
            },
        };
    },
};

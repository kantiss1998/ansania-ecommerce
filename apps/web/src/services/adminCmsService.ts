import apiClient from '@/lib/api';
import { CMSPage } from './cmsService';

export interface UpdatePageRequest {
    title: string;
    content: string;
    meta_title: string;
    meta_description: string;
}

const adminCmsService = {
    async getAllPages(): Promise<CMSPage[]> {
        const response = await apiClient.get<{ data: any[] }>('/cms/pages');
        return response.data.data.map(mapToCMSPage);
    },

    async getPage(slug: string): Promise<CMSPage | null> {
        // Reuse existing endpoint but typically admin might want ID-based or specific admin endpoint
        // For now, slug works if we don't change slugs. Or we can filter from getAllPages if needed by ID.
        // Actually, the edit page usually takes an ID. 
        // Let's implement getPageById if possible or just use getAllPages and find, 
        // OR simpler: just fetch by slug if we only have slug link.
        // But the plan said `PUT /pages/:id`. We need to know the ID.
        // The list view will have IDs.
        // The edit page will be /admin/pages/[id].

        // We probably need getPageById in backend or just use the existing getPage logic if we can.
        // Wait, existing getPage takes SLUG.
        // Let's rely on passing data or finding it. 
        // actually, let's just add getPageById to backend to be clean?
        // OR, just fetch all and find (easier for now if list is small). All pages = 6 pages. Safe.
        const pages = await this.getAllPages();
        // This is a workaround to get by ID without new backend endpoint for GET /:id
        // But wait, I added GET /pages/:slug.
        return pages.find(p => p.slug === slug) || null;
    },

    async getPageById(id: number): Promise<CMSPage | null> {
        const response = await apiClient.get<{ data: any[] }>('/cms/pages');
        const page = response.data.data.find((p: any) => p.id === id);
        if (!page) return null;
        return mapToCMSPage(page);
    },

    async updatePage(id: number, data: UpdatePageRequest): Promise<CMSPage> {
        const response = await apiClient.put<{ data: any }>(`/cms/pages/${id}`, data);
        return mapToCMSPage(response.data.data);
    }
};

function mapToCMSPage(data: any): CMSPage {
    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        content: data.content,
        // Backend returns snake_case usually, need to check if mapToCMSPage handles it
        // existing cmsService does: publishedAt: data.published_at.
        updated_at: data.updated_at || new Date().toISOString(), // Fallback if missing
        publishedAt: data.published_at,
        meta_title: data.meta_title,
        meta_description: data.meta_description
    };
}

export default adminCmsService;


import { CmsBanner, CmsPage, CmsSetting } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';

export async function getBanners() {
    return CmsBanner.findAll({
        where: { is_active: true },
        order: [['display_order', 'ASC']] // Fixed: sort_order -> display_order
    });
}

export async function getPage(slug: string) {
    const page = await CmsPage.findOne({
        where: { slug, is_published: true } // Fixed: is_active -> is_published
    });

    if (!page) throw new NotFoundError('Page');
    return page;
}

export async function getSettings() {
    const settings = await CmsSetting.findAll();
    // Convert array to object key-value
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
        // Type assertion to access properties
        const setting = s as any;
        settingsMap[setting.key] = setting.value;
    });
    return settingsMap;
}

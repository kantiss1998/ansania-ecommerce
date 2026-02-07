
import { CmsBanner, CmsPage, CmsSetting } from '@repo/database';
import { Op } from 'sequelize';
import { NotFoundError } from '@repo/shared/errors';

// Banners
export async function listBanners(query: any) {
    const { page = 1, limit = 10, search, active } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) where.title = { [Op.like]: `%${search}%` };
    if (active !== undefined) where.is_active = active === 'true';

    const { count, rows } = await CmsBanner.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['display_order', 'ASC'], ['created_at', 'DESC']]
    });

    return { data: rows, meta: { total: count, page, limit } };
}

export async function createBanner(data: any) {
    return CmsBanner.create(data);
}

export async function updateBanner(id: number, data: any) {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    await banner.update(data);
    return banner;
}

export async function deleteBanner(id: number) {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    await banner.destroy();
    return { success: true };
}

// Pages
export async function listPages(query: any) {
    const { page = 1, limit = 10, search, published } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { slug: { [Op.like]: `%${search}%` } }
        ];
    }
    if (published !== undefined) where.is_published = published === 'true';

    const { count, rows } = await CmsPage.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
    });

    return { data: rows, meta: { total: count, page, limit } };
}

export async function createPage(data: any) {
    return CmsPage.create(data);
}

export async function updatePage(id: number, data: any) {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    await page.update(data);
    return page;
}

export async function deletePage(id: number) {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    await page.destroy();
    return { success: true };
}

// Settings
export async function listSettings(group?: string) {
    const where = group ? { setting_group: group } : {};
    return CmsSetting.findAll({ where, order: [['setting_group', 'ASC'], ['setting_key', 'ASC']] });
}

export async function updateSetting(key: string, value: any, adminId?: number) {
    const setting = await CmsSetting.findOne({ where: { setting_key: key } });
    if (!setting) throw new NotFoundError('Setting');

    await setting.update({
        setting_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        updated_by: adminId,
        updated_at: new Date()
    });
    return setting;
}

export async function bulkUpdateSettings(settings: Record<string, any>, adminId?: number) {
    for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value, adminId);
    }
    return { success: true };
}

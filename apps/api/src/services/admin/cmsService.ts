
import { CmsBanner, CmsPage, CmsSetting } from '@repo/database';
import { NotFoundError } from '@repo/shared/errors';
import { Op } from 'sequelize';

// Banners
export async function listBanners(query: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    active?: string;
}): Promise<{ items: CmsBanner[]; meta: { total: number; page: number; limit: number } }> {
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

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function getBanner(id: number): Promise<CmsBanner> {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    return banner;
}

export async function createBanner(data: Partial<CmsBanner>): Promise<CmsBanner> {
    return CmsBanner.create(data as any);
}

export async function updateBanner(id: number, data: Partial<CmsBanner>): Promise<CmsBanner> {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    await banner.update(data);
    return banner;
}

export async function deleteBanner(id: number): Promise<{ success: boolean }> {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    await banner.destroy();
    return { success: true };
}

export async function toggleBannerActive(id: number): Promise<CmsBanner> {
    const banner = await CmsBanner.findByPk(id);
    if (!banner) throw new NotFoundError('Banner');
    await banner.update({ is_active: !banner.is_active });
    return banner;
}

export async function reorderBanners(orders: { id: number, order: number }[]): Promise<{ success: boolean }> {
    for (const item of orders) {
        await CmsBanner.update({ display_order: item.order }, { where: { id: item.id } });
    }
    return { success: true };
}

// Pages
export async function listPages(query: {
    page?: number | string;
    limit?: number | string;
    search?: string;
    published?: string;
}): Promise<{ items: CmsPage[]; meta: { total: number; page: number; limit: number } }> {
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

    return {
        items: rows,
        meta: {
            total: count,
            page: Number(page),
            limit: Number(limit)
        }
    };
}

export async function createPage(data: Partial<CmsPage>): Promise<CmsPage> {
    return CmsPage.create(data as any);
}

export async function updatePage(id: number, data: Partial<CmsPage>): Promise<CmsPage> {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    await page.update(data);
    return page;
}

export async function getPageDetail(id: number): Promise<CmsPage> {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    return page;
}

export async function deletePage(id: number): Promise<{ success: boolean }> {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    await page.destroy();
    return { success: true };
}

export async function togglePagePublish(id: number, publish: boolean): Promise<CmsPage> {
    const page = await CmsPage.findByPk(id);
    if (!page) throw new NotFoundError('Page');
    await page.update({ is_published: publish });
    return page;
}

// Settings
export async function listSettings(group?: string): Promise<CmsSetting[]> {
    const where = group ? { setting_group: group } : {};
    return CmsSetting.findAll({ where, order: [['setting_group', 'ASC'], ['setting_key', 'ASC']] });
}

export async function updateSetting(key: string, value: any, adminId?: number): Promise<CmsSetting> {
    const setting = await CmsSetting.findOne({ where: { setting_key: key } });
    if (!setting) throw new NotFoundError('Setting');

    await setting.update({
        setting_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        updated_by: adminId,
        updated_at: new Date()
    });
    return setting;
}

export async function bulkUpdateSettings(settings: Record<string, any>, adminId?: number): Promise<{ success: boolean }> {
    for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value, adminId);
    }
    return { success: true };
}

export async function getSettingByKey(key: string): Promise<CmsSetting> {
    const setting = await CmsSetting.findOne({ where: { setting_key: key } });
    if (!setting) throw new NotFoundError('Setting');
    return setting;
}

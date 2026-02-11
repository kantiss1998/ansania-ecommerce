
import { Request, Response, NextFunction } from 'express';

import * as adminCmsService from '../../services/admin/cmsService';
import { AuthenticatedRequest } from '../../types/express';

// Banners
export async function getAllBanners(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminCmsService.listBanners(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getBannerDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const banner = await adminCmsService.getBanner(Number(id));
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
}

export async function createBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const banner = await adminCmsService.createBanner(req.body);
        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const banner = await adminCmsService.updateBanner(Number(id), req.body);
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await adminCmsService.deleteBanner(Number(id));
        res.json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export async function toggleBannerActive(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const banner = await adminCmsService.toggleBannerActive(Number(id));
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
}

export async function reorderBanners(req: Request, res: Response, next: NextFunction) {
    try {
        const { orders } = req.body;
        const result = await adminCmsService.reorderBanners(orders);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Pages
export async function getAllPages(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await adminCmsService.listPages(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getPageDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const page = await adminCmsService.getPageDetail(Number(id));
        res.json({ success: true, data: page });
    } catch (error) {
        next(error);
    }
}

export async function createPage(req: Request, res: Response, next: NextFunction) {
    try {
        const page = await adminCmsService.createPage(req.body);
        res.status(201).json({ success: true, data: page });
    } catch (error) {
        next(error);
    }
}

export async function updatePage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const page = await adminCmsService.updatePage(Number(id), req.body);
        res.json({ success: true, data: page });
    } catch (error) {
        next(error);
    }
}

export async function deletePage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await adminCmsService.deletePage(Number(id));
        res.json({ success: true, message: 'Page deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export async function togglePagePublish(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { publish } = req.body;
        const page = await adminCmsService.togglePagePublish(Number(id), publish);
        res.json({ success: true, data: page });
    } catch (error) {
        next(error);
    }
}

// Settings
export async function getAllSettings(req: Request, res: Response, next: NextFunction) {
    try {
        const { group } = req.query;
        const settings = await adminCmsService.listSettings(group as string);
        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
}

export async function getSettingByKey(req: Request, res: Response, next: NextFunction) {
    try {
        const { key } = req.params;
        const setting = await adminCmsService.getSettingByKey(key);
        res.json({ success: true, data: setting });
    } catch (error) {
        next(error);
    }
}

export async function updateSetting(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const setting = await adminCmsService.updateSetting(key, value, req.user?.userId);
        res.json({ success: true, data: setting });
    } catch (error) {
        next(error);
    }
}

export async function bulkUpdateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { settings } = req.body;
        const result = await adminCmsService.bulkUpdateSettings(settings, req.user?.userId);
        res.json({ ...result });
    } catch (error) {
        next(error);
    }
}

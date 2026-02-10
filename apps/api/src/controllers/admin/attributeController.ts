
import { Request, Response, NextFunction } from 'express';
import * as adminAttributeService from '../../services/admin/attributeService';

export async function getAllAttributes(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.listAllAttributes();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

// Colors
export async function getColors(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.listColors();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function createColor(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.createColor(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateColor(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = await adminAttributeService.updateColor(Number(id), req.body);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function deleteColor(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminAttributeService.deleteColor(Number(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Sizes
export async function getSizes(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.listSizes();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function createSize(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.createSize(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateSize(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = await adminAttributeService.updateSize(Number(id), req.body);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function deleteSize(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminAttributeService.deleteSize(Number(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Finishing
export async function getFinishing(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.listFinishing();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function createFinishing(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await adminAttributeService.createFinishing(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateFinishing(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const data = await adminAttributeService.updateFinishing(Number(id), req.body);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function deleteFinishing(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await adminAttributeService.deleteFinishing(Number(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
}

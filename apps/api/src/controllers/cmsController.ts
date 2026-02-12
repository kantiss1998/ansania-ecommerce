import { Request, Response, NextFunction } from "express";

import * as cmsService from "../services/cmsService";

export async function getBanners(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const banners = await cmsService.getBanners();
    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPage(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const page = await cmsService.getPage(slug);
    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPages(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pages = await cmsService.getAllPages();
    res.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const page = await cmsService.updatePage(Number(id), req.body);
    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSettings(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const settings = await cmsService.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSettingByKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { key } = req.params;
    const setting = await cmsService.getSettingByKey(key);
    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
}

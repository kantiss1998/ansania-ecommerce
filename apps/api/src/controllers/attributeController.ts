import { Request, Response, NextFunction } from "express";

import * as attributeService from "../services/attributeService";

export async function getAllAttributes(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await attributeService.getAllAttributes();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getColors(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await attributeService.getColors();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getSizes(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await attributeService.getSizes();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getFinishings(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await attributeService.getFinishings();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

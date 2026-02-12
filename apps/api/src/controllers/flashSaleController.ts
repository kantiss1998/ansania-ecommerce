import { Request, Response, NextFunction } from "express";

import * as flashSaleService from "../services/flashSaleService";

export async function getActiveFlashSales(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await flashSaleService.getActiveFlashSales();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFlashSale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const data = await flashSaleService.getFlashSale(Number(id));
    if (!data) {
      res.status(404).json({ success: false, message: "Flash sale not found" });
      return;
    }
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
export async function getFlashSaleProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const data = await flashSaleService.getFlashSaleProducts(Number(id));
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

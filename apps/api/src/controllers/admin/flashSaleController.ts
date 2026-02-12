import { Request, Response, NextFunction } from "express";

import * as adminFlashSaleService from "../../services/admin/flashSaleService";

export async function getAllFlashSales(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await adminFlashSaleService.listFlashSales(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFlashSaleDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const flashSale = await adminFlashSaleService.getFlashSaleDetail(
      Number(id),
    );
    res.json({
      success: true,
      data: flashSale,
    });
  } catch (error) {
    next(error);
  }
}

export async function createFlashSale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const flashSale = await adminFlashSaleService.createFlashSale(req.body);
    res.status(201).json({
      success: true,
      data: flashSale,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFlashSale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const flashSale = await adminFlashSaleService.updateFlashSale(
      Number(id),
      req.body,
    );
    res.json({
      success: true,
      data: flashSale,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFlashSale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    await adminFlashSaleService.deleteFlashSale(Number(id));
    res.json({
      success: true,
      message: "Flash Sale deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleFlashSaleActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const flashSale = await adminFlashSaleService.toggleFlashSaleActive(
      Number(id),
    );
    res.json({ success: true, data: flashSale });
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
    const products = await adminFlashSaleService.getFlashSaleProducts(
      Number(id),
    );
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export async function updateFlashSaleProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const product = await adminFlashSaleService.updateFlashSaleProduct(
      Number(id),
      req.body,
    );
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function addProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { products } = req.body;
    const result = await adminFlashSaleService.addProductsToFlashSale(
      Number(id),
      products,
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    await adminFlashSaleService.removeProductFromFlashSale(Number(id));
    res.json({
      success: true,
      message: "Product removed from Flash Sale",
    });
  } catch (error) {
    next(error);
  }
}

import { BadRequestError, UnauthorizedError } from "@repo/shared/errors";
import { Request, Response, NextFunction } from "express";

import * as searchService from "../services/searchService";
import { AuthenticatedRequest } from "../types/express";

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, category, minPrice, maxPrice, page, limit } = req.query;

    if (!q || typeof q !== "string") {
      throw new BadRequestError("Search query (q) is required");
    }

    const results = await searchService.searchProducts({
      q,
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
}

export async function autocomplete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== "string") {
      throw new BadRequestError("Search query (q) is required");
    }

    const results = await searchService.autocompleteSearch(
      q,
      limit ? Number(limit) : undefined,
    );

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
}

export async function advancedSearch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filters = req.body;
    const results = await searchService.advancedSearch(filters);

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }

    const result = await searchService.deleteSearchHistory(userId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

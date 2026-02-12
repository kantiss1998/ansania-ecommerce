import { Request, Response, NextFunction } from "express";

import * as recommendationService from "../services/recommendationService";
import { AuthenticatedRequest } from "../types/express";

export async function getPersonalizedRecommendations(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.json({ success: true, data: [] });
      return;
    }

    const recommendations =
      await recommendationService.getPersonalizedRecommendations(userId);
    res.json({
      success: true,
      data: recommendations,
    });
    return;
  } catch (error) {
    return next(error);
  }
}

export async function getFrequentlyBoughtTogether(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const recommendations =
      await recommendationService.getFrequentlyBoughtTogether(
        Number(productId),
      );
    res.json({
      success: true,
      data: recommendations,
    });
    return;
  } catch (error) {
    return next(error);
  }
}

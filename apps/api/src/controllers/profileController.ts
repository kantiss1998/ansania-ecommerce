import { UnauthorizedError } from "@repo/shared/errors";
import { UpdateProfileDTO, ChangePasswordDTO } from "@repo/shared/schemas";
import { Request, Response, NextFunction } from "express";

import * as profileService from "../services/profileService";
import { AuthenticatedRequest } from "../types/express";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) throw new UnauthorizedError();

    const user = await profileService.getProfile(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) throw new UnauthorizedError();

    const body = req.body as UpdateProfileDTO;
    const user = await profileService.updateProfile(userId, body);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) throw new UnauthorizedError();

    const body = req.body as ChangePasswordDTO;
    await profileService.changePassword(userId, body);
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
}

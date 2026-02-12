import { HTTP_STATUS, USER_ROLES } from "@repo/shared/constants";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthenticatedRequest } from "../types/express";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: "No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded as { userId: number; email: string; role: string };
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: "Invalid token",
    });
    return;
  }
};

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: "Forbidden: Admin access required",
    });
    return;
  }
  next();
};

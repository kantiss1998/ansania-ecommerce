import { HTTP_STATUS } from "@repo/shared/constants";
import { AddToCartDTO } from "@repo/shared/schemas";
import { Request, Response, NextFunction } from "express";

import * as cartService from "../services/cartService";
import { AuthenticatedRequest } from "../types/express";

function getSession(req: Request) {
  // If authenticated (via auth middleware), use user.
  // If not, check for 'x-session-id' header or similar for guests.
  const user = (req as AuthenticatedRequest).user;
  const userId = user ? user.userId : undefined;
  const sessionId = (req.headers["x-session-id"] as string) || undefined;

  return { userId, sessionId };
}

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = getSession(req);
    if (!userId && !sessionId) {
      // Generate session ID if neither exists?
      // Better to Ask frontend to generate UUID for session.
      // Or return empty with a new session ID hint?
      // For now, assume client sends x-session-id or is logged in.
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Session ID or Login required" });
      return;
    }

    const cart = await cartService.getCart(userId, sessionId);
    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, sessionId } = getSession(req);
    if (!userId && !sessionId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Session ID required" });
      return;
    }

    const body = req.body as AddToCartDTO;
    const cart = await cartService.addToCart(userId, sessionId, body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, sessionId } = getSession(req);
    const { id } = req.params;
    const { quantity } = req.body as { quantity: number };

    const cart = await cartService.updateItem(
      userId,
      sessionId,
      Number(id),
      quantity,
    );
    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, sessionId } = getSession(req);
    const { id } = req.params;

    const cart = await cartService.removeItem(userId, sessionId, Number(id));
    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, sessionId } = getSession(req);
    if (!userId && !sessionId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Session ID or Login required" });
      return;
    }

    const cart = await cartService.clearCart(userId, sessionId);
    res.json({
      success: true,
      data: cart,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function mergeCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = getSession(req);
    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, error: "User must be logged in" });
      return;
    }

    const { session_id } = req.body as { session_id: string };
    if (!session_id) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Guest session_id is required" });
      return;
    }

    const cart = await cartService.mergeGuestCartToUser(userId, session_id);
    res.json({
      success: true,
      data: cart,
      message: "Guest cart merged successfully",
    });
  } catch (error) {
    next(error);
  }
}

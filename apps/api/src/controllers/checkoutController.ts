import { HTTP_STATUS } from "@repo/shared/constants";
import { CreateOrderDTO } from "@repo/shared/schemas";
import { Request, Response, NextFunction } from "express";

import * as cartService from "../services/cartService"; // To get active cart
import * as orderService from "../services/orderService";
import * as shippingService from "../services/shippingService";
import { AuthenticatedRequest } from "../types/express";

export async function getShippingRates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shipping_address_id } = req.body;
    const userId = (req as AuthenticatedRequest).user?.userId;
    const sessionId = req.headers["x-session-id"] as string; // Allow guest? Maybe not for shipping if address needed.

    // Address usually implies User?
    // If guest checkout allowed, address would be passed fully or ID if temp stored.
    // Let's assume User for now or Guest if they provide address ID (which implies they created it).

    if (!userId && !sessionId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Session required" });
      return;
    }

    const cart = await cartService.getCart(userId, sessionId);
    if (!cart || !cart.items || cart.items.length === 0) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "Cart is empty" });
      return;
    }

    const rates = await shippingService.calculateShipping(
      shipping_address_id,
      cart.id,
    );

    res.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, error: "Unauthorized" });
      return;
    }

    const body = req.body as CreateOrderDTO;
    const order = await orderService.createOrder(userId, body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function validateCheckout(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, error: "Unauthorized" });
    }

    const validationResult = await orderService.validateCheckout(
      userId,
      req.body,
    );

    return res.json({
      success: true,
      data: validationResult,
    });
  } catch (error) {
    return next(error);
  }
}

import { AppError } from "@repo/shared/errors";
import { Request, Response } from "express";

import * as orderService from "../services/orderService";
import { AuthenticatedRequest } from "../types/express";

export const getOrders = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.userId;
  if (!userId) throw new AppError("User not authenticated", 401);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status as string;

  const result = await orderService.getUserOrders(userId, page, limit, status);
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getOrderDetail = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.userId;
  if (!userId) throw new AppError("User not authenticated", 401);

  const { orderNumber } = req.params;
  if (!orderNumber) throw new AppError("Order number is required", 400);

  const order = await orderService.getOrderDetail(userId, orderNumber);
  res.json({
    success: true,
    data: order,
  });
};

export const cancelOrder = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.userId;
  if (!userId) throw new AppError("User not authenticated", 401);

  const { orderNumber } = req.params;
  if (!orderNumber) throw new AppError("Order number is required", 400);

  const order = await orderService.cancelOrder(userId, orderNumber);
  res.json({
    success: true,
    data: order,
    message: "Order cancelled successfully",
  });
};

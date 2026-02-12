import { toCSV } from "@repo/shared/utils";
import { Request, Response, NextFunction } from "express";

import * as adminCustomerService from "../../services/admin/customerService";

interface CustomerExportItem {
  full_name: string;
  email: string;
  phone: string;
  orders_count: number;
  total_spent: number;
  created_at: string | Date;
}

export async function getAllCustomers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await adminCustomerService.listCustomers(req.query);

    if (req.query.export === "csv") {
      const csv = toCSV(
        (result.items as unknown as CustomerExportItem[]).map((c) => ({
          name: c.full_name,
          email: c.email,
          phone: c.phone,
          orders: c.orders_count,
          spent: c.total_spent,
          date: c.created_at,
        })),
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=customers.csv",
      );
      return res.send(csv);
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCustomerDetail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const customer = await adminCustomerService.getCustomerDetail(Number(id));
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const customer = await adminCustomerService.updateCustomer(
      Number(id),
      req.body,
    );
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const customer = await adminCustomerService.toggleCustomerStatus(
      Number(id),
    );
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await adminCustomerService.getCustomerOrders(
      Number(id),
      req.query,
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAddresses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const addresses = await adminCustomerService.getCustomerAddresses(
      Number(id),
    );
    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReviews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await adminCustomerService.getCustomerReviews(
      Number(id),
      req.query,
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const stats = await adminCustomerService.getCustomerStats(Number(id));
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function getActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await adminCustomerService.getCustomerActivity(
      Number(id),
      req.query,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function exportCustomers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await adminCustomerService.exportCustomers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

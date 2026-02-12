import { User, Order, Address, Review, ActivityLog } from "@repo/database";
import { USER_ROLES } from "@repo/shared/constants";
import { NotFoundError } from "@repo/shared/errors";
import { calculatePagination, formatPhone } from "@repo/shared/utils";
import { Op } from "sequelize";

export interface CustomerListResult {
  items: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  totalReviews: number;
}

export async function listCustomers(query: {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
}): Promise<CustomerListResult> {
  const { page = 1, limit = 10, search, status } = query;

  const offset = (Number(page) - 1) * Number(limit);
  const where: Record<string | symbol, unknown> = { role: USER_ROLES.CUSTOMER };

  if (search) {
    where[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status) {
    // Assuming email_verified or some active flag
    if (status === "active") where.email_verified = true;
    if (status === "inactive") where.email_verified = false;
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
    attributes: { exclude: ["password"] },
  });

  return {
    items: rows,
    pagination: calculatePagination(Number(page), Number(limit), count),
  };
}

export async function getCustomerDetail(id: number): Promise<User> {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      { model: Address, as: "addresses" },
      {
        model: Order,
        as: "orders",
        limit: 10,
        order: [["created_at", "DESC"]],
      },
      {
        model: Review,
        as: "reviews",
        limit: 10,
        order: [["created_at", "DESC"]],
      },
    ],
  });

  if (!user) throw new NotFoundError("Customer");
  return user;
}

export async function updateCustomer(
  id: number,
  data: Partial<User>,
): Promise<User> {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("Customer");

  if (data.phone) {
    data.phone = formatPhone(data.phone);
  }

  await user.update(data);
  return user;
}

export async function toggleCustomerStatus(id: number): Promise<User> {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("Customer");

  // Toggle email_verified as a proxy for active status if no is_active field exists
  await user.update({ email_verified: !user.email_verified });
  return user;
}

export async function getCustomerOrders(
  id: number,
  query: { page?: number | string; limit?: number | string },
): Promise<{
  items: Order[];
  pagination: ReturnType<typeof calculatePagination>;
}> {
  const { page = 1, limit = 10 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await Order.findAndCountAll({
    where: { user_id: id },
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    items: rows,
    pagination: calculatePagination(Number(page), Number(limit), count),
  };
}

export async function getCustomerAddresses(id: number): Promise<Address[]> {
  return Address.findAll({ where: { user_id: id } });
}

export async function getCustomerReviews(
  id: number,
  query: { page?: number | string; limit?: number | string },
): Promise<{
  items: Review[];
  pagination: ReturnType<typeof calculatePagination>;
}> {
  const { page = 1, limit = 10 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await Review.findAndCountAll({
    where: { user_id: id },
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    items: rows,
    pagination: calculatePagination(Number(page), Number(limit), count),
  };
}

export async function getCustomerStats(id: number): Promise<CustomerStats> {
  const totalOrders = await Order.count({ where: { user_id: id } });
  const totalSpent = await Order.sum("total_amount", {
    where: { user_id: id, status: { [Op.notIn]: ["cancelled", "refunded"] } },
  });
  const totalReviews = await Review.count({ where: { user_id: id } });

  return {
    totalOrders,
    totalSpent: totalSpent || 0,
    totalReviews,
  };
}

export async function getCustomerActivity(
  id: number,
  query: { page?: number | string; limit?: number | string },
): Promise<{
  items: ActivityLog[];
  pagination: ReturnType<typeof calculatePagination>;
}> {
  const { page = 1, limit = 20 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await ActivityLog.findAndCountAll({
    where: { user_id: id },
    limit: Number(limit),
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    items: rows,
    pagination: calculatePagination(Number(page), Number(limit), count),
  };
}

export async function exportCustomers(
  query: Record<string, unknown>,
): Promise<User[]> {
  const customers = await listCustomers({ ...query, limit: 1000, page: 1 });
  return customers.items;
}

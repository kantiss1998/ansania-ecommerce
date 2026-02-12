import { Order, PaginatedResponse } from "@repo/shared";
import { cookies } from "next/headers";

import AdminOrdersClient from "./client";

export const dynamic = "force-dynamic";

async function getOrders(searchParams: {
  page?: string;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<Order> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const query = new URLSearchParams({
      page: searchParams.page || "1",
      limit: "20",
      ...(searchParams.search && { search: searchParams.search }),
      ...(searchParams.status && { status: searchParams.status }),
    });

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    const response = await fetch(
      `${baseUrl}/admin/orders?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch orders:", response.statusText);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const ordersData = await getOrders(resolvedParams);

  return <AdminOrdersClient initialData={ordersData} />;
}

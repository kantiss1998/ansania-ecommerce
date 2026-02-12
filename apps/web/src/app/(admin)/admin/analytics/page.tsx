import { cookies } from "next/headers";

import AdminAnalyticsClient from "./client";

export const dynamic = "force-dynamic";

async function getAnalyticsSummary() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    // Parallel fetch for different analytics metrics
    const [viewsRes, convRes, cartsRes] = await Promise.all([
      fetch(`${baseUrl}/admin/analytics/product-views?period=this_month`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${baseUrl}/admin/analytics/conversion?period=this_month`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${baseUrl}/admin/analytics/abandoned-carts?period=this_month`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const views = viewsRes.ok ? (await viewsRes.json()).data : null;
    const conversion = convRes.ok ? (await convRes.json()).data : null;
    const abandonedCarts = cartsRes.ok ? (await cartsRes.json()).data : null;

    return { views, conversion, abandonedCarts };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsSummary();

  return <AdminAnalyticsClient initialData={data} />;
}

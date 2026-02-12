import { Category, PaginatedResponse } from "@repo/shared";
import { cookies } from "next/headers";

import AdminCategoriesClient from "./client";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<PaginatedResponse<Category> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/admin/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.statusText);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

export default async function AdminCategoriesPage() {
  const categoriesData = await getCategories();

  return <AdminCategoriesClient initialData={categoriesData} />;
}

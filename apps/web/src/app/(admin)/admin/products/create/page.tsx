import { cookies } from "next/headers";

import { ProductForm } from "@/components/features/admin/ProductForm";

export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return [];

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.statusText);
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CreateProductPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto">
      <ProductForm categories={categories} />
    </div>
  );
}

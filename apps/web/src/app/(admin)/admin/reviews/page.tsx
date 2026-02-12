import { Review, PaginatedResponse } from "@repo/shared";
import { cookies } from "next/headers";

import AdminReviewsClient from "./client";

export const dynamic = "force-dynamic";

async function getReviews(searchParams: {
  page?: string;
  status?: string;
}): Promise<PaginatedResponse<Review> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const query = new URLSearchParams({
      page: searchParams.page || "1",
      limit: "20",
      ...(searchParams.status && { status: searchParams.status }),
    });

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");
    const response = await fetch(
      `${baseUrl}/admin/reviews?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch reviews:", response.statusText);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const reviewsData = await getReviews(resolvedParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminReviewsClient initialData={reviewsData} />
    </div>
  );
}

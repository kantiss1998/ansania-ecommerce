"use client";

import { Review, PaginatedResponse } from "@repo/shared";
import { REVIEW_STATUS } from "@repo/shared/constants";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { getAccessToken } from "@/lib/auth";

interface AdminReviewsClientProps {
  initialData: PaginatedResponse<Review> | null;
}

function AdminReviewsContent({ initialData }: AdminReviewsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

  const handleModeration = async (
    id: number,
    action: "approve" | "reject" | "delete",
  ) => {
    try {
      setIsActionLoading(id);
      const token = getAccessToken();
      const method = action === "delete" ? "DELETE" : "PATCH";
      const endpoint =
        action === "delete"
          ? `/api/admin/reviews/${id}`
          : `/api/admin/reviews/${id}/${action}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        router.refresh();
      } else {
        alert(`Gagal melakukan ${action} pada ulasan.`);
      }
    } catch (error) {
      console.error("Review action error:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const currentStatus = searchParams.get("status") || "";

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={s <= rating ? "fill-current" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Ulasan & Rating
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Moderasi ulasan produk dari pelanggan untuk menjaga kualitas konten
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={
              currentStatus === REVIEW_STATUS.PENDING ? "primary" : "outline"
            }
            size="sm"
            onClick={() =>
              router.push(`/admin/reviews?status=${REVIEW_STATUS.PENDING}`)
            }
          >
            Butuh Moderasi
          </Button>
          <Button
            variant={currentStatus === "" ? "primary" : "outline"}
            size="sm"
            onClick={() => router.push("/admin/reviews")}
          >
            Semua
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Rating & Ulasan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData?.items && initialData.items.length > 0 ? (
              initialData.items.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="max-w-[180px]">
                    <div className="flex items-center gap-3">
                      {review.product?.image && (
                        <Image
                          src={review.product.image}
                          alt={review.product?.name || ""}
                          width={40}
                          height={40}
                          className="rounded object-cover border border-gray-100"
                        />
                      )}
                      <span
                        className="font-medium text-gray-900 truncate"
                        title={review.product?.name}
                      >
                        {review.product?.name || "Produk Tidak Ada"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {review.user?.full_name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {review.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <StarRating rating={review.rating} />
                    <p
                      className="mt-1 text-sm text-gray-600 line-clamp-2"
                      title={review.comment}
                    >
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === REVIEW_STATUS.APPROVED
                          ? "success"
                          : review.status === REVIEW_STATUS.PENDING
                            ? "warning"
                            : review.status === REVIEW_STATUS.REJECTED
                              ? "error"
                              : "default"
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      {review.status === REVIEW_STATUS.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-success-600 hover:bg-success-50"
                            onClick={() =>
                              handleModeration(review.id, "approve")
                            }
                            isLoading={isActionLoading === review.id}
                            title="Setujui"
                          >
                            ✓
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-error-600 hover:bg-error-50"
                            onClick={() =>
                              handleModeration(review.id, "reject")
                            }
                            isLoading={isActionLoading === review.id}
                            title="Tolak"
                          >
                            ✕
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-error-600"
                        onClick={() => handleModeration(review.id, "delete")}
                        isLoading={isActionLoading === review.id}
                        title="Hapus"
                      >
                        🗑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada ulasan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminReviewsClient({
  initialData,
}: AdminReviewsClientProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">Memuat ulasan...</div>
      }
    >
      <AdminReviewsContent initialData={initialData} />
    </Suspense>
  );
}

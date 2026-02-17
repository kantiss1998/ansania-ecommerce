"use client";

import { Review, PaginatedResponse } from "@repo/shared";
import { REVIEW_STATUS } from "@repo/shared/constants";
import {
  MessageSquare,
  Star,
  Check,
  X,
  Trash2,
  Loader2,
  MessageCircleX,
  Filter,
} from "lucide-react";
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
          ? `/admin/reviews/${id}`
          : `/admin/reviews/${id}/${action}`;

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
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${
              s <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 px-5 py-2.5 shadow-sm border border-yellow-100/50 mb-4">
              <MessageSquare className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
                Manajemen Ulasan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-yellow-800 to-gray-900 bg-clip-text text-transparent font-heading">
              Ulasan & Rating
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Moderasi ulasan produk dari pelanggan untuk menjaga kualitas
              konten
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={
                currentStatus === REVIEW_STATUS.PENDING ? "gradient" : "outline"
              }
              size="sm"
              className="rounded-2xl"
              onClick={() =>
                router.push(`/admin/reviews?status=${REVIEW_STATUS.PENDING}`)
              }
            >
              <Filter className="mr-2 h-4 w-4" />
              Butuh Moderasi
            </Button>
            <Button
              variant={currentStatus === "" ? "gradient" : "outline"}
              size="sm"
              className="rounded-2xl"
              onClick={() => router.push("/admin/reviews")}
            >
              Semua
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
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
                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50 shadow-sm">
                          <Image
                            src={review.product.image}
                            alt={review.product?.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span
                        className="font-bold text-gray-900 truncate"
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
                    <div className="flex justify-center gap-2">
                      {review.status === REVIEW_STATUS.PENDING && (
                        <>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 rounded-xl"
                            onClick={() =>
                              handleModeration(review.id, "approve")
                            }
                            isLoading={isActionLoading === review.id}
                            title="Setujui"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 rounded-xl"
                            onClick={() =>
                              handleModeration(review.id, "reject")
                            }
                            isLoading={isActionLoading === review.id}
                            title="Tolak"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => handleModeration(review.id, "delete")}
                        isLoading={isActionLoading === review.id}
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <MessageCircleX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium text-gray-600">
                    Tidak ada ulasan ditemukan.
                  </p>
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
        <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-yellow-600 animate-spin" />
            <p className="text-base font-medium text-gray-600">
              Memuat ulasan...
            </p>
          </div>
        </div>
      }
    >
      <AdminReviewsContent initialData={initialData} />
    </Suspense>
  );
}

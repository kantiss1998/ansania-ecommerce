"use client";

import { Review } from "@repo/shared";
import { REVIEW_STATUS } from "@repo/shared/constants";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import apiClient from "@/lib/api";

export default function AdminPendingReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ data: { items: Review[] } }>(
        `/admin/reviews?status=${REVIEW_STATUS.PENDING}`,
      );
      setReviews(response.data.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch pending reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeration = async (id: number, action: "approve" | "reject") => {
    setIsActionLoading(id);
    try {
      await apiClient.patch(`/admin/reviews/${id}/${action}`);
      // Remove from list after action
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(`Failed to ${action} review:`, error);
      alert(`Gagal melakukan ${action} pada ulasan.`);
    } finally {
      setIsActionLoading(null);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Ulasan yang menunggu moderasi ({reviews.length} ulasan)
          </p>
        </div>
        <Link href="/admin/reviews">
          <Button variant="outline">← Lihat Semua Ulasan</Button>
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Rating & Ulasan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
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
                  <TableCell className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-success-600 hover:bg-success-50"
                        onClick={() => handleModeration(review.id, "approve")}
                        isLoading={isActionLoading === review.id}
                      >
                        ✓ Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-error-600 hover:bg-error-50"
                        onClick={() => handleModeration(review.id, "reject")}
                        isLoading={isActionLoading === review.id}
                      >
                        ✕ Tolak
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  Tidak ada ulasan yang menunggu moderasi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

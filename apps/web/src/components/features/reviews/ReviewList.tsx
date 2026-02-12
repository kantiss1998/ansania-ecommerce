"use client";

import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

import { RatingStars } from "./RatingStars";
import { ReviewForm, ReviewData } from "./ReviewForm";

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  helpful_count: number;
  user_avatar?: string;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewList({
  reviews: initialReviews,
  averageRating,
  totalReviews,
}: ReviewListProps) {
  const { isAuthenticated } = useAuthStore();
  const { success, error } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => Math.floor(r.rating) === filterRating);

  const handleSubmitReview = async (data: ReviewData) => {
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newReview: Review = {
        id: Date.now(),
        user_name: "Pengguna", // Should get from auth store
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        created_at: new Date().toISOString(),
        helpful_count: 0,
      };

      setReviews([newReview, ...reviews]);
      success("Ulasan berhasil dikirim!");
      setIsFormOpen(false);
    } catch (err) {
      error("Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      error("Silakan login untuk menulis ulasan");
      return; // Or redirect to login
    }
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Summary */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="text-center md:text-left bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="text-5xl font-bold text-gray-900 font-heading">
              {averageRating.toFixed(1)}
            </div>
            <div className="mt-2 flex justify-center md:justify-start">
              <RatingStars rating={averageRating} size="lg" />
            </div>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Berdasarkan {totalReviews} ulasan
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-6 w-full shadow-lg shadow-primary-500/20"
              onClick={handleWriteReview}
            >
              Tulis Ulasan
            </Button>
          </div>
        </div>

        {/* Rating Distribution (Mock) */}
        <div className="md:col-span-2">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-600 flex items-center gap-1">
                  {star}{" "}
                  <Star className="h-3 w-3 fill-gray-400 text-gray-400" />
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-warning-400 rounded-full transition-all duration-500"
                    style={{ width: `${star * 15}%` }} // Mock percentages
                  />
                </div>
                <span className="w-10 text-right text-sm text-gray-400 tabular-nums">
                  {star * 15}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-100 pb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterRating("all")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-bold transition-all whitespace-nowrap",
            filterRating === "all"
              ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200",
          )}
        >
          Semua
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1",
              filterRating === star
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200",
            )}
          >
            {star}{" "}
            <Star
              className={cn(
                "h-3 w-3",
                filterRating === star
                  ? "fill-white text-white"
                  : "fill-gray-400 text-gray-400",
              )}
            />
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
              <Star className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              Belum ada ulasan untuk rating ini.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 font-bold text-primary-700 text-lg shadow-sm border border-white ring-2 ring-primary-50">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {review.user_name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pl-[4rem]">
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {review.comment}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:border-gray-200">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Membantu ({review.helpful_count})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tulis Ulasan"
      >
        <ReviewForm
          onSubmit={handleSubmitReview}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}

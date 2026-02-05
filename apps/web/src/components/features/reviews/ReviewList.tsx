'use client';

import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ReviewForm, ReviewData } from './ReviewForm';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';

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
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');

    const filteredReviews = filterRating === 'all'
        ? reviews
        : reviews.filter((r) => Math.floor(r.rating) === filterRating);

    const handleSubmitReview = async (data: ReviewData) => {
        setIsSubmitting(true);
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newReview: Review = {
                id: Date.now(),
                user_name: 'Pengguna', // Should get from auth store
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                created_at: new Date().toISOString(),
                helpful_count: 0,
            };

            setReviews([newReview, ...reviews]);
            success('Ulasan berhasil dikirim!');
            setIsFormOpen(false);
        } catch (err) {
            error('Gagal mengirim ulasan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWriteReview = () => {
        if (!isAuthenticated) {
            error('Silakan login untuk menulis ulasan');
            return; // Or redirect to login
        }
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header / Summary */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="mt-2 flex justify-center md:justify-start">
                            <RatingStars rating={averageRating} size="lg" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Berdasarkan {totalReviews} ulasan
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4"
                            onClick={handleWriteReview}
                        >
                            Tulis Ulasan
                        </Button>
                    </div>
                </div>

                {/* Rating Distribution (Mock) */}
                <div className="md:col-span-2">
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="w-12 text-sm text-gray-600">{star} Bintang</span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full bg-warning-DEFAULT"
                                        style={{ width: `${star * 15}%` }} // Mock percentages
                                    />
                                </div>
                                <span className="w-8 text-right text-sm text-gray-400">
                                    {star * 15}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-gray-200 pb-4">
                <button
                    onClick={() => setFilterRating('all')}
                    className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${filterRating === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Semua
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        onClick={() => setFilterRating(star)}
                        className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${filterRating === star
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {star} Bintang
                    </button>
                ))}
            </div>

            {/* Review List */}
            <div className="space-y-6">
                {filteredReviews.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                        Belum ada ulasan untuk rating ini.
                    </p>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {review.user_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <RatingStars rating={review.rating} size="sm" />
                                            <span>
                                                {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h4 className="font-medium text-gray-900">{review.title}</h4>
                                <p className="mt-1 text-gray-600">{review.comment}</p>
                            </div>

                            <div className="mt-4 flex items-center gap-4">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    Membantu ({review.helpful_count})
                                </button>
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

'use client';

import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ReviewFormProps {
    onSubmit: (data: ReviewData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface ReviewData {
    rating: number;
    title: string;
    comment: string;
}

export function ReviewForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (rating === 0) newErrors.rating = 'Beri rating minimal 1 bintang';
        if (!title.trim()) newErrors.title = 'Judul ulasan wajib diisi';
        if (!comment.trim()) newErrors.comment = 'Isi ulasan wajib diisi';
        else if (comment.length < 10) newErrors.comment = 'Ulasan minimal 10 karakter';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ rating, title, comment });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rating Anda
                </label>
                <RatingStars
                    rating={rating}
                    onChange={setRating}
                    readonly={false}
                    size="lg"
                    className="mb-1"
                />
                {errors.rating && (
                    <p className="text-sm text-error-600">{errors.rating}</p>
                )}
            </div>

            <Input
                label="Judul Ulasan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                placeholder="Contoh: Kualitas sangat bagus!"
                required
            />

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ulasan
                </label>
                <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 ${errors.comment
                        ? 'border-error-300 focus:border-error-500 focus:ring-error-200'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                        }`}
                    placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                />
                {errors.comment && (
                    <p className="mt-1 text-sm text-error-600">{errors.comment}</p>
                )}
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="flex-1"
                >
                    Kirim Ulasan
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Batal
                </Button>
            </div>
        </form>
    );
}

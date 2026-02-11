import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

export function RatingStars({
    rating,
    maxRating = 5,
    size = 'md',
    readonly = true,
    onChange,
    className,
}: RatingStarsProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-8 w-8',
    };

    return (
        <div className={cn('flex items-center gap-0.5', className)}>
            {[...Array(maxRating)].map((_, index) => {
                const starRating = index + 1;
                const isFull = starRating <= rating;
                const isHalf = starRating > rating && starRating - 1 < rating;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => !readonly && onChange?.(starRating)}
                        disabled={readonly}
                        className={cn(
                            'transition-all duration-200',
                            !readonly && 'cursor-pointer hover:scale-110 active:scale-95',
                            readonly && 'cursor-default'
                        )}
                    >
                        <div className="relative">
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    "text-gray-200 fill-gray-200"
                                )}
                                strokeWidth={1.5}
                            />
                            {(isFull || isHalf) && (
                                <div
                                    className={cn(
                                        "absolute top-0 left-0 overflow-hidden",
                                        isHalf ? "w-1/2" : "w-full"
                                    )}
                                >
                                    <Star
                                        className={cn(
                                            sizeClasses[size],
                                            "text-warning-400 fill-warning-400"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

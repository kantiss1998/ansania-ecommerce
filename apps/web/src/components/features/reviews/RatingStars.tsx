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
        <div className={cn('flex items-center', className)}>
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
                            'text-warning-DEFAULT transition-colors',
                            !readonly && 'cursor-pointer hover:scale-110',
                            readonly && 'cursor-default'
                        )}
                    >
                        {isFull ? (
                            <svg className={sizeClasses[size]} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ) : isHalf ? (
                            <svg className={sizeClasses[size]} viewBox="0 0 20 20" fill="currentColor">
                                <defs>
                                    <linearGradient id="halfStar">
                                        <stop offset="50%" stopColor="currentColor" />
                                        <stop offset="50%" stopColor="lightgray" stopOpacity="0.5" />
                                    </linearGradient>
                                </defs>
                                <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ) : (
                            <svg className={cn(sizeClasses[size], "text-gray-300")} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

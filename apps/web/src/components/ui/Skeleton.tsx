import { cn } from '@/lib/utils';

/**
 * Skeleton props
 */
export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

/**
 * Skeleton component for loading states
 */
export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const variantStyles = {
        text: 'h-4 w-full rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={cn(
                'animate-pulse bg-gray-200',
                variantStyles[variant],
                className
            )}
            style={style}
        />
    );
}

/**
 * Product card skeleton
 */
export function ProductCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div className="flex items-center justify-between">
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={100} />
            </div>
        </div>
    );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" />
            </div>
        </div>
    );
}

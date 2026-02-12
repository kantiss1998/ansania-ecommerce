"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton props
 */
export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

/**
 * Skeleton component for loading states with shimmer effect
 */
export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        variantStyles[variant],
        className,
      )}
      style={{
        ...style,
        animation:
          "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite",
      }}
    />
  );
}

/**
 * Product card skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-lg space-y-3">
      <Skeleton variant="rectangular" height={200} className="rounded-xl" />
      <Skeleton variant="text" width="40%" height={16} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton
          variant="rectangular"
          width={120}
          height={44}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

/**
 * Order card skeleton
 */
export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={180} height={16} />
        </div>
        <Skeleton
          variant="rectangular"
          width={100}
          height={32}
          className="rounded-full"
        />
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton
          variant="rectangular"
          width={110}
          height={40}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

/**
 * Dashboard stats skeleton
 */
export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg space-y-3">
      <Skeleton
        variant="rectangular"
        width={48}
        height={48}
        className="rounded-xl"
      />
      <Skeleton variant="text" width={80} height={32} />
      <Skeleton variant="text" width={120} height={16} />
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

/**
 * Page header skeleton
 */
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton variant="text" width={200} height={32} />
      <Skeleton variant="text" width={300} height={16} />
    </div>
  );
}

/**
 * Form skeleton
 */
export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="rectangular" height={44} className="rounded-xl" />
        </div>
      ))}
      <Skeleton variant="rectangular" height={44} className="rounded-xl mt-6" />
    </div>
  );
}

/**
 * Grid skeleton
 */
export function GridSkeleton({
  items = 6,
  columns = 3,
}: {
  items?: number;
  columns?: number;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * List skeleton
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

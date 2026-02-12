"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

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
        "animate-shimmer bg-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        variantStyles[variant],
        className,
      )}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-md space-y-3">
      <Skeleton variant="rectangular" height={200} className="rounded-xl" />
      <Skeleton variant="text" width="40%" height={16} />
      <Skeleton variant="text" width="80%" height={20} />
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

export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-md">
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
    </div>
  );
}

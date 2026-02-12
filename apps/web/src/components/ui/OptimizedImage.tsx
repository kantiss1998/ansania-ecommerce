"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  /**
   * Show blur placeholder while loading
   */
  showPlaceholder?: boolean;

  /**
   * Custom placeholder color
   */
  placeholderColor?: string;

  /**
   * Fallback image if main image fails to load
   */
  fallbackSrc?: string;
}

/**
 * Optimized Image Component
 *
 * Features:
 * - Automatic WebP/AVIF conversion
 * - Lazy loading
 * - Blur placeholder
 * - Error fallback
 * - Loading state
 */
export function OptimizedImage({
  src,
  alt,
  className,
  showPlaceholder = true,
  placeholderColor = "bg-gray-200",
  fallbackSrc = "/images/placeholder.png",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {isLoading && showPlaceholder && (
        <div
          className={cn("absolute inset-0 animate-pulse", placeholderColor)}
        />
      )}

      {/* Image */}
      <Image
        src={error && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

/**
 * Product Image Component
 * Optimized for product images with aspect ratio
 */
export function ProductImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "width" | "height">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={500}
      height={500}
      className={cn("aspect-square object-cover", className)}
      {...props}
    />
  );
}

/**
 * Hero Image Component
 * Optimized for hero/banner images
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "width" | "height" | "priority">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority
      className={cn("w-full h-auto", className)}
      {...props}
    />
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars
 */
export function AvatarImage({
  src,
  alt,
  size = 48,
  className,
  ...props
}: Omit<OptimizedImageProps, "width" | "height"> & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover", className)}
      {...props}
    />
  );
}

/**
 * Thumbnail Image Component
 * Optimized for thumbnails
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, "width" | "height">) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

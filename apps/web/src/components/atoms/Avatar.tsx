"use client";

import { User } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "away" | "busy";
}

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const sizeStyles = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-destructive",
  };

  const statusSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
    "2xl": "h-4 w-4",
  };

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600",
          sizeStyles[size],
        )}
      >
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : fallback ? (
          <span className="font-medium text-white">{fallback}</span>
        ) : (
          <User className="h-1/2 w-1/2 text-white" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusColors[status],
            statusSizes[size],
          )}
        />
      )}
    </div>
  );
}

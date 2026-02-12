import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Spinner props
 */
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Loading spinner component
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-primary-600",
        sizeStyles[size],
        className,
      )}
    />
  );
}

/**
 * Full-page loading overlay
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

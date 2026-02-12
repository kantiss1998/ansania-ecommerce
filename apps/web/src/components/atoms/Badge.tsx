import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    primary: "bg-primary-50 text-primary-700 border border-primary-100",
    success: "bg-success-light text-success border border-success/20",
    warning: "bg-warning-light text-warning border border-warning/20",
    error: "bg-destructive/10 text-destructive border border-destructive/20",
    info: "bg-info-light text-info border border-info/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-base",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

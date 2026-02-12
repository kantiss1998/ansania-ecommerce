import Image from "next/image";
import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Card variants
 */
type CardVariant =
  | "default"
  | "glass"
  | "gradient-border"
  | "elevated"
  | "flat";

/**
 * Card shadow variants
 */
type CardShadow = "none" | "sm" | "md" | "lg" | "xl" | "colored";

/**
 * Card props interface
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  variant?: CardVariant;
  shadow?: CardShadow;
}

/**
 * Card component - Enhanced container with multiple variants
 */
export function Card({
  children,
  className,
  padding = "md",
  hover = false,
  variant = "default",
  shadow = "md",
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
    xl: "p-8 md:p-10",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    colored: "shadow-lg shadow-primary-500/10",
  };

  const variantStyles = {
    default: "bg-white border border-gray-100",
    glass: "glass border border-white/30",
    "gradient-border":
      "bg-white relative overflow-hidden before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:bg-gradient-primary before:-z-10",
    elevated: "bg-white border-0 shadow-xl",
    flat: "bg-gray-50 border border-gray-200",
  };

  const hoverStyles = hover
    ? "hover:shadow-xl hover:-translate-y-1 hover:border-gray-200/50 cursor-pointer"
    : "";

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        variantStyles[variant],
        shadowStyles[shadow],
        hoverStyles,
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader component
 */
export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardTitle component
 */
export function CardTitle({
  children,
  className,
  gradient = false,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { gradient?: boolean }) {
  return (
    <h3
      className={cn(
        "text-lg md:text-xl font-semibold text-gray-900",
        gradient && "text-gradient",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * CardDescription component
 */
export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-600", className)} {...props}>
      {children}
    </p>
  );
}

/**
 * CardContent component
 */
export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter component
 */
export function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 gap-2", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardImage component - For product cards, etc.
 */
export function CardImage({
  src,
  alt,
  className,
  aspectRatio = "square",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}) {
  const aspectRatioStyles = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gray-100",
        aspectRatioStyles[aspectRatio],
        className,
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 hover:scale-110"
      />
    </div>
  );
}

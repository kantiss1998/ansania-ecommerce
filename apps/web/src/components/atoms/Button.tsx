import { Loader2, LucideIcon } from "lucide-react";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "gradient"
  | "gradient-gold"
  | "gradient-sunset";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  href?: string;
  leftIcon?: LucideIcon | ReactNode;
  rightIcon?: LucideIcon | ReactNode;
  ripple?: boolean;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      fullWidth = false,
      href,
      leftIcon,
      rightIcon,
      ripple = true,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-heading font-semibold transition-all duration-base active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl overflow-hidden";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 border border-transparent",
      secondary:
        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md",
      outline:
        "bg-transparent text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary hover:bg-primary-50",
      ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      destructive:
        "bg-destructive text-white hover:bg-destructive-dark shadow-md hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5",
      gradient:
        "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 border border-transparent",
      "gradient-gold":
        "bg-gradient-gold text-gray-900 shadow-lg hover:shadow-xl hover:shadow-accent-gold/40 hover:-translate-y-0.5 border border-transparent",
      "gradient-sunset":
        "bg-gradient-sunset text-white shadow-lg hover:shadow-xl hover:shadow-primary-400/40 hover:-translate-y-0.5 border border-transparent",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      xs: "h-8 px-3 text-xs gap-1.5",
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-14 px-8 text-base gap-2.5",
      xl: "h-16 px-10 text-lg gap-3",
    };

    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className,
    );

    const renderIcon = (icon: LucideIcon | ReactNode) => {
      if (!icon) return null;

      const iconSize = {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      }[size];

      if (
        typeof icon === "function" ||
        (typeof icon === "object" &&
          icon !== null &&
          "render" in (icon as object))
      ) {
        const IconComponent = icon as React.ElementType;
        return <IconComponent className={iconSize} />;
      }

      return icon;
    };

    const content = (
      <>
        {ripple && (
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-base group-hover:opacity-100" />
          </span>
        )}

        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {leftIcon && renderIcon(leftIcon)}
              {children}
              {rightIcon && renderIcon(rightIcon)}
            </>
          )}
        </span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(classes, "group")}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(classes, "group")}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

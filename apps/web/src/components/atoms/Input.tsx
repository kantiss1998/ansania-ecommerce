"use client";

import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  id?: string;
  leftIcon?: LucideIcon | ReactNode;
  rightIcon?: LucideIcon | ReactNode;
  floatingLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = true,
      id,
      leftIcon,
      rightIcon,
      floatingLabel = false,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const renderIcon = (
      icon: LucideIcon | ReactNode,
      size: string = "h-5 w-5",
    ) => {
      if (!icon) return null;
      if (
        typeof icon === "function" ||
        (typeof icon === "object" &&
          icon !== null &&
          "render" in (icon as unknown as Record<string, unknown>))
      ) {
        const IconComponent = icon as React.ElementType;
        return (
          <IconComponent
            className={cn(
              size,
              "text-gray-400 transition-colors duration-base",
              isFocused && "text-primary",
            )}
          />
        );
      }
      return icon;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const inputClasses = cn(
      "flex w-full rounded-xl border-2 transition-all duration-base ring-offset-white",
      "placeholder:text-gray-400",
      "hover:border-gray-300",
      "focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      error
        ? "border-destructive/30 bg-destructive/5"
        : "border-gray-200 bg-gray-50/50 focus:bg-white",
      leftIcon && "pl-12",
      rightIcon && "pr-12",
    );

    const labelClasses = cn(
      "text-sm font-medium transition-colors duration-base",
      error ? "text-destructive" : isFocused ? "text-primary" : "text-gray-700",
    );

    if (floatingLabel && label) {
      return (
        <div className={cn("relative flex flex-col", fullWidth && "w-full")}>
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                {renderIcon(leftIcon)}
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              value={value}
              className={cn(
                inputClasses,
                "h-14 px-4 pt-6 pb-2",
                "placeholder:text-transparent",
                className,
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />

            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-base pointer-events-none",
                "peer-focus:top-3 peer-focus:text-xs",
                (isFocused || hasValue) && "top-3 text-xs",
                leftIcon && "left-12",
                error && "text-destructive",
              )}
            >
              {label}
              {props.required && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </label>

            {rightIcon && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {renderIcon(rightIcon)}
              </div>
            )}
          </div>
          {error && (
            <p className="mt-1.5 text-sm text-destructive animate-slide-up">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}{" "}
            {props.required && <span className="text-destructive">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {renderIcon(leftIcon)}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            value={value}
            className={cn(inputClasses, "h-11 px-4 py-2 text-sm", className)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {renderIcon(rightIcon)}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive animate-slide-up">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

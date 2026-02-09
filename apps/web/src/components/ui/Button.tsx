import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Button variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props interface
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    href?: string;
}

/**
 * Reusable Button component with variants
 * Follows design system from coding standards
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            fullWidth = false,
            href,
            ...props
        },
        ref
    ) => {
        // Base styles
        const baseStyles =
            'inline-flex items-center justify-center font-medium font-heading transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md';

        // Variant styles
        const variantStyles: Record<ButtonVariant, string> = {
            primary:
                'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200 hover:shadow-primary-300 focus-visible:ring-primary-600 border border-transparent',
            secondary:
                'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-200',
            outline:
                'bg-transparent text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-200',
            ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-none hover:shadow-none',
            destructive:
                'bg-white text-error-600 border border-error-200 hover:bg-error-50 hover:border-error-300 shadow-error-100',
        };

        // Size styles
        const sizeStyles: Record<ButtonSize, string> = {
            sm: 'h-9 px-4 text-xs gap-1.5',
            md: 'h-11 px-6 text-sm gap-2',
            lg: 'h-14 px-8 text-base gap-2.5',
        };

        const classes = cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={classes}
                    // @ts-ignore - ref type mismatch but okay for practical purpose or need splitting types
                    ref={ref as any}
                >
                    {isLoading && (
                        <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    )}
                    {children}
                </Link>
            );
        }

        return (
            <button
                ref={ref as any}
                className={classes}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

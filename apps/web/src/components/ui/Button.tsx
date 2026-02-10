import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';

/**
 * Button variants
 */
type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'gradient'
    | 'gradient-gold'
    | 'gradient-sunset';

/**
 * Button sizes
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button props interface
 */
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

/**
 * Reusable Button component with variants
 * Enhanced with gradients, icons, and modern animations
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
            leftIcon,
            rightIcon,
            ripple = true,
            onClick,
            ...props
        },
        ref
    ) => {
        // Base styles
        const baseStyles =
            'relative inline-flex items-center justify-center font-heading font-semibold transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-xl overflow-hidden';

        // Variant styles
        const variantStyles: Record<ButtonVariant, string> = {
            primary:
                'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 border border-transparent',
            secondary:
                'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-200 shadow-sm hover:shadow-md',
            outline:
                'bg-transparent text-gray-700 border-2 border-gray-200 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-200',
            ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            destructive:
                'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5',
            gradient:
                'bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 border border-transparent',
            'gradient-gold':
                'bg-gradient-gold text-gray-900 shadow-lg hover:shadow-xl hover:shadow-yellow-500/40 hover:-translate-y-0.5 border border-transparent',
            'gradient-sunset':
                'bg-gradient-sunset text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 border border-transparent',
        };

        // Size styles
        const sizeStyles: Record<ButtonSize, string> = {
            xs: 'h-8 px-3 text-xs gap-1.5',
            sm: 'h-9 px-4 text-sm gap-1.5',
            md: 'h-11 px-6 text-sm gap-2',
            lg: 'h-14 px-8 text-base gap-2.5',
            xl: 'h-16 px-10 text-lg gap-3',
        };

        const classes = cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className
        );

        // Render icon helper
        const renderIcon = (icon: LucideIcon | ReactNode) => {
            if (!icon) return null;

            const iconSize = {
                xs: 'h-3 w-3',
                sm: 'h-4 w-4',
                md: 'h-4 w-4',
                lg: 'h-5 w-5',
                xl: 'h-6 w-6',
            }[size];

            if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as any))) {
                const IconComponent = icon as any;
                return <IconComponent className={iconSize} />;
            }

            return icon;
        };

        const content = (
            <>
                {/* Ripple effect overlay */}
                {ripple && (
                    <span className="absolute inset-0 overflow-hidden rounded-xl">
                        <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
                )}

                {/* Content */}
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
                    className={cn(classes, 'group')}
                    // @ts-ignore
                    ref={ref as any}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                ref={ref as any}
                className={cn(classes, 'group')}
                disabled={disabled || isLoading}
                onClick={onClick}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

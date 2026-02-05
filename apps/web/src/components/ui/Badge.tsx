import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variants
 */
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Badge props interface
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

/**
 * Badge component for tags, status indicators, and notifications
 */
export function Badge({
    children,
    className,
    variant = 'default',
    ...props
}: BadgeProps) {
    const variantStyles: Record<BadgeVariant, string> = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

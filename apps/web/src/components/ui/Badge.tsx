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
        default: 'bg-gray-100 text-gray-700 border border-gray-200',
        primary: 'bg-primary-50 text-primary-700 border border-primary-100',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border border-amber-100',
        error: 'bg-rose-50 text-rose-700 border border-rose-100',
        info: 'bg-sky-50 text-sky-700 border border-sky-100',
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

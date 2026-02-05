import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card props interface
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

/**
 * Card component - Container with elevation
 */
export function Card({
    children,
    className,
    padding = 'md',
    hover = false,
    ...props
}: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 bg-white shadow-sm',
                hover && 'transition-shadow hover:shadow-md',
                paddingStyles[padding],
                className
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
        <div
            className={cn('flex flex-col space-y-1.5', className)}
            {...props}
        >
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
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn('text-lg font-semibold text-gray-900', className)}
            {...props}
        >
            {children}
        </h3>
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
        <div className={cn('pt-4', className)} {...props}>
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
        <div
            className={cn('flex items-center pt-4', className)}
            {...props}
        >
            {children}
        </div>
    );
}

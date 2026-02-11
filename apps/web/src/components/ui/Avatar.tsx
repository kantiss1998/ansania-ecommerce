'use client';

import Image from 'next/image';
import * as React from 'react';
import { User } from 'lucide-react';
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/**
 * Avatar size type
 */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Avatar props interface
 */
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    status?: 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Avatar component - User profile picture with fallback
 */
export function Avatar({
    src,
    alt = 'Avatar',
    fallback,
    size = 'md',
    status,
    className,
    ...props
}: AvatarProps) {
    const sizeStyles = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
    };

    const statusSizes = {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-3.5 w-3.5',
        '2xl': 'h-4 w-4',
    };

    return (
        <div className={cn('relative inline-block', className)} {...props}>
            <div
                className={cn(
                    'relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600',
                    sizeStyles[size]
                )}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                    />
                ) : fallback ? (
                    <span className="font-medium text-white">
                        {fallback}
                    </span>
                ) : (
                    <User className="h-1/2 w-1/2 text-white" />
                )}
            </div>

            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-white',
                        statusColors[status],
                        statusSizes[size]
                    )}
                />
            )}
        </div>
    );
}

/**
 * AvatarGroup component - Display multiple avatars
 */
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    max?: number;
    size?: AvatarSize;
}

export function AvatarGroup({
    children,
    max = 5,
    size = 'md',
    className,
    ...props
}: AvatarGroupProps) {
    const childrenArray = React.Children.toArray(children);
    const displayedChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const remaining = max ? Math.max(childrenArray.length - max, 0) : 0;

    const sizeStyles = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
    };

    return (
        <div className={cn('flex items-center -space-x-2', className)} {...props}>
            {displayedChildren.map((child, index) => (
                <div
                    key={index}
                    className="ring-2 ring-white rounded-full"
                    style={{ zIndex: displayedChildren.length - index }}
                >
                    {child}
                </div>
            ))}
            {remaining > 0 && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium ring-2 ring-white',
                        sizeStyles[size]
                    )}
                    style={{ zIndex: 0 }}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}

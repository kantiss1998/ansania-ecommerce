'use client';

import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, forwardRef, ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Input props interface
 */
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
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(!!value);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const renderIcon = (icon: LucideIcon | ReactNode, size: string = 'h-5 w-5') => {
            if (!icon) return null;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as any))) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const IconComponent = icon as any;
                return <IconComponent className={cn(size, 'text-gray-400')} />;
            }

            return icon;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
        };

        if (floatingLabel && label) {
            return (
                <div className={cn('relative flex flex-col', fullWidth && 'w-full')}>
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
                                'peer flex h-14 w-full rounded-xl border-2 border-gray-200 bg-white px-4 pt-6 pb-2 text-sm transition-all duration-200',
                                'placeholder:text-transparent',
                                'hover:border-gray-300',
                                'focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500',
                                'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
                                error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
                                leftIcon && 'pl-12',
                                rightIcon && 'pr-12',
                                className
                            )}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChange={handleChange}
                            {...props}
                        />

                        <label
                            htmlFor={inputId}
                            className={cn(
                                'absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 pointer-events-none',
                                'peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary-600',
                                (isFocused || hasValue) && 'top-3 text-xs',
                                leftIcon && 'left-12',
                                error && 'text-red-500 peer-focus:text-red-600'
                            )}
                        >
                            {label}
                            {props.required && <span className="ml-1 text-red-500">*</span>}
                        </label>

                        {rightIcon && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {renderIcon(rightIcon)}
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="mt-1.5 text-sm text-red-600 animate-slide-down flex items-center gap-1">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                    )}

                    {helperText && !error && (
                        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
                    )}
                </div>
            );
        }

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
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
                        className={cn(
                            'flex h-11 w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all duration-200',
                            'placeholder:text-gray-400',
                            'hover:bg-white hover:border-gray-300',
                            'focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
                            error && 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-100',
                            leftIcon && 'pl-12',
                            rightIcon && 'pr-12',
                            className
                        )}
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
                    <p className="text-sm text-red-600 animate-slide-down flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

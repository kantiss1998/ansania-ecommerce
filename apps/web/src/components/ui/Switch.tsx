'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Switch props interface
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Switch component - Toggle switch for boolean values
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    (
        {
            className,
            label,
            description,
            size = 'md',
            checked,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const sizeStyles = {
            sm: {
                container: 'h-5 w-9',
                thumb: 'h-4 w-4',
                translate: 'translate-x-4',
            },
            md: {
                container: 'h-6 w-11',
                thumb: 'h-5 w-5',
                translate: 'translate-x-5',
            },
            lg: {
                container: 'h-7 w-14',
                thumb: 'h-6 w-6',
                translate: 'translate-x-7',
            },
        };

        const { container, thumb, translate } = sizeStyles[size];

        return (
            <div className={cn('flex items-start gap-3', className)}>
                <div className="relative inline-flex items-center">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={switchId}
                        className="sr-only peer"
                        checked={checked}
                        disabled={disabled}
                        {...props}
                    />
                    <label
                        htmlFor={switchId}
                        className={cn(
                            'relative inline-flex cursor-pointer items-center rounded-full transition-colors duration-200',
                            container,
                            checked
                                ? 'bg-gradient-primary'
                                : 'bg-gray-200',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block transform rounded-full bg-white shadow-md transition-transform duration-200',
                                thumb,
                                'ml-0.5',
                                checked && translate
                            )}
                        />
                    </label>
                </div>

                {(label || description) && (
                    <div className="flex flex-col gap-0.5">
                        {label && (
                            <label
                                htmlFor={switchId}
                                className={cn(
                                    'text-sm font-medium text-gray-900 cursor-pointer',
                                    disabled && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p className="text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Switch.displayName = 'Switch';

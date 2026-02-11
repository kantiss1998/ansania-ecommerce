import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';


export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            fullWidth = true,
            id,
            children,
            ...props
        },
        ref
    ) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && (
                            <span className="ml-1 text-error-500">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={cn(
                            'appearance-none flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all duration-200 pr-10',
                            'hover:bg-white hover:border-gray-300',
                            'focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
                            error && 'border-error-300 bg-error-50/30 focus:border-error-500 focus:ring-error-100',
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    {/* Chevron Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-error-500">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

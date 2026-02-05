import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input props interface
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * Reusable Input component for forms
 * Supports label, error messages, and helper text
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            fullWidth = true,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && (
                            <span className="ml-1 text-error-DEFAULT">*</span>
                        )}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
                        'placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-error-DEFAULT focus:ring-error-DEFAULT',
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-error-DEFAULT">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

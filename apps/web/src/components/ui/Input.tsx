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
    endAdornment?: React.ReactNode;
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
            endAdornment,
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
                            <span className="ml-1 text-error-500">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all duration-200',
                            'placeholder:text-gray-400',
                            'hover:bg-white hover:border-gray-300',
                            'focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
                            error && 'border-error-300 bg-error-50/30 focus:border-error-500 focus:ring-error-100',
                            endAdornment && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {endAdornment && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {endAdornment}
                        </div>
                    )}
                </div>

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

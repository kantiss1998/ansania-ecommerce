import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Stack } from '../layout/Stack';

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
        const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <Stack spacing={1.5} className={cn(fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-semibold text-gray-700 font-heading"
                    >
                        {label}
                        {props.required && <span className="ml-1 text-destructive">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={cn(
                            'appearance-none flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-all duration-base pr-11',
                            'hover:bg-white hover:border-gray-300',
                            'focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary',
                            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200',
                            error && 'border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/10',
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <ChevronDown className="h-4.5 w-4.5" />
                    </div>
                </div>

                {error && <p className="text-xs text-destructive font-medium">{error}</p>}
                {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
            </Stack>
        );
    }
);

Select.displayName = 'Select';

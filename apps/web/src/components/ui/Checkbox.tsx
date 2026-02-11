import { InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const checkboxId = id || (typeof label === 'string' ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

        return (
            <div className="flex items-start gap-2">
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        ref={ref}
                        id={checkboxId}
                        className={cn(
                            "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition duration-150 ease-in-out cursor-pointer",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-error-300 focus:ring-error-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className={cn(
                            "text-sm font-medium text-gray-700 cursor-pointer select-none",
                            props.disabled && "cursor-not-allowed opacity-50"
                        )}
                    >
                        {label}
                    </label>
                )}
                {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

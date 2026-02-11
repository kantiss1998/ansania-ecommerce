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
            <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5 group">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            ref={ref}
                            id={checkboxId}
                            className={cn(
                                "h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary/20 transition duration-base cursor-pointer",
                                "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200",
                                error && "border-destructive focus:ring-destructive/20",
                                className
                            )}
                            {...props}
                        />
                    </div>
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm font-medium text-gray-700 cursor-pointer select-none transition-colors group-hover:text-gray-900",
                                props.disabled && "cursor-not-allowed opacity-50 group-hover:text-gray-400"
                            )}
                        >
                            {label}
                        </label>
                    )}
                </div>
                {error && <p className="text-xs text-destructive font-medium ml-7">{error}</p>}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

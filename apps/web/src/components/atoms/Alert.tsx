import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
}

export const Alert = ({
    variant = 'info',
    title,
    children,
    className,
    onClose,
}: AlertProps) => {
    const variants = {
        info: {
            bg: 'bg-info-light/50',
            border: 'border-info/20',
            text: 'text-info',
            icon: Info,
        },
        success: {
            bg: 'bg-success-light/50',
            border: 'border-success/20',
            text: 'text-success',
            icon: CheckCircle,
        },
        warning: {
            bg: 'bg-warning-light/50',
            border: 'border-warning/20',
            text: 'text-warning',
            icon: AlertCircle,
        },
        error: {
            bg: 'bg-destructive/5',
            border: 'border-destructive/20',
            text: 'text-destructive',
            icon: XCircle,
        },
    };

    const { bg, border, text, icon: Icon } = variants[variant];

    return (
        <div
            className={cn(
                'relative w-full rounded-xl border p-4 transition-all duration-base flex items-start gap-3',
                bg,
                border,
                text,
                className
            )}
            role="alert"
        >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
                {title && <h5 className="font-semibold mb-1 leading-none tracking-tight">{title}</h5>}
                <div className="text-sm opacity-90">{children}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

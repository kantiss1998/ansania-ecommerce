'use client';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';

/**
 * Toast component - Self-contained notification
 */
interface ToastItemProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onRemove: (id: string) => void;
}

function ToastItem({ id, type, message, onRemove }: ToastItemProps) {
    const icons = {
        success: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        error: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        warning: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        info: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    };

    const colorStyles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg border p-4 shadow-lg',
                'animate-in slide-in-from-top-5',
                colorStyles[type]
            )}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onRemove(id)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5"
                aria-label="Close"
            >
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}

/**
 * Toast container - Renders all active toasts
 */
export function ToastContainer() {
    const { toasts, removeToast } = useUiStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
}

/**
 * Hook to show toast notifications
 */
export function useToast() {
    const { showToast } = useUiStore();

    return {
        success: (message: string) => showToast('success', message),
        error: (message: string) => showToast('error', message),
        warning: (message: string) => showToast('warning', message),
        info: (message: string) => showToast('info', message),
    };
}

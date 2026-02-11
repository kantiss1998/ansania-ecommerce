import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stack } from '../layout/Stack';

export interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    variant?: 'primary' | 'white' | 'gray';
}

export function Spinner({ size = 'md', className, variant = 'primary' }: SpinnerProps) {
    const sizeStyles = {
        xs: 'h-3.5 w-3.5',
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const variantStyles = {
        primary: 'text-primary',
        white: 'text-white',
        gray: 'text-gray-400',
    };

    return (
        <Loader2
            className={cn(
                'animate-spin',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        />
    );
}

export function LoadingOverlay({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-slow">
            <Stack align="center" spacing={4}>
                <Spinner size="lg" />
                <p className="text-sm font-bold text-gray-700 font-heading tracking-wide uppercase">{text}</p>
            </Stack>
        </div>
    );
}

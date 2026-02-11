'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
    delay?: number;
}

export function Tooltip({
    children,
    content,
    side = 'top',
    className,
    delay = 200,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setIsVisible(false);
    };

    const sideStyles = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    };

    const arrowStyles = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
    };

    const animationProps = {
        top: { initial: { opacity: 0, scale: 0.9, y: 5 }, animate: { opacity: 1, scale: 1, y: 0 } },
        bottom: { initial: { opacity: 0, scale: 0.9, y: -5 }, animate: { opacity: 1, scale: 1, y: 0 } },
        left: { initial: { opacity: 0, scale: 0.9, x: 5 }, animate: { opacity: 1, scale: 1, x: 0 } },
        right: { initial: { opacity: 0, scale: 0.9, x: -5 }, animate: { opacity: 1, scale: 1, x: 0 } },
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={animationProps[side].initial}
                        animate={animationProps[side].animate}
                        exit={animationProps[side].initial}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'absolute z-50 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap pointer-events-none font-heading',
                            sideStyles[side],
                            className
                        )}
                        role="tooltip"
                    >
                        {content}
                        <div className={cn('absolute w-0 h-0 border-4', arrowStyles[side])} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function TooltipProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

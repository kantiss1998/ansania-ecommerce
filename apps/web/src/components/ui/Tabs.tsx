'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tabs props interface
 */
export interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
    className?: string;
}

/**
 * TabsList props interface
 */
export interface TabsListProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'pills' | 'underline';
}

/**
 * TabsTrigger props interface
 */
export interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

/**
 * TabsContent props interface
 */
export interface TabsContentProps {
    value: string;
    children: ReactNode;
    className?: string;
}

/**
 * Tabs context
 */
interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
    variant?: 'default' | 'pills' | 'underline';
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within Tabs');
    }
    return context;
}

/**
 * Tabs component - Container for tab navigation
 */
export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    className,
}: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    );
}

/**
 * TabsList component - Container for tab triggers
 */
export function TabsList({
    children,
    className,
    variant = 'default',
}: TabsListProps) {
    const variantStyles = {
        default: 'bg-gray-100 p-1 rounded-xl',
        pills: 'gap-2',
        underline: 'border-b border-gray-200',
    };

    return (
        <TabsContext.Provider value={{ ...useTabsContext(), variant }}>
            <div
                className={cn(
                    'inline-flex items-center justify-start',
                    variantStyles[variant],
                    className
                )}
                role="tablist"
            >
                {children}
            </div>
        </TabsContext.Provider>
    );
}

/**
 * TabsTrigger component - Individual tab button
 */
export function TabsTrigger({
    value: triggerValue,
    children,
    className,
    disabled = false,
}: TabsTriggerProps) {
    const { value, onValueChange, variant = 'default' } = useTabsContext();
    const isActive = value === triggerValue;

    const variantStyles = {
        default: cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
        ),
        pills: cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            isActive
                ? 'bg-gradient-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ),
        underline: cn(
            'px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-[2px]',
            isActive
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        ),
    };

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            disabled={disabled}
            className={cn(
                variantStyles[variant],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            onClick={() => !disabled && onValueChange(triggerValue)}
        >
            {children}
        </button>
    );
}

/**
 * TabsContent component - Content for each tab
 */
export function TabsContent({
    value: contentValue,
    children,
    className,
}: TabsContentProps) {
    const { value } = useTabsContext();

    if (value !== contentValue) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            className={cn('mt-4 animate-fade-in', className)}
        >
            {children}
        </div>
    );
}

// Re-export React for context
import * as React from 'react';

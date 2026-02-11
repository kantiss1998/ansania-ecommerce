'use client';

import { ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Accordion props interface
 */
export interface AccordionProps {
    type?: 'single' | 'multiple';
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    children: ReactNode;
    className?: string;
    collapsible?: boolean;
}

/**
 * AccordionItem props interface
 */
export interface AccordionItemProps {
    value: string;
    children: ReactNode;
    className?: string;
}

/**
 * AccordionTrigger props interface
 */
export interface AccordionTriggerProps {
    children: ReactNode;
    className?: string;
}

/**
 * AccordionContent props interface
 */
export interface AccordionContentProps {
    children: ReactNode;
    className?: string;
}

/**
 * Accordion context
 */
interface AccordionContextValue {
    openItems: string[];
    toggleItem: (value: string) => void;
    type: 'single' | 'multiple';
}

interface AccordionItemContextValue {
    value: string;
    isOpen: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined);

function useAccordionContext() {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within Accordion');
    }
    return context;
}

function useAccordionItemContext() {
    const context = React.useContext(AccordionItemContext);
    if (!context) {
        throw new Error('AccordionTrigger and AccordionContent must be used within AccordionItem');
    }
    return context;
}

/**
 * Accordion component - Collapsible content sections
 */
export function Accordion({
    type = 'single',
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    className,
    collapsible = true,
}: AccordionProps) {
    const [internalValue, setInternalValue] = useState<string[]>(() => {
        if (defaultValue) {
            return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
        }
        return [];
    });

    const openItems = controlledValue !== undefined
        ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
        : internalValue;

    const toggleItem = (value: string) => {
        let newValue: string[];

        if (type === 'single') {
            // For single type, only one item can be open
            if (openItems.includes(value) && collapsible) {
                newValue = [];
            } else {
                newValue = [value];
            }
        } else {
            // For multiple type, toggle the item
            if (openItems.includes(value)) {
                newValue = openItems.filter(item => item !== value);
            } else {
                newValue = [...openItems, value];
            }
        }

        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }

        if (onValueChange) {
            onValueChange(type === 'single' ? newValue[0] || '' : newValue);
        }
    };

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
            <div className={cn('w-full space-y-2', className)}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

/**
 * AccordionItem component - Individual accordion item
 */
export function AccordionItem({
    value,
    children,
    className,
}: AccordionItemProps) {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.includes(value);

    return (
        <AccordionItemContext.Provider value={{ value, isOpen }}>
            <div
                className={cn(
                    'border border-gray-200 rounded-xl overflow-hidden transition-all duration-200',
                    isOpen && 'bg-gray-50/50',
                    className
                )}
            >
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
}

/**
 * AccordionTrigger component - Clickable header
 */
export function AccordionTrigger({
    children,
    className,
}: AccordionTriggerProps) {
    const { toggleItem } = useAccordionContext();
    const { value, isOpen } = useAccordionItemContext();

    return (
        <button
            type="button"
            className={cn(
                'flex w-full items-center justify-between p-4 text-left font-medium transition-all duration-200',
                'hover:bg-gray-50',
                isOpen && 'text-primary-600',
                className
            )}
            onClick={() => toggleItem(value)}
        >
            <span className="flex-1">{children}</span>
            <ChevronDown
                className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )}
            />
        </button>
    );
}

/**
 * AccordionContent component - Collapsible content
 */
export function AccordionContent({
    children,
    className,
}: AccordionContentProps) {
    const { isOpen } = useAccordionItemContext();

    return (
        <div
            className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            )}
        >
            <div className={cn('p-4 pt-0 text-gray-600', className)}>
                {children}
            </div>
        </div>
    );
}

// Re-export React for context

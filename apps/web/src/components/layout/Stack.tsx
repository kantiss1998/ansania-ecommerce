import React from 'react';
import { cn } from '@/lib/utils';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col';
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: boolean;
}

export const Stack = ({
    children,
    className,
    direction = 'col',
    spacing = 4,
    align,
    justify,
    wrap = false,
    ...props
}: StackProps) => {
    return (
        <div
            className={cn(
                'flex',
                direction === 'row' ? 'flex-row' : 'flex-col',
                spacing === 0 ? 'gap-0' : `gap-${spacing}`,
                align && `items-${align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align}`,
                justify && `justify-${justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify}`,
                wrap && 'flex-wrap',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

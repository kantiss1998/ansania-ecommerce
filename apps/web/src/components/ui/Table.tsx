import { ReactNode, HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
    children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn("w-full text-left text-sm text-gray-600", className)} {...props}>
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead className={cn("bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500", className)} {...props}>
            {children}
        </thead>
    );
}

export function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody className={cn("divide-y divide-gray-200 bg-white", className)} {...props}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, className, onClick, ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "border-b border-gray-100 transition-colors hover:bg-gray-50/80 last:border-0",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </tr>
    );
}

export function TableHead({ children, className, colSpan, rowSpan, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn("px-6 py-4 font-semibold text-gray-900", className)}
            colSpan={colSpan}
            rowSpan={rowSpan}
            {...props}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className, colSpan, rowSpan, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn("px-6 py-4 whitespace-nowrap", className)}
            colSpan={colSpan}
            rowSpan={rowSpan}
            {...props}
        >
            {children}
        </td>
    );
}

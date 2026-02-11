'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center text-sm text-gray-400', className)}
        >
            <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                    <Link
                        href="/"
                        className="flex items-center p-1.5 hover:text-primary transition-all rounded-lg hover:bg-gray-100"
                        aria-label="Home"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="px-2 py-1 rounded-lg hover:text-gray-900 transition-all font-medium hover:bg-gray-100"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="px-2 py-1 font-bold text-gray-900 font-heading" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

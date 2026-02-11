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
            className={cn('flex items-center text-sm text-gray-500', className)}
        >
            <ol className="flex flex-wrap items-center gap-2">
                <li>
                    <Link
                        href="/"
                        className="flex items-center p-1 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all"
                        aria-label="Home"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-primary-600 transition-colors font-medium hover:underline decoration-primary-300 underline-offset-4"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-semibold text-gray-900" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

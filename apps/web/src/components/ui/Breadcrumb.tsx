'use client';

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
            className={cn('mb-4 text-sm text-gray-600', className)}
        >
            <ol className="flex flex-wrap items-center">
                <li>
                    <Link
                        href="/"
                        className="flex items-center hover:text-primary-700 transition-colors"
                    >
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <span className="mx-2 text-gray-400">/</span>
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-primary-700 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-gray-900" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

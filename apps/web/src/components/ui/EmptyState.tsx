'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

export function EmptyState({
    title = 'Data tidak ditemukan',
    description = 'Maaf, kami tidak dapat menemukan apa yang Anda cari.',
    actionLabel = 'Kembali ke Beranda',
    actionHref = '/',
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6 text-gray-400">
                {icon ? (
                    icon
                ) : (
                    <svg
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                )}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
            <p className="mb-6 max-w-sm text-gray-600">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="primary" size="md">
                        {actionLabel}
                    </Button>
                </Link>
            )}
        </div>
    );
}

'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { SearchX } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-4 rounded-full bg-gray-50 p-6 text-gray-400 ring-8 ring-gray-50/50">
                {icon ? (
                    icon
                ) : (
                    <SearchX className="h-12 w-12 text-gray-300" />
                )}
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 font-heading">{title}</h2>
            <p className="mb-8 max-w-sm text-gray-500 leading-relaxed">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="primary" size="lg" className="rounded-full px-8 shadow-lg shadow-primary-200">
                        {actionLabel}
                    </Button>
                </Link>
            )}
        </div>
    );
}

'use client';

import { CMSPage } from '@repo/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { adminCmsService } from '@/services/adminCmsService';

interface PagesClientProps {
    initialData: CMSPage[];
}

function PagesContent({ initialData }: PagesClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus halaman ini?')) return;

        setIsDeleting(id);
        try {
            await adminCmsService.deletePage(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete page:', error);
            alert('Gagal menghapus halaman');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pages Management</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Atur halaman statis dan SEO konten
                    </p>
                </div>
                <Link href="/admin/cms/pages/create">
                    <Button variant="primary">
                        + Buat Halaman
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>URL Slug</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length > 0 ? (
                            initialData.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{page.title}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{(page as any).meta_title || (page as any).metadata?.meta_title || ''}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                                            /{page.slug}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(page.updated_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {page.is_published ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                                Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/cms/pages/${page.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-error-600 hover:bg-error-50"
                                                isLoading={isDeleting === page.id}
                                                onClick={() => handleDelete(page.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                                    Belum ada halaman.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function PagesClient({ initialData }: PagesClientProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PagesContent initialData={initialData} />
        </Suspense>
    );
}

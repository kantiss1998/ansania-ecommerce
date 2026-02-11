'use client';

import { CMSPage } from '@repo/shared';
import Link from 'next/link';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface AdminPagesClientProps {
    initialData: CMSPage[] | null;
}

function AdminPagesContent({ initialData }: AdminPagesClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Halaman Statis (CMS)</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola konten halaman statis seperti About Us, Terms, dan Policy
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/pages/create">
                        <Button variant="primary" size="md">
                            Buat Halaman
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul Halaman</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Terakhir Update</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData && initialData.length > 0 ? (
                            initialData.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium text-gray-900">
                                        {page.title}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">/{page.slug}</code>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(page.updated_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={page.is_published ? 'success' : 'default'}>
                                            {page.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/pages/${page.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm">Preview</Button>
                                            </a>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                                    {initialData ? 'Tidak ada halaman ditemukan' : 'Gagal memuat data halaman'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function AdminPagesClient({ initialData }: AdminPagesClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat halaman CMS...</div>}>
            <AdminPagesContent initialData={initialData} />
        </Suspense>
    );
}

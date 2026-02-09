'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Category, PaginatedResponse } from '@repo/shared';
import Link from 'next/link';

interface AdminCategoriesClientProps {
    initialData: PaginatedResponse<Category> | null;
}

function AdminCategoriesContent({ initialData }: AdminCategoriesClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Kategori</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola kategori produk dan pengelompokan
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/categories/create">
                        <Button variant="primary" size="md">
                            Tambah Kategori
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium text-gray-900">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                                    <TableCell>{(category as any).products_count || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.is_active ? 'success' : 'default'}>
                                            {category.is_active ? 'Aktif' : 'Non-aktif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/categories/${category.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                                    {initialData ? 'Tidak ada kategori ditemukan' : 'Gagal memuat data kategori'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function AdminCategoriesClient({ initialData }: AdminCategoriesClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat kategori...</div>}>
            <AdminCategoriesContent initialData={initialData} />
        </Suspense>
    );
}

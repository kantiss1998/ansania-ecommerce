'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';
import { Product, PaginatedResponse } from '@repo/shared';
import Link from 'next/link';

interface AdminProductsClientProps {
    initialData: PaginatedResponse<Product> | null;
}

function AdminProductsContent({ initialData }: AdminProductsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/admin/products?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Produk</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola katalog produk, stok, dan harga
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/sync">
                        <Button variant="outline" size="md">
                            Sync Odoo
                        </Button>
                    </Link>
                    <Link href="/admin/products/create">
                        <Button variant="primary" size="md">
                            Tambah Produk
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                    <Input
                        label="Cari Produk"
                        type="text"
                        placeholder="Nama produk atau SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="mt-8">
                        <Button onClick={handleSearch} variant="secondary">Cari</Button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Foto</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Status Stok</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.slug}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{(product as any).category?.name || 'Uncategorized'}</span>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {formatCurrency(product.selling_price)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                product.stock_status === 'in_stock' ? 'success' :
                                                    product.stock_status === 'out_of_stock' ? 'error' :
                                                        'warning'
                                            }
                                        >
                                            {product.stock_status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary-600">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    {initialData ? 'Tidak ada produk ditemukan' : 'Gagal memuat data produk'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {initialData?.pagination && initialData.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
                        <p className="text-sm text-gray-700">
                            Menampilkan halaman <span className="font-medium">{initialData.pagination.page}</span> dari <span className="font-medium">{initialData.pagination.totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={initialData.pagination.page <= 1}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (initialData.pagination.page - 1).toString());
                                    router.push(`/admin/products?${params.toString()}`);
                                }}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={initialData.pagination.page >= initialData.pagination.totalPages}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (initialData.pagination.page + 1).toString());
                                    router.push(`/admin/products?${params.toString()}`);
                                }}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminProductsClient({ initialData }: AdminProductsClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat katalog produk...</div>}>
            <AdminProductsContent initialData={initialData} />
        </Suspense>
    );
}

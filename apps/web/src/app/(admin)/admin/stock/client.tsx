'use client';

import { StockItem, PaginatedResponse } from '@repo/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { getAccessToken } from '@/lib/auth';

interface AdminStockClientProps {
    initialData: PaginatedResponse<StockItem> | null;
}

function AdminStockContent({ initialData }: AdminStockClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/admin/stock?${params.toString()}`);
    };

    const handleFilterType = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type) {
            params.set('type', type);
        } else {
            params.delete('type');
        }
        params.set('page', '1');
        router.push(`/admin/stock?${params.toString()}`);
    };

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stock/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Sinkronisasi stok berhasil dimulai di background.');
                router.refresh();
            } else {
                alert('Gagal memulai sinkronisasi stok.');
            }
        } catch (error) {
            console.error('Sync error:', error);
            alert('Terjadi kesalahan saat sinkronisasi.');
        } finally {
            setIsSyncing(false);
        }
    };

    const currentType = searchParams.get('type') || '';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Stok (Inventori)</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Pantau level stok produk yang sinkron dengan Odoo
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        {isSyncing ? 'Sinkronisasi...' : 'Sinkron dari Odoo'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 flex gap-2">
                    <Input
                        label="Cari SKU atau Nama"
                        type="text"
                        placeholder="Contoh: ANS-001..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="mt-8">
                        <Button onClick={handleSearch} variant="secondary">Cari</Button>
                    </div>
                </div>
                <div className="w-full sm:w-64">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Filter Kondisi</label>
                    <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-50">
                        <button
                            onClick={() => handleFilterType('')}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${!currentType ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilterType('low_stock')}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${currentType === 'low_stock' ? 'bg-white text-warning-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Menipis
                        </button>
                        <button
                            onClick={() => handleFilterType('out_of_stock')}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${currentType === 'out_of_stock' ? 'bg-white text-error-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Habis
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Produk & Varian</TableHead>
                            <TableHead className="text-right">Stok</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Terakhir Sinkron</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs font-medium text-gray-900">
                                        {item.sku}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <div className="flex gap-2 text-xs text-gray-500">
                                                {item.color && <span>Warna: {item.color}</span>}
                                                {item.size && <span>Ukuran: {item.size}</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-gray-900">
                                        {item.stock}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.stock <= 0 ? 'error' :
                                                    item.stock <= 5 ? 'warning' :
                                                        'success'
                                            }
                                        >
                                            {item.stock <= 0 ? 'Habis' :
                                                item.stock <= 5 ? 'Menipis' :
                                                    'Tersedia'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">
                                        {new Date(item.last_sync_at).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="sm" className="text-primary-600">
                                            Log Stok
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    {initialData ? 'Tidak ada data stok ditemukan' : 'Gagal memuat data stok'}
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
                                    router.push(`/admin/stock?${params.toString()}`);
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
                                    router.push(`/admin/stock?${params.toString()}`);
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

export default function AdminStockClient({ initialData }: AdminStockClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat data inventori...</div>}>
            <AdminStockContent initialData={initialData} />
        </Suspense>
    );
}

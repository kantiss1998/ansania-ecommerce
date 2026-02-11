'use client';

import { Order, PaginatedResponse } from '@repo/shared';
import { ORDER_STATUS } from '@repo/shared/constants';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency } from '@/lib/utils';


interface AdminOrdersClientProps {
    initialData: PaginatedResponse<Order> | null;
}

function AdminOrdersContent({ initialData }: AdminOrdersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/admin/orders?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        params.set('page', '1');
        router.push(`/admin/orders?${params.toString()}`);
        setStatusFilter(status);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PAID:
            case ORDER_STATUS.DELIVERED:
                return 'success';
            case ORDER_STATUS.PENDING_PAYMENT:
                return 'warning';
            case ORDER_STATUS.SHIPPED:
            case ORDER_STATUS.PROCESSING:
                return 'info';
            case ORDER_STATUS.CANCELLED:
            case ORDER_STATUS.FAILED:
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PAID: return 'Dibayar';
            case ORDER_STATUS.PENDING_PAYMENT: return 'Belum Dibayar';
            case ORDER_STATUS.PROCESSING: return 'Diproses';
            case ORDER_STATUS.SHIPPED: return 'Dikirim';
            case ORDER_STATUS.DELIVERED: return 'Selesai';
            case ORDER_STATUS.CANCELLED: return 'Dibatalkan';
            case ORDER_STATUS.REFUNDED: return 'Dikembalikan';
            case ORDER_STATUS.FAILED: return 'Gagal';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pesanan</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola pesanan masuk dari pelanggan
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="md">
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <div className="flex gap-2">
                        <Input
                            label="Cari Pesanan"
                            type="text"
                            placeholder="Nomor order atau nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <div className="mt-8">
                            <Button onClick={handleSearch} variant="primary">Cari</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-48">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Filter Status</label>
                    <select
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value={ORDER_STATUS.PENDING_PAYMENT}>Belum Dibayar</option>
                        <option value={ORDER_STATUS.PAID}>Dibayar</option>
                        <option value={ORDER_STATUS.PROCESSING}>Diproses</option>
                        <option value={ORDER_STATUS.SHIPPED}>Dikirim</option>
                        <option value={ORDER_STATUS.DELIVERED}>Selesai</option>
                        <option value={ORDER_STATUS.CANCELLED}>Dibatalkan</option>
                        <option value={ORDER_STATUS.REFUNDED}>Dikembalikan</option>
                        <option value={ORDER_STATUS.FAILED}>Gagal</option>
                    </select>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No. Order</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((order) => (
                                <TableRow key={order.order_number}>
                                    <TableCell className="font-medium text-gray-900">
                                        {order.order_number}
                                    </TableCell>
                                    <TableCell>{(order as any).user?.full_name || 'Pelanggan'}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{(order as any).items_count || '-'}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/admin/orders/${order.order_number}`}>
                                            <Button variant="outline" size="sm">
                                                Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                                    {initialData ? 'Tidak ada pesanan ditemukan' : 'Gagal memuat data pesanan'}
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
                                    router.push(`/admin/orders?${params.toString()}`);
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
                                    router.push(`/admin/orders?${params.toString()}`);
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

export default function AdminOrdersClient({ initialData }: AdminOrdersClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center">Memuat pesanan...</div>}>
            <AdminOrdersContent initialData={initialData} />
        </Suspense>
    );
}

'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FlashSale, flashSaleService } from '@/services/flashSaleService';

interface AdminFlashSalesClientProps {
    initialData: { items: FlashSale[]; meta: any };
}

function FlashSalesContent({ initialData }: AdminFlashSalesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus flash sale ini?')) return;

        setIsDeleting(id);
        try {
            await flashSaleService.deleteFlashSale(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete flash sale:', error);
            alert('Gagal menghapus flash sale');
        } finally {
            setIsDeleting(null);
        }
    };

    const StatusBadge = ({ start, end, active }: { start: string; end: string; active: boolean }) => {
        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (!active) return <Badge variant="default">Non-aktif</Badge>;
        if (now < startDate) return <Badge variant="warning">Akan Datang</Badge>;
        if (now > endDate) return <Badge variant="error">Berakhir</Badge>;
        return <Badge variant="success">Berlangsung</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Flash Sales</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola event flash sale dan produk promo
                    </p>
                </div>
                <Link href="/admin/flash-sales/create">
                    <Button variant="primary">
                        + Buat Flash Sale
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Event</TableHead>
                            <TableHead>Periode</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.items && initialData.items.length > 0 ? (
                            initialData.items.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-gray-900">{sale.name}</p>
                                            <p className="text-xs text-gray-500 max-w-[200px] truncate">{sale.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-gray-600">
                                            <p>{new Date(sale.start_date).toLocaleString('id-ID')}</p>
                                            <p className="text-gray-400">s/d</p>
                                            <p>{new Date(sale.end_date).toLocaleString('id-ID')}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{sale.products?.length || 0} Item</span>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            start={sale.start_date}
                                            end={sale.end_date}
                                            active={sale.is_active}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/flash-sales/${sale.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-error-600 hover:bg-error-50"
                                                isLoading={isDeleting === sale.id}
                                                onClick={() => handleDelete(sale.id)}
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
                                    Belum ada flash sale yang dibuat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4">
                {initialData.meta && (
                    <Pagination
                        currentPage={initialData.meta.page}
                        totalPages={initialData.meta.totalPages}
                        onPageChange={(page) => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', page.toString());
                            router.push(`/admin/flash-sales?${params.toString()}`);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default function AdminFlashSalesClient({ initialData }: AdminFlashSalesClientProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlashSalesContent initialData={initialData} />
        </Suspense>
    );
}

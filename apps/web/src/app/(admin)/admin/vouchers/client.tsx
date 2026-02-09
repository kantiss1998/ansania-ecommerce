'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Voucher, adminVoucherService } from '@/services/adminVoucherService';

interface AdminVouchersClientProps {
    initialData: { items: Voucher[]; meta: any };
}

function VouchersContent({ initialData }: AdminVouchersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;

        setIsDeleting(id);
        try {
            await adminVoucherService.deleteVoucher(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete voucher:', error);
            alert('Gagal menghapus voucher');
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
        if (now > endDate) return <Badge variant="error">Kadaluarsa</Badge>;
        return <Badge variant="success">Aktif</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Voucher & Kupon</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola kode promo dan diskon untuk pelanggan
                    </p>
                </div>
                <Link href="/admin/vouchers/create">
                    <Button variant="primary">
                        + Buat Voucher
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode</TableHead>
                            <TableHead>Tipe Diskon</TableHead>
                            <TableHead>Periode</TableHead>
                            <TableHead>Penggunaan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.items.length > 0 ? (
                            initialData.items.map((voucher) => (
                                <TableRow key={voucher.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-gray-900">{voucher.code}</p>
                                            <p className="text-xs text-gray-500 max-w-[200px] truncate">{voucher.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {voucher.discount_type === 'percent' ? (
                                                <span className="font-medium text-primary-700">{voucher.discount_amount}% OFF</span>
                                            ) : (
                                                <span className="font-medium text-primary-700">Rp {voucher.discount_amount.toLocaleString('id-ID')} OFF</span>
                                            )}
                                            {(voucher.min_purchase || 0) > 0 && (
                                                <p className="text-xs text-gray-500">Min. Blj: Rp {voucher.min_purchase?.toLocaleString('id-ID')}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-gray-600">
                                            <p>{new Date(voucher.start_date).toLocaleDateString('id-ID')}</p>
                                            <p className="text-gray-400">s/d</p>
                                            <p>{new Date(voucher.end_date).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="font-medium">{voucher.usage_count}</span>
                                            <span className="text-gray-500"> / {voucher.usage_limit || '∞'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            start={voucher.start_date}
                                            end={voucher.end_date}
                                            active={voucher.is_active}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/vouchers/${voucher.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-error-600 hover:bg-error-50"
                                                isLoading={isDeleting === voucher.id}
                                                onClick={() => handleDelete(voucher.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Belum ada voucher yang dibuat.
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
                            router.push(`/admin/vouchers?${params.toString()}`);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default function AdminVouchersClient({ initialData }: AdminVouchersClientProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VouchersContent initialData={initialData} />
        </Suspense>
    );
}

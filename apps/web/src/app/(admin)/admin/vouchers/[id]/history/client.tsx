'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface VoucherUsage {
    id: number;
    order_id: number;
    order_number: string;
    user_id: number;
    customer_name: string;
    customer_email: string;
    discount_amount: number;
    order_total: number;
    used_at: string;
}

interface AdminVoucherHistoryClientProps {
    voucherId: number;
}

export default function AdminVoucherHistoryClient({ voucherId }: AdminVoucherHistoryClientProps) {
    const [history, setHistory] = useState<VoucherUsage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchVoucherHistory();
    }, [voucherId, page]);

    const fetchVoucherHistory = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: { items: VoucherUsage[]; total_pages: number } }>(
                `/admin/vouchers/${voucherId}/history?page=${page}&limit=20`
            );
            setHistory(response.data.data.items || []);
            setTotalPages(response.data.data.total_pages || 1);
        } catch (error) {
            console.error('Failed to fetch voucher history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalDiscount = history.reduce((sum, item) => sum + item.discount_amount, 0);
    const totalRevenue = history.reduce((sum, item) => sum + item.order_total, 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <Link href={`/admin/vouchers/${voucherId}`} className="text-gray-400 hover:text-gray-900">
                            ← Back
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-900">Voucher Usage History</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        Riwayat penggunaan voucher
                    </p>
                </div>
                <Link href={`/admin/vouchers/${voucherId}/stats`}>
                    <Button variant="outline">
                        View Stats
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Discount (This Page)</p>
                    <p className="mt-2 text-3xl font-bold text-error-600">
                        Rp {totalDiscount.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Revenue (This Page)</p>
                    <p className="mt-2 text-3xl font-bold text-success-600">
                        Rp {totalRevenue.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Discount Amount</TableHead>
                            <TableHead>Order Total</TableHead>
                            <TableHead>Used At</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? (
                            history.map((usage) => (
                                <TableRow key={usage.id}>
                                    <TableCell>
                                        <Link
                                            href={`/admin/orders/${usage.order_id}`}
                                            className="font-mono text-primary-600 hover:underline"
                                        >
                                            #{usage.order_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{usage.customer_name}</p>
                                            <p className="text-xs text-gray-500">{usage.customer_email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-error-600">
                                            -Rp {usage.discount_amount.toLocaleString('id-ID')}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        Rp {usage.order_total.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(usage.used_at).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Link href={`/admin/orders/${usage.order_id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Order
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Belum ada riwayat penggunaan voucher.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

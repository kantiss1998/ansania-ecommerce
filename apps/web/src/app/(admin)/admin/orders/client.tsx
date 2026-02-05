'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

function AdminOrdersContent() {
    const mockOrders = [
        {
            id: 1,
            number: 'ORD-123456',
            customer: 'John Doe',
            date: '2026-02-03',
            total: 1250000,
            status: 'paid',
            items: 2,
        },
        {
            id: 2,
            number: 'ORD-123457',
            customer: 'Jane Smith',
            date: '2026-02-03',
            total: 450000,
            status: 'pending_payment',
            items: 1,
        },
        {
            id: 3,
            number: 'ORD-123458',
            customer: 'Bob Johnson',
            date: '2026-02-02',
            total: 3200000,
            status: 'shipped',
            items: 4,
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return 'success';
            case 'pending_payment':
                return 'warning';
            case 'shipped':
            case 'processing':
                return 'info';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Dibayar';
            case 'pending_payment': return 'Belum Dibayar';
            case 'processing': return 'Diproses';
            case 'shipped': return 'Dikirim';
            case 'delivered': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pesanan</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola pesanan masuk
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="md">
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label=""
                        type="text"
                        placeholder="Cari nomor order atau nama pelanggan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">No. Order</th>
                                <th className="px-6 py-3">Pelanggan</th>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {order.number}
                                    </td>
                                    <td className="px-6 py-4">{order.customer}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">{order.items}</td>
                                    <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button variant="outline" size="sm">
                                            Proses
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function AdminOrdersClient() {
    return (
        <Suspense fallback={<div>Loading orders...</div>}>
            <AdminOrdersContent />
        </Suspense>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface DailySalesData {
    date: string;
    total_orders: number;
    total_revenue: number;
    total_items: number;
}

export default function AdminDailySalesClient() {
    const [data, setData] = useState<DailySalesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchDailySales();
    }, [dateRange]);

    const fetchDailySales = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: DailySalesData[] }>(
                `/admin/reports/sales/daily?start_date=${dateRange.start}&end_date=${dateRange.end}`
            );
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch daily sales:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0);

    const handleExport = () => {
        // Simple CSV export
        const csv = [
            ['Tanggal', 'Total Order', 'Total Revenue', 'Total Items'].join(','),
            ...data.map(row => [
                row.date,
                row.total_orders,
                row.total_revenue,
                row.total_items
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-sales-${dateRange.start}-to-${dateRange.end}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Daily Sales Report</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Laporan penjualan harian
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        📥 Export CSV
                    </Button>
                </div>

                <div className="mt-4 flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="mt-1 rounded-lg border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="mt-1 rounded-lg border border-gray-300 p-2"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        Rp {totalRevenue.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {totalOrders.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Total Order</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Total Items</TableHead>
                            <TableHead>Avg Order Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">
                                        {new Date(row.date).toLocaleDateString('id-ID', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{row.total_orders}</TableCell>
                                    <TableCell>Rp {row.total_revenue.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{row.total_items}</TableCell>
                                    <TableCell>
                                        Rp {row.total_orders > 0
                                            ? (row.total_revenue / row.total_orders).toLocaleString('id-ID', { maximumFractionDigits: 0 })
                                            : 0
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                                    Tidak ada data penjualan untuk periode ini.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

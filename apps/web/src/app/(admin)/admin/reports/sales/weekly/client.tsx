'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface WeeklySalesData {
    week_start: string;
    week_end: string;
    total_orders: number;
    total_revenue: number;
    total_items: number;
}

export default function AdminWeeklySalesClient() {
    const [data, setData] = useState<WeeklySalesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [weeks, setWeeks] = useState(12);

    useEffect(() => {
        fetchWeeklySales();
    }, [weeks]);

    const fetchWeeklySales = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: WeeklySalesData[] }>(
                `/admin/reports/sales/weekly?weeks=${weeks}`
            );
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch weekly sales:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0);

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
                        <h2 className="text-xl font-semibold text-gray-900">Weekly Sales Report</h2>
                        <p className="mt-1 text-sm text-gray-600">Laporan penjualan mingguan</p>
                    </div>
                    <select
                        value={weeks}
                        onChange={(e) => setWeeks(Number(e.target.value))}
                        className="rounded-lg border border-gray-300 p-2"
                    >
                        <option value={4}>Last 4 Weeks</option>
                        <option value={8}>Last 8 Weeks</option>
                        <option value={12}>Last 12 Weeks</option>
                        <option value={26}>Last 26 Weeks</option>
                    </select>
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
                            <TableHead>Week Period</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Avg Order Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">
                                        {new Date(row.week_start).toLocaleDateString('id-ID')} - {new Date(row.week_end).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>{row.total_orders}</TableCell>
                                    <TableCell>Rp {row.total_revenue.toLocaleString('id-ID')}</TableCell>
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
                                <TableCell colSpan={4} className="py-12 text-center text-gray-500">
                                    Tidak ada data penjualan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

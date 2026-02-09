'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface YearlySalesData {
    year: number;
    total_orders: number;
    total_revenue: number;
    total_items: number;
    total_customers: number;
}

export default function AdminYearlySalesClient() {
    const [data, setData] = useState<YearlySalesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchYearlySales();
    }, []);

    const fetchYearlySales = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: YearlySalesData[] }>('/admin/reports/sales/yearly');
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch yearly sales:', error);
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
                <h2 className="text-xl font-semibold text-gray-900">Yearly Sales Report</h2>
                <p className="mt-1 text-sm text-gray-600">Laporan penjualan tahunan</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">All-Time Revenue</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        Rp {totalRevenue.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">All-Time Orders</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {totalOrders.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Total Customers</TableHead>
                            <TableHead>Avg Order Value</TableHead>
                            <TableHead>YoY Growth</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => {
                                const prevYear = idx > 0 ? data[idx - 1] : null;
                                const yoyGrowth = prevYear
                                    ? ((row.total_revenue - prevYear.total_revenue) / prevYear.total_revenue) * 100
                                    : 0;

                                return (
                                    <TableRow key={row.year}>
                                        <TableCell className="font-bold text-lg">{row.year}</TableCell>
                                        <TableCell>{row.total_orders.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>Rp {row.total_revenue.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{row.total_customers.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            Rp {row.total_orders > 0
                                                ? (row.total_revenue / row.total_orders).toLocaleString('id-ID', { maximumFractionDigits: 0 })
                                                : 0
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {idx > 0 && (
                                                <span className={`font-semibold ${yoyGrowth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                                                    {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
                                                </span>
                                            )}
                                            {idx === 0 && <span className="text-gray-400">-</span>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
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

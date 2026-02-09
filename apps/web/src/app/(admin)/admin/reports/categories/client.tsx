'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface CategoryReport {
    category_id: number;
    category_name: string;
    total_products: number;
    total_sold: number;
    total_revenue: number;
    avg_price: number;
}

export default function AdminCategoryReportClient() {
    const [data, setData] = useState<CategoryReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'30days' | '90days' | 'all'>('30days');

    useEffect(() => {
        fetchCategoryReport();
    }, [period]);

    const fetchCategoryReport = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: CategoryReport[] }>(
                `/admin/reports/categories?period=${period}`
            );
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch category report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
    const totalSold = data.reduce((sum, item) => sum + item.total_sold, 0);

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
                        <h2 className="text-xl font-semibold text-gray-900">Category Performance Report</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Performa penjualan berdasarkan kategori produk
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === '30days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('30days')}
                        >
                            30 Hari
                        </Button>
                        <Button
                            variant={period === '90days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('90days')}
                        >
                            90 Hari
                        </Button>
                        <Button
                            variant={period === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('all')}
                        >
                            Semua
                        </Button>
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
                    <p className="text-sm text-gray-600">Total Items Sold</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {totalSold.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Total Products</TableHead>
                            <TableHead>Total Sold</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Avg Price</TableHead>
                            <TableHead>Revenue Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((category) => {
                                const revenueShare = totalRevenue > 0
                                    ? (category.total_revenue / totalRevenue) * 100
                                    : 0;

                                return (
                                    <TableRow key={category.category_id}>
                                        <TableCell className="font-medium text-gray-900">
                                            {category.category_name}
                                        </TableCell>
                                        <TableCell>{category.total_products}</TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-primary-600">
                                                {category.total_sold}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            Rp {category.total_revenue.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            Rp {category.avg_price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className="h-2 rounded-full bg-primary-600"
                                                            style={{ width: `${revenueShare}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {revenueShare.toFixed(1)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Tidak ada data kategori.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface CustomerGrowthData {
    period: string;
    new_customers: number;
    total_customers: number;
    growth_rate: number;
}

export default function AdminCustomerGrowthClient() {
    const [data, setData] = useState<CustomerGrowthData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'monthly'>('monthly');

    useEffect(() => {
        fetchCustomerGrowth();
    }, [period]);

    const fetchCustomerGrowth = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: CustomerGrowthData[] }>(
                `/admin/reports/customers/growth?period=${period}`
            );
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch customer growth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalNewCustomers = data.reduce((sum, item) => sum + item.new_customers, 0);
    const latestTotal = data.length > 0 ? data[data.length - 1].total_customers : 0;

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
                        <h2 className="text-xl font-semibold text-gray-900">Customer Growth Report</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Pertumbuhan pelanggan baru
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === 'daily' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('daily')}
                        >
                            Daily
                        </Button>
                        <Button
                            variant={period === 'monthly' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('monthly')}
                        >
                            Monthly
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">New Customers</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {totalNewCustomers.toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">in selected period</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {latestTotal.toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">current total</p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>New Customers</TableHead>
                            <TableHead>Total Customers</TableHead>
                            <TableHead>Growth Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{row.period}</TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-success-600">
                                            +{row.new_customers}
                                        </span>
                                    </TableCell>
                                    <TableCell>{row.total_customers.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <span className={`font-medium ${row.growth_rate >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                                            {row.growth_rate >= 0 ? '+' : ''}{row.growth_rate.toFixed(2)}%
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="py-12 text-center text-gray-500">
                                    Tidak ada data pertumbuhan pelanggan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

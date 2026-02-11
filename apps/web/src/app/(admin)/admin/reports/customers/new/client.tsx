'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface NewCustomer {
    user_id: number;
    full_name: string;
    email: string;
    phone?: string;
    registered_at: string;
    first_order_date?: string;
    total_orders: number;
    total_spent: number;
}

export default function AdminNewCustomersClient() {
    const [customers, setCustomers] = useState<NewCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days');

    useEffect(() => {
        fetchNewCustomers();
    }, [period]);

    const fetchNewCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: NewCustomer[] }>(
                `/admin/reports/customers/new?period=${period}`
            );
            setCustomers(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch new customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const customersWithOrders = customers.filter(c => c.total_orders > 0).length;
    const conversionRate = customers.length > 0 ? (customersWithOrders / customers.length) * 100 : 0;

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
                        <h2 className="text-xl font-semibold text-gray-900">New Customers</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Pelanggan baru yang mendaftar
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === '7days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('7days')}
                        >
                            7 Hari
                        </Button>
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
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">New Registrations</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {customers.length}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Made First Purchase</p>
                    <p className="mt-2 text-3xl font-bold text-success-600">
                        {customersWithOrders}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="mt-2 text-3xl font-bold text-primary-600">
                        {conversionRate.toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead>First Order</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <TableRow key={customer.user_id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{customer.full_name}</p>
                                            <p className="text-xs text-gray-500">{customer.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(customer.registered_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {customer.first_order_date
                                            ? new Date(customer.first_order_date).toLocaleDateString('id-ID')
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell>{customer.total_orders}</TableCell>
                                    <TableCell>
                                        Rp {customer.total_spent.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        {customer.total_orders > 0 ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="warning">No Purchase</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Link href={`/admin/customers/${customer.user_id}`}>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                    Tidak ada pelanggan baru.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

'use client';

import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

function AdminDashboardContent() {
    const stats = [
        {
            title: 'Total Pesanan',
            value: '156',
            change: '+12%',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
        {
            title: 'Pendapatan',
            value: 'Rp 45.2 jt',
            change: '+8%',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Produk Aktif',
            value: '48',
            change: '+2',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-info-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            title: 'Pelanggan Baru',
            value: '24',
            change: '+5%',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
    ];

    const recentOrders = [
        { id: 101, number: 'ORD-123456', user: 'John Doe', amount: 1250000, status: 'paid', date: '2026-02-03' },
        { id: 102, number: 'ORD-123457', user: 'Jane Smith', amount: 450000, status: 'pending', date: '2026-02-03' },
        { id: 103, number: 'ORD-123458', user: 'Bob Johnson', amount: 3200000, status: 'shipped', date: '2026-02-02' },
        { id: 104, number: 'ORD-123459', user: 'Alice Brown', amount: 150000, status: 'delivered', date: '2026-02-01' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="rounded-full bg-gray-50 p-2">{stat.icon}</div>
                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Pesanan Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Pelanggan</th>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.number}</td>
                                    <td className="px-6 py-4">{order.user}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.status === 'paid' ? 'bg-success-100 text-success-800' :
                                            order.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                                                order.status === 'shipped' ? 'bg-info-100 text-info-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(order.amount)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary-600 hover:underline">
                                            Detail
                                        </Link>
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

export default function AdminDashboardClient() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}

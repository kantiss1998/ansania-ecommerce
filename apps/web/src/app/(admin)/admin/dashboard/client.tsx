'use client';

import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { DashboardStats } from '@repo/shared';

interface AdminDashboardClientProps {
    initialStats: DashboardStats | null;
}

function AdminDashboardContent({ stats }: { stats: DashboardStats | null }) {
    if (!stats) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white">
                <div className="text-center">
                    <p className="text-gray-500">Gagal memuat statistik dashboard.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.overview.totalSales),
            change: '+8%', // Mock change for now
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'Total Pesanan',
            value: stats.overview.totalOrders.toString(),
            change: '+12%',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
        },
        {
            title: 'Rata-rata Order',
            value: formatCurrency(stats.overview.avgOrderValue),
            change: '+2%',
            trend: 'up',
            icon: (
                <svg className="h-6 w-6 text-info-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            title: 'Stok Menipis',
            value: stats.inventory.lowStockCount.toString(),
            change: stats.inventory.outOfStockCount > 0 ? `${stats.inventory.outOfStockCount} Habis` : 'Aman',
            trend: stats.inventory.lowStockCount > 5 ? 'down' : 'up',
            icon: (
                <svg className="h-6 w-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-hover hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="rounded-full bg-gray-50 p-2">{stat.icon}</div>
                            <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-tight">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Pesanan Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-3">No. Order</th>
                                <th className="px-6 py-3">Pelanggan</th>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {stats.activity.recentOrders.length > 0 ? (
                                stats.activity.recentOrders.map((order) => (
                                    <tr key={order.order_number} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                                        <td className="px-6 py-4">{(order as any).user?.full_name || 'Pelanggan'}</td>
                                        <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'paid' || order.status === 'delivered' ? 'bg-success-50 text-success-700 border border-success-100' :
                                                    order.status === 'pending_payment' ? 'bg-warning-50 text-warning-700 border border-warning-100' :
                                                        'bg-gray-50 text-gray-700 border border-gray-100'
                                                }`}>
                                                {order.status === 'paid' ? 'Dibayar' :
                                                    order.status === 'pending_payment' ? 'Menunggu Pembayaran' :
                                                        order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={`/admin/orders/${order.order_number}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Tidak ada pesanan terbaru
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardClient({ initialStats }: AdminDashboardClientProps) {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center">Memuat dashboard...</div>}>
            <AdminDashboardContent stats={initialStats} />
        </Suspense>
    );
}

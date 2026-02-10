'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Heart,
    MapPin,
    User,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { orderService, Order } from '@/services/orderService';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
    totalOrders: number;
    pendingPayment: number;
    processing: number;
    delivered: number;
}

/**
 * Dashboard overview content
 */
export function DashboardContent() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingPayment: 0,
        processing: 0,
        delivered: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch recent orders
                const ordersResponse = await orderService.getOrders({ limit: 5 });
                setRecentOrders(ordersResponse.items);

                // Calculate stats from orders
                const allOrders = ordersResponse.items;
                setStats({
                    totalOrders: allOrders.length,
                    pendingPayment: allOrders.filter((o) => o.status === 'pending_payment').length,
                    processing: allOrders.filter((o) => o.status === 'processing').length,
                    delivered: allOrders.filter((o) => o.status === 'delivered').length,
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsCards = [
        {
            title: 'Total Pesanan',
            value: stats.totalOrders,
            icon: ShoppingBag,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            iconBg: 'from-blue-100 to-cyan-100',
        },
        {
            title: 'Belum Bayar',
            value: stats.pendingPayment,
            icon: Clock,
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50',
            iconBg: 'from-orange-100 to-amber-100',
        },
        {
            title: 'Diproses',
            value: stats.processing,
            icon: Package,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            iconBg: 'from-purple-100 to-pink-100',
        },
        {
            title: 'Selesai',
            value: stats.delivered,
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            iconBg: 'from-green-100 to-emerald-100',
        },
    ];

    const quickActions = [
        {
            title: 'Lacak Pesanan',
            description: 'Cek status pengiriman',
            icon: Truck,
            href: '/user/orders',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Wishlist',
            description: 'Lihat produk favorit',
            icon: Heart,
            href: '/user/wishlist',
            gradient: 'from-pink-500 to-rose-500',
        },
        {
            title: 'Alamat',
            description: 'Kelola alamat pengiriman',
            icon: MapPin,
            href: '/user/addresses',
            gradient: 'from-purple-500 to-indigo-500',
        },
        {
            title: 'Profil',
            description: 'Edit informasi akun',
            icon: User,
            href: '/user/profile',
            gradient: 'from-green-500 to-teal-500',
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            pending_payment: { label: 'Belum Bayar', className: 'bg-orange-100 text-orange-700' },
            processing: { label: 'Diproses', className: 'bg-blue-100 text-blue-700' },
            shipped: { label: 'Dikirim', className: 'bg-purple-100 text-purple-700' },
            delivered: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
            cancelled: { label: 'Dibatalkan', className: 'bg-gray-100 text-gray-700' },
        };

        const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-700">Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
                    Selamat Datang Kembali!
                </h1>
                <p className="mt-2 text-gray-600">Kelola pesanan dan akun Anda dengan mudah</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg"
                    >
                        {/* Decorative blur */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl opacity-30`}></div>

                        <div className="relative">
                            <div className={`inline-flex rounded-xl bg-gradient-to-br ${stat.iconBg} p-3 shadow-md`}>
                                <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Aksi Cepat
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => (
                        <Link key={action.title} href={action.href}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                                <div className="relative">
                                    <div className={`inline-flex rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-gray-900">{action.title}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Pesanan Terbaru
                        </h2>
                    </div>
                    <Link href="/user/orders">
                        <Button variant="ghost" size="sm">
                            Lihat Semua
                        </Button>
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Belum ada pesanan</p>
                        <p className="mt-1 text-xs text-gray-500">Pesanan Anda akan muncul di sini</p>
                        <Link href="/products">
                            <Button variant="gradient" size="sm" className="mt-4">
                                Mulai Belanja
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-gray-100 bg-white shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {order.order_number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                                    {formatCurrency(order.total_amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={`/user/orders/${order.order_number}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

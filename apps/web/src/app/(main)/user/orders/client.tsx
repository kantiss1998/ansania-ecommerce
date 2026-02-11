'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import { OrderCard } from '@/components/features/dashboard/OrderCard';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { orderService, Order } from '@/services/orderService';
import { ORDER_STATUS } from '@repo/shared/constants';

function OrdersContent() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { error } = useToast();

    const tabs = [
        { key: 'all' as const, label: 'Semua', gradient: 'from-gray-500 to-gray-600' },
        { key: ORDER_STATUS.PENDING_PAYMENT, label: 'Belum Bayar', gradient: 'from-orange-500 to-amber-500' },
        { key: ORDER_STATUS.PROCESSING, label: 'Diproses', gradient: 'from-blue-500 to-cyan-500' },
        { key: ORDER_STATUS.SHIPPED, label: 'Dikirim', gradient: 'from-purple-500 to-pink-500' },
        { key: ORDER_STATUS.DELIVERED, label: 'Selesai', gradient: 'from-green-500 to-emerald-500' },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const params = activeTab !== 'all' ? { status: activeTab } : {};
                const response = await orderService.getOrders({ ...params, limit: 50 });
                setOrders(response.items);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                error('Gagal memuat pesanan');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [activeTab]);

    // Filter orders by search query
    const filteredOrders = orders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg"
            >
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-700">Riwayat Pesanan</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
                    Pesanan Saya
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Kelola dan lacak pesanan Anda
                </p>

                {/* Search Bar */}
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nomor pesanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    />
                </div>
            </motion.div>

            {/* Enhanced Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-x-auto"
            >
                <div className="flex gap-2 border-b-2 border-gray-100 pb-2">
                    {tabs.map((tab, index) => (
                        <motion.button
                            key={tab.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === tab.key
                                ? 'bg-gradient-to-r ' + tab.gradient + ' text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {activeTab === tab.key && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r"
                                    style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Orders List */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-12 text-center"
                >
                    <div className="inline-flex rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-4 mb-4">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                        {searchQuery ? 'Pesanan Tidak Ditemukan' : 'Belum Ada Pesanan'}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        {searchQuery
                            ? 'Coba kata kunci lain atau hapus filter'
                            : 'Pesanan Anda akan muncul di sini'}
                    </p>
                    {!searchQuery && (
                        <Button
                            variant="gradient"
                            size="md"
                            className="mt-6 shadow-lg"
                            onClick={() => (window.location.href = '/products')}
                        >
                            Mulai Belanja
                        </Button>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    {filteredOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                        >
                            <OrderCard order={order} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default function UserOrdersClient() {
    return (
        <Suspense
            fallback={
                <div className="flex h-96 items-center justify-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                </div>
            }
        >
            <OrdersContent />
        </Suspense>
    );
}

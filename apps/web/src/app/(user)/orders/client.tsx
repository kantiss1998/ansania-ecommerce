'use client';

import { useState, Suspense, useEffect } from 'react';
import { OrderCard } from '@/components/features/dashboard/OrderCard';
import { Button } from '@/components/ui/Button';
import { orderService, Order } from '@/services/orderService';
import { useToast } from '@/components/ui/Toast';

function OrdersContent() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    const tabs = [
        { key: 'all' as const, label: 'Semua' },
        { key: 'pending_payment' as const, label: 'Belum Bayar' },
        { key: 'processing' as const, label: 'Diproses' },
        { key: 'shipped' as const, label: 'Dikirim' },
        { key: 'delivered' as const, label: 'Selesai' },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // If filtering by status is needed, pass it to getOrders
                // API might support 'status' param.
                const params = activeTab !== 'all' ? { status: activeTab } : {};
                const response = await orderService.getOrders({ ...params, limit: 50 });
                // We need to ensure response.items matches OrderCard's Order interface
                // OrderCard expects { total_amount, items[], ... } which matches orderService Order
                setOrders(response.items);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                error('Gagal memuat pesanan');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [activeTab]); // Refetch when tab changes if we want server-side filtering
    // Alternatively fetch all and filter client side if list is small. 
    // Given the initial mock code had client side filtering, but real app should rely on API if possible.
    // Let's assume API filtering for now to be robust.

    // No client-side filter needed if we fetch based on tab
    const filteredOrders = orders;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Pesanan Saya
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Kelola dan lacak pesanan Anda
                </p>
            </div>

            {/* Tabs */}
            <div className="overflow-x-auto">
                <div className="flex gap-2 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.key
                                ? 'border-primary-700 text-primary-700'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    Loading orders...
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-900">
                        Belum Ada Pesanan
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Pesanan Anda akan muncul di sini
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        className="mt-6"
                        onClick={() => window.location.href = '/products'}
                    >
                        Mulai Belanja
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function UserOrdersClient() {
    return (
        <Suspense fallback={<div>Loading orders...</div>}>
            <OrdersContent />
        </Suspense>
    );
}

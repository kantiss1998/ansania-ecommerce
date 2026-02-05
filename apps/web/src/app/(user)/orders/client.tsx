'use client';

import { useState, Suspense } from 'react';
import { OrderCard, Order } from '@/components/features/dashboard/OrderCard';
import { Button } from '@/components/ui/Button';

function OrdersContent() {
    const [activeTab, setActiveTab] = useState<'all' | 'pending_payment' | 'processing' | 'shipped' | 'delivered'>('all');

    // Mock orders - will be replaced with API call
    const mockOrders: Order[] = [
        {
            id: 123,
            order_number: 'ORD-123',
            status: 'pending_payment',
            total: 2450000,
            items_count: 2,
            created_at: '2026-02-03T10:30:00',
        },
        {
            id: 122,
            order_number: 'ORD-122',
            status: 'processing',
            total: 1500000,
            items_count: 1,
            created_at: '2026-02-01T14:20:00',
        },
        {
            id: 121,
            order_number: 'ORD-121',
            status: 'delivered',
            total: 3200000,
            items_count: 3,
            created_at: '2026-01-28T09:15:00',
        },
    ];

    const tabs = [
        { key: 'all' as const, label: 'Semua' },
        { key: 'pending_payment' as const, label: 'Belum Bayar' },
        { key: 'processing' as const, label: 'Diproses' },
        { key: 'shipped' as const, label: 'Dikirim' },
        { key: 'delivered' as const, label: 'Selesai' },
    ];

    const filteredOrders = activeTab === 'all'
        ? mockOrders
        : mockOrders.filter(order => order.status === activeTab);

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
            {filteredOrders.length === 0 ? (
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

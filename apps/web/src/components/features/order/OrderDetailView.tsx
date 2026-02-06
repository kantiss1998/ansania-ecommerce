'use client';

import { Order } from '@/services/orderService';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OrderDetailViewProps {
    order: Order;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
    const statusConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'error' | 'default' }> = {
        pending_payment: { label: 'Menunggu Pembayaran', variant: 'warning' },
        processing: { label: 'Diproses', variant: 'info' },
        shipped: { label: 'Dikirim', variant: 'info' },
        delivered: { label: 'Selesai', variant: 'success' },
        cancelled: { label: 'Dibatalkan', variant: 'error' },
    };

    const config = statusConfig[order.status] || { label: order.status, variant: 'default' };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order {order.order_number}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <Badge variant={config.variant as any}>
                        {config.label}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Order Items */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-semibold text-gray-900">Item Pesanan</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex gap-4 p-6">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">{item.variant_info}</p>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {item.quantity} x {formatCurrency(item.price)}
                                        </div>
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        {formatCurrency(item.subtotal)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Alamat Pengiriman</h3>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{order.shipping_address.recipient_name}</p>
                                <p>{order.shipping_address.phone}</p>
                                <p className="mt-2">{order.shipping_address.address_line}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-gray-900">Rincian Pembayaran</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Metode Pembayaran</span>
                                <span className="font-medium text-gray-900 uppercase">{order.payment_method?.replace('_', ' ')}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    {/* Calculated subtotal usually not passed directly in flat order object unless we sum items or have it. 
                                        Using total_amount - shipping as proxy if needed, or sum items. */}
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency((order.items?.reduce((acc, i) => acc + i.subtotal, 0) || 0))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ongkir</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-700">{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={() => window.location.href = '/contact-us'}>
                            Bantuan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

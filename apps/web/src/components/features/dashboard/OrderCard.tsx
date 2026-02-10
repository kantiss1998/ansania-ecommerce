import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Order } from '@/services/orderService';
import { Package, ChevronRight, Calendar } from 'lucide-react';

export interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const statusConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'error' }> = {
        pending_payment: {
            label: 'Menunggu Pembayaran',
            variant: 'warning',
        },
        processing: {
            label: 'Diproses',
            variant: 'info',
        },
        shipped: {
            label: 'Dikirim',
            variant: 'info',
        },
        delivered: {
            label: 'Selesai',
            variant: 'success',
        },
        cancelled: {
            label: 'Dibatalkan',
            variant: 'error',
        },
    };

    // safely handle status mapping
    const status = order.status || 'pending_payment';
    const config = statusConfig[status] || statusConfig.pending_payment;

    return (
        <Link
            href={`/orders/${order.order_number}`}
            className="group block rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-primary-200"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600">
                                <Package className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {order.order_number}
                            </h3>
                        </div>
                        {/* Ensure variant matches allowed Badge variants */}
                        <Badge variant={config.variant as any} className="shadow-none">
                            {config.label}
                        </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p>
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        {order.items ? order.items.length : 0} item
                    </p>
                    <p className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors font-heading flex items-center gap-1.5">
                        {formatCurrency(order.total_amount)}
                    </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                    Lihat Detail
                    <ChevronRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}

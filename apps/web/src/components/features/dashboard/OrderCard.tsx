import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Order } from '@/services/orderService';

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
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                            {order.order_number}
                        </h3>
                        {/* Ensure variant matches allowed Badge variants */}
                        <Badge variant={config.variant as any}>{config.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                    <p className="text-sm text-gray-600">
                        {order.items ? order.items.length : 0} item
                    </p>
                    <p className="mt-1 text-lg font-bold text-primary-700">
                        {formatCurrency(order.total_amount)}
                    </p>
                </div>
                <div className="text-sm font-medium text-primary-700">
                    Lihat Detail →
                </div>
            </div>
        </Link>
    );
}

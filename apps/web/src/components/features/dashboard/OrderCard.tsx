import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

/**
 * Order data type
 */
export interface Order {
    id: number;
    order_number: string;
    status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items_count: number;
    created_at: string;
}

/**
 * Order card component
 */
export interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const statusConfig = {
        pending_payment: {
            label: 'Menunggu Pembayaran',
            variant: 'warning' as const,
        },
        processing: {
            label: 'Diproses',
            variant: 'info' as const,
        },
        shipped: {
            label: 'Dikirim',
            variant: 'info' as const,
        },
        delivered: {
            label: 'Selesai',
            variant: 'success' as const,
        },
        cancelled: {
            label: 'Dibatalkan',
            variant: 'error' as const,
        },
    };

    const config = statusConfig[order.status];

    return (
        <Link
            href={`/orders/${order.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                            {order.order_number}
                        </h3>
                        <Badge variant={config.variant}>{config.label}</Badge>
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
                        {order.items_count} item
                    </p>
                    <p className="mt-1 text-lg font-bold text-primary-700">
                        {formatCurrency(order.total)}
                    </p>
                </div>
                <div className="text-sm font-medium text-primary-700">
                    Lihat Detail →
                </div>
            </div>
        </Link>
    );
}

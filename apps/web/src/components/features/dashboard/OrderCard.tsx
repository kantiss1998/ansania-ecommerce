import { Package, ChevronRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/services/orderService';
import { ORDER_STATUS } from '@repo/shared/constants';

export interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const statusConfig: Record<
        string,
        { label: string; variant: 'warning' | 'info' | 'success' | 'error'; gradient: string; bgGradient: string }
    > = {
        [ORDER_STATUS.PENDING_PAYMENT]: {
            label: 'Belum Bayar',
            variant: 'warning',
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50',
        },
        [ORDER_STATUS.PROCESSING]: {
            label: 'Diproses',
            variant: 'info',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
        },
        [ORDER_STATUS.SHIPPED]: {
            label: 'Dikirim',
            variant: 'info',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
        },
        [ORDER_STATUS.DELIVERED]: {
            label: 'Selesai',
            variant: 'success',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
        },
        [ORDER_STATUS.CANCELLED]: {
            label: 'Dibatalkan',
            variant: 'error',
            gradient: 'from-red-500 to-rose-500',
            bgGradient: 'from-red-50 to-rose-50',
        },
        [ORDER_STATUS.REFUNDED]: {
            label: 'Dikembalikan',
            variant: 'info',
            gradient: 'from-gray-500 to-slate-500',
            bgGradient: 'from-gray-50 to-slate-50',
        },
        [ORDER_STATUS.FAILED]: {
            label: 'Gagal',
            variant: 'error',
            gradient: 'from-red-600 to-rose-600',
            bgGradient: 'from-red-100 to-rose-100',
        },
    };

    const status = order.status || ORDER_STATUS.PENDING_PAYMENT;
    const config = statusConfig[status] || statusConfig[ORDER_STATUS.PENDING_PAYMENT]!;

    return (
        <Link href={`/user/orders/${order.order_number}`}>
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary-200"
            >
                {/* Decorative blur */}
                <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.bgGradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
                ></div>

                <div className="relative">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`inline-flex rounded-xl bg-gradient-to-br ${config.bgGradient} p-2 shadow-md`}
                                    >
                                        <Package className={`h-5 w-5 bg-gradient-to-r ${config.gradient} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                        {order.order_number}
                                    </h3>
                                </div>
                                <Badge variant={config.variant as any} className="shadow-sm">
                                    {config.label}
                                </Badge>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <p>
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <p>
                                        {new Date(order.created_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t-2 border-gray-100 pt-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5" />
                                {order.items ? order.items.length : 0} item
                            </p>
                            <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent font-heading">
                                {formatCurrency(order.total_amount)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 text-sm font-semibold text-primary-600 group-hover:from-primary-100 group-hover:to-purple-100 group-hover:translate-x-1 transition-all shadow-sm">
                            Lihat Detail
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

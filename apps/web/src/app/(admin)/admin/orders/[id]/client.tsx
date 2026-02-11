'use client';

import { Order } from '@repo/shared';
import { ORDER_STATUS } from '@repo/shared/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { getAccessToken } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';


interface AdminOrderDetailClientProps {
    order: Order;
}

export default function AdminOrderDetailClient({ order }: AdminOrderDetailClientProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState(order.total_amount.toString());
    const [refundReason, setRefundReason] = useState('');
    const [isProcessingRefund, setIsProcessingRefund] = useState(false);

    const updateStatus = async (status: string) => {
        try {
            setIsUpdating(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders/${order.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Gagal mengupdate status pesanan.');
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Terjadi kesalahan.');
        } finally {
            setIsUpdating(false);
        }
    };

    const processRefund = async () => {
        if (!refundReason.trim()) {
            alert('Mohon masukkan alasan refund');
            return;
        }

        try {
            setIsProcessingRefund(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders/${order.id}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(refundAmount),
                    reason: refundReason,
                }),
            });

            if (response.ok) {
                alert('Refund berhasil diproses');
                setShowRefundModal(false);
                router.refresh();
            } else {
                const error = await response.json();
                alert(error.message || 'Gagal memproses refund');
            }
        } catch (error) {
            console.error('Refund error:', error);
            alert('Terjadi kesalahan saat memproses refund');
        } finally {
            setIsProcessingRefund(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, any> = {
            [ORDER_STATUS.PENDING_PAYMENT]: 'warning',
            [ORDER_STATUS.PAID]: 'success',
            [ORDER_STATUS.PROCESSING]: 'info',
            [ORDER_STATUS.SHIPPED]: 'info',
            [ORDER_STATUS.DELIVERED]: 'success',
            [ORDER_STATUS.CANCELLED]: 'error',
            [ORDER_STATUS.REFUNDED]: 'default',
            [ORDER_STATUS.FAILED]: 'error',
        };
        return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-900 transition-colors">
                            ← Back
                        </Link>
                        <h2 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h2>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(order.status === ORDER_STATUS.PENDING_PAYMENT) && (
                        <Button variant="primary" size="sm" onClick={() => updateStatus(ORDER_STATUS.PAID)} isLoading={isUpdating}>
                            Konfirmasi Pembayaran
                        </Button>
                    )}
                    {order.status === ORDER_STATUS.PAID && (
                        <Button variant="primary" size="sm" onClick={() => updateStatus(ORDER_STATUS.PROCESSING)} isLoading={isUpdating}>
                            Proses Pesanan
                        </Button>
                    )}
                    {order.status === ORDER_STATUS.PROCESSING && (
                        <Button variant="primary" size="sm" onClick={() => updateStatus(ORDER_STATUS.SHIPPED)} isLoading={isUpdating}>
                            Masukkan Resi / Kirim
                        </Button>
                    )}
                    {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                        <Button variant="ghost" size="sm" className="text-error-600 hover:bg-error-50" onClick={() => updateStatus(ORDER_STATUS.CANCELLED)} isLoading={isUpdating}>
                            Batalkan
                        </Button>
                    )}
                    {(order.status === ORDER_STATUS.PAID || order.status === ORDER_STATUS.PROCESSING || order.status === ORDER_STATUS.DELIVERED) && (
                        <Button variant="outline" size="sm" onClick={() => setShowRefundModal(true)}>
                            💰 Process Refund
                        </Button>
                    )}
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Refund</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Refund Amount
                                </label>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                    max={order.total_amount}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Max: Rp {order.total_amount.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Refund Reason
                                </label>
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                    rows={3}
                                    placeholder="Jelaskan alasan refund..."
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRefundModal(false)}
                                    disabled={isProcessingRefund}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={processRefund}
                                    isLoading={isProcessingRefund}
                                >
                                    Process Refund
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="font-semibold text-gray-900">Item Pesanan</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produk</TableHead>
                                    <TableHead className="text-center">Jumlah</TableHead>
                                    <TableHead className="text-right">Harga</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.product?.image || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    className="h-10 w-10 rounded object-cover border border-gray-100"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    <p className="text-xs text-gray-500 italic">SKU: {item.sku || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                        <TableCell className="text-right font-semibold text-gray-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="bg-gray-50 p-6">
                            <div className="space-y-2 max-w-xs ml-auto">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.total_amount - order.shipping_cost + (order.voucher_discount || 0))}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping ({order.shipping_method})</span>
                                    <span>{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                {order.voucher_discount > 0 && (
                                    <div className="flex justify-between text-sm text-success-600 font-medium">
                                        <span>Voucher Discount</span>
                                        <span>-{formatCurrency(order.voucher_discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History / Internal Notes */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">Catatan Operasional</h3>
                        <div className="space-y-4">
                            <textarea
                                className="w-full rounded-lg border-gray-200 text-sm p-3 border focus:ring-primary-500 focus:border-primary-500"
                                rows={3}
                                placeholder="Tambah catatan internal (hanya untuk admin)..."
                            ></textarea>
                            <Button variant="outline" size="sm">Simpan Catatan</Button>
                        </div>
                    </div>
                </div>

                {/* Customer & Shipping Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Informasi Pelanggan</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500 font-medium uppercase text-[10px] tracking-wider">Nama</p>
                                <p className="text-gray-900 font-semibold">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium uppercase text-[10px] tracking-wider">Email</p>
                                <p className="text-gray-900">{order.customer_email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium uppercase text-[10px] tracking-wider">Telepon</p>
                                <p className="text-gray-900">{order.customer_phone || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm border-l-4 border-l-secondary-500">
                        <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Alamat Pengiriman</h3>
                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p className="font-bold text-gray-900 mb-1">{order.shipping_address?.full_name}</p>
                            <p>{order.shipping_address?.phone}</p>
                            <p className="mt-2">
                                {order.shipping_address?.address_line1}<br />
                                {order.shipping_address?.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Metode Pembayaran</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {order.payment_method?.toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{order.payment_method}</p>
                                <p className="text-[10px] text-gray-500">Transaction ID: {order.payment_transaction_id || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

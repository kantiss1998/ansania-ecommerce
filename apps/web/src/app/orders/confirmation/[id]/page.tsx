'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { orderService, Order } from '@/services/orderService';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderNumber = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(3600); // 1 hour for VA / payment deadline simulation

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrder(orderNumber);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Gagal memuat data pesanan.');
            } finally {
                setLoading(false);
            }
        };

        if (orderNumber) {
            fetchOrder();
        }
    }, [orderNumber]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Disalin ke clipboard!'); // Simple feedback
    };

    if (loading) {
        return <div className="container mx-auto p-12 text-center text-gray-500">Memuat status pesanan...</div>;
    }

    if (error || !order) {
        return (
            <div className="container mx-auto p-12 text-center">
                <div className="rounded-2xl border-2 border-dashed border-error-200 bg-error-50 p-8">
                    <h2 className="text-xl font-bold text-error-700">Terjadi Kesalahan</h2>
                    <p className="mt-2 text-gray-600">{error || 'Pesanan tidak ditemukan.'}</p>
                    <Link href="/">
                        <Button variant="primary" className="mt-6">Kembali ke Beranda</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Mock VA Number if not present in order data (since backend might not generate it yet)
    const vaNumber = '8277081234567890';

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Success Header */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-50 ring-8 ring-success-50/50">
                    <svg
                        className="h-12 w-12 text-success-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Pesanan Berhasil Dibuat!
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Terima kasih telah berbelanja di Ansania.
                </p>
                <div className="mt-4 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-800">
                    Order ID: {order.order_number}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Payment Instruction Card */}
                    {order.status === 'pending_payment' && (
                        <>
                            <div className="rounded-2xl border border-warning-200 bg-warning-50 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-warning-100 p-2 text-warning-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">Selesaikan Pembayaran</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Mohon lakukan pembayaran sebelum batas waktu berakhir agar pesanan tidak dibatalkan otomatis.
                                        </p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="text-3xl font-bold text-warning-700 font-mono tracking-tight">
                                                {formatTime(countdown)}
                                            </div>
                                            <span className="text-sm font-medium text-warning-600/80">Sisa Waktu</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                                <h3 className="mb-6 text-xl font-bold text-gray-900">Intruksi Pembayaran</h3>

                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                                        <span className="text-gray-500">Metode Pembayaran</span>
                                        <span className="font-bold text-gray-900 text-lg">{order.payment_method?.toUpperCase().replace('_', ' ') || 'BANK TRANSFER'}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                                        <span className="text-gray-500">Nomor Virtual Account</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xl font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">{vaNumber}</span>
                                            <button
                                                onClick={() => copyToClipboard(vaNumber)}
                                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                            >
                                                Salin
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <span className="text-gray-500">Total Tagihan</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-primary-700">{formatCurrency(order.total_amount)}</span>
                                            <button
                                                onClick={() => copyToClipboard(order.total_amount.toString())}
                                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                            >
                                                Salin
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-xl bg-blue-50 p-6">
                                    <h4 className="font-bold text-blue-900 mb-4">Langkah Pembayaran (M-Banking)</h4>
                                    <ol className="space-y-3 text-sm text-blue-800 list-decimal list-inside">
                                        <li>Buka aplikasi Mobile Banking Anda</li>
                                        <li>Pilih menu <strong>m-Transfer</strong> atau <strong>Transfer</strong></li>
                                        <li>Pilih <strong>BCA Virtual Account</strong></li>
                                        <li>Masukkan nomor Virtual Account: <strong>{vaNumber}</strong></li>
                                        <li>Pastikan detail tagihan sudah benar</li>
                                        <li>Masukkan PIN m-BCA Anda</li>
                                        <li>Pembayaran Selesai! Simpan bukti transaksi Anda.</li>
                                    </ol>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-bold text-gray-900">Ringkasan Pesanan</h3>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                        {/* Mock image since API might not return it in items yet */}
                                        <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                                            <img src="/placeholder-product.svg" className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 line-clamp-2 text-sm">{item.product_name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.variant_info || 'Standard'}</p>
                                            <div className="mt-2 flex justify-between items-center text-xs">
                                                <span className="text-gray-500">Qty: {item.quantity}</span>
                                                <span className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatCurrency((order.total_amount - order.shipping_cost))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ongkos Kirim</span>
                                    <span className="font-medium">{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100 text-base">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-primary-700">{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link href="/">
                                <Button variant="outline" fullWidth>Ke Beranda</Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="ghost" fullWidth className="text-gray-500 hover:text-primary-600">Beli Lagi</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

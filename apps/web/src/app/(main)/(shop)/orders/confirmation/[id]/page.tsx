'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Copy, Home, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { orderService, Order } from '@/services/orderService';
import { ORDER_STATUS } from '@repo/shared/constants';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderNumber = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(3600); // 1 hour for VA / payment deadline simulation
    const [copied, setCopied] = useState('');

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

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                    <p className="mt-4 text-sm font-medium text-gray-600">Memuat status pesanan...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="rounded-2xl border-2 border-dashed border-error-200 bg-error-50 p-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
                            <svg className="h-8 w-8 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-error-700">Terjadi Kesalahan</h2>
                        <p className="mt-2 text-gray-600">{error || 'Pesanan tidak ditemukan.'}</p>
                        <Link href="/">
                            <Button variant="primary" className="mt-6">Kembali ke Beranda</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Mock VA Number if not present in order data
    const vaNumber = '8277081234567890';

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
            <div className="container mx-auto px-4 py-12">
                {/* Enhanced Success Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex flex-col items-center text-center"
                >
                    {/* Animated Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="relative mb-6"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-success-400 to-emerald-500 blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success-50 to-emerald-50 ring-8 ring-success-50/50 shadow-lg">
                            <CheckCircle className="h-12 w-12 text-success-600" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-success-800 to-gray-900 bg-clip-text text-transparent font-heading"
                    >
                        Pesanan Berhasil Dibuat!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2 text-lg text-gray-600"
                    >
                        Terima kasih telah berbelanja di Ansania.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 shadow-sm"
                    >
                        <Sparkles className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">Order ID: {order.order_number}</span>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Enhanced Payment Instruction Card */}
                        {order.status === ORDER_STATUS.PENDING_PAYMENT && (
                            <>
                                <div className="relative overflow-hidden rounded-2xl border-2 border-warning-200 bg-gradient-to-br from-warning-50 to-orange-50 p-6 shadow-lg">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning-200 to-orange-200 rounded-full blur-3xl opacity-20"></div>
                                    <div className="relative flex items-start gap-4">
                                        <div className="rounded-full bg-gradient-to-br from-warning-100 to-orange-100 p-3 text-warning-600 shadow-md">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-warning-800 bg-clip-text text-transparent">Selesaikan Pembayaran</h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Mohon lakukan pembayaran sebelum batas waktu berakhir agar pesanan tidak dibatalkan otomatis.
                                            </p>
                                            <div className="mt-4 flex items-center gap-3">
                                                <div className="text-3xl font-bold bg-gradient-to-r from-warning-600 to-orange-600 bg-clip-text text-transparent font-mono tracking-tight">
                                                    {formatTime(countdown)}
                                                </div>
                                                <span className="text-sm font-medium text-warning-600/80">Sisa Waktu</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border-2 border-gray-100 bg-white p-8 shadow-lg">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles className="h-5 w-5 text-primary-600" />
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Instruksi Pembayaran</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-100 pb-6">
                                            <span className="text-gray-500 font-medium">Metode Pembayaran</span>
                                            <span className="font-bold text-gray-900 text-lg">{order.payment_method?.toUpperCase().replace('_', ' ') || 'BANK TRANSFER'}</span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-100 pb-6">
                                            <span className="text-gray-500 font-medium">Nomor Virtual Account</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent px-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-50">{vaNumber}</span>
                                                <button
                                                    onClick={() => copyToClipboard(vaNumber, 'va')}
                                                    className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-primary-600 hover:bg-primary-100 font-medium text-sm transition-all"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    {copied === 'va' ? 'Tersalin!' : 'Salin'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <span className="text-gray-500 font-medium">Total Tagihan</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{formatCurrency(order.total_amount)}</span>
                                                <button
                                                    onClick={() => copyToClipboard(order.total_amount.toString(), 'amount')}
                                                    className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-primary-600 hover:bg-primary-100 font-medium text-sm transition-all"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    {copied === 'amount' ? 'Tersalin!' : 'Salin'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-blue-100">
                                        <h4 className="font-bold bg-gradient-to-r from-blue-900 to-cyan-900 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-blue-600" />
                                            Langkah Pembayaran (M-Banking)
                                        </h4>
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="h-5 w-5 text-primary-600" />
                                    <h3 className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Ringkasan Pesanan</h3>
                                </div>
                                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {order.items?.map((item, index) => (
                                        <div key={index} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                            <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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

                                <div className="mt-6 space-y-3 pt-6 border-t-2 border-gray-100 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency((order.total_amount - order.shipping_cost))}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span className="font-medium">{formatCurrency(order.shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t-2 border-gray-100 text-base">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/">
                                    <Button variant="gradient" fullWidth className="shadow-lg">
                                        <Home className="mr-2 h-4 w-4" />
                                        Ke Beranda
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button variant="outline" fullWidth className="border-2">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Beli Lagi
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

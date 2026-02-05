'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

/**
 * Order confirmation page
 */
export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [countdown, setCountdown] = useState(3600); // 1 hour in seconds

    // Mock order data - will be replaced with API call
    const mockOrder = {
        id: orderId,
        order_number: `ORD-${orderId}`,
        status: 'pending_payment',
        total: 2450000,
        payment_method: 'BCA Virtual Account',
        va_number: '8277012345678901',
        payment_deadline: new Date(Date.now() + 3600000), // 1 hour from now
        items: [
            {
                product_name: 'Kursi Minimalis Modern',
                variant_info: 'Putih, Medium, Glossy',
                quantity: 2,
                subtotal: 2400000,
            },
        ],
    };

    // Countdown timer
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
        // Show toast notification
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Success Icon */}
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-light">
                    <svg
                        className="h-10 w-10 text-success-DEFAULT"
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
                <h1 className="text-2xl font-bold text-gray-900">
                    Pesanan Berhasil Dibuat!
                </h1>
                <p className="mt-2 text-gray-600">
                    Nomor Pesanan: <span className="font-semibold">{mockOrder.order_number}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Payment Instructions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Countdown */}
                    <div className="rounded-lg border-2 border-warning-DEFAULT bg-warning-light p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="h-6 w-6 flex-shrink-0 text-warning-DEFAULT"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    Segera Selesaikan Pembayaran
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    Batas waktu pembayaran dalam
                                </p>
                                <p className="mt-2 text-2xl font-bold text-warning-DEFAULT">
                                    {formatTime(countdown)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Detail Pembayaran
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Metode Pembayaran</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {mockOrder.payment_method}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Nomor Virtual Account</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <p className="flex-1 rounded-lg bg-gray-100 p-3 font-mono text-lg font-bold text-gray-900">
                                        {mockOrder.va_number}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(mockOrder.va_number)}
                                    >
                                        Salin
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Total Pembayaran</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <p className="flex-1 rounded-lg bg-primary-50 p-3 text-xl font-bold text-primary-700">
                                        {formatCurrency(mockOrder.total)}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(mockOrder.total.toString())}
                                    >
                                        Salin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Cara Pembayaran
                        </h2>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                                    1
                                </div>
                                <p className="text-sm text-gray-700">
                                    Buka aplikasi BCA Mobile atau m-BCA
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                                    2
                                </div>
                                <p className="text-sm text-gray-700">
                                    Pilih menu <span className="font-semibold">Transfer</span> → <span className="font-semibold">Virtual Account</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                                    3
                                </div>
                                <p className="text-sm text-gray-700">
                                    Masukkan nomor Virtual Account <span className="font-mono font-semibold">{mockOrder.va_number}</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                                    4
                                </div>
                                <p className="text-sm text-gray-700">
                                    Pastikan detail pembayaran sudah benar, lalu konfirmasi
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                                    5
                                </div>
                                <p className="text-sm text-gray-700">
                                    Pembayaran selesai! Pesanan akan diproses otomatis
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Detail Pesanan
                        </h3>

                        <div className="space-y-3 border-b border-gray-200 pb-4">
                            {mockOrder.items.map((item, index) => (
                                <div key={index}>
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.product_name}
                                    </p>
                                    {item.variant_info && (
                                        <p className="text-xs text-gray-500">
                                            {item.variant_info}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-600">
                                        Qty: {item.quantity} × {formatCurrency(item.subtotal / item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total</span>
                                <span className="font-bold text-primary-700">
                                    {formatCurrency(mockOrder.total)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <Link href={`/orders/${orderId}`} className="block">
                                <Button variant="primary" size="md" fullWidth>
                                    Lihat Detail Pesanan
                                </Button>
                            </Link>
                            <Link href="/products" className="block">
                                <Button variant="outline" size="md" fullWidth>
                                    Lanjut Belanja
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

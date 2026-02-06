'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';

interface FlashSaleProps {
    products: Product[];
    endTime?: Date;
}

export function FlashSale({ products, endTime }: FlashSaleProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        // Default to 24h from now if not provided
        const targetDate = endTime || new Date(new Date().setHours(24, 0, 0, 0));

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference > 0) {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    if (!products || products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="my-12 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold uppercase text-red-600">Flash Sale</h2>
                    <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                        <span className="rounded bg-gray-900 px-2 py-1 text-white">{formatTime(timeLeft.hours)}</span>
                        <span>:</span>
                        <span className="rounded bg-gray-900 px-2 py-1 text-white">{formatTime(timeLeft.minutes)}</span>
                        <span>:</span>
                        <span className="rounded bg-gray-900 px-2 py-1 text-white">{formatTime(timeLeft.seconds)}</span>
                    </div>
                </div>
                <Link href="/products?hasDiscount=true" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Lihat Semua &rarr;
                </Link>
            </div>

            <div className="relative -mx-6 overflow-x-auto px-6 pb-4 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
                <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((product) => {
                        const discountPercentage = product.base_price && product.discount_price
                            ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
                            : 0;

                        return (
                            <div key={product.id} className="min-w-[160px] flex-shrink-0 rounded-lg border border-gray-100 bg-white p-3 hover:shadow-md sm:min-w-0">
                                <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
                                    <img
                                        src={product.thumbnail_url || product.images?.[0] || '/placeholder-image.jpg'}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    {discountPercentage > 0 && (
                                        <span className="absolute right-0 top-0 rounded-bl-lg bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                            -{discountPercentage}%
                                        </span>
                                    )}
                                </div>
                                <h3 className="mb-1 truncate text-sm font-medium text-gray-900">
                                    <Link href={`/products/${product.slug}`}>
                                        {product.name}
                                    </Link>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary-700">{formatCurrency(product.discount_price || product.base_price)}</span>
                                </div>
                                {product.discount_price && (
                                    <div className="text-xs text-gray-500 line-through">{formatCurrency(product.base_price)}</div>
                                )}

                                {/* Progress bar (Mocked for now as we don't have sold count yet) */}
                                <div className="mt-3">
                                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div className="absolute left-0 top-0 h-full w-[80%] bg-red-500"></div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Tersedia: {product.stock_status === 'in_stock' ? 'Ada' : 'Habis'}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

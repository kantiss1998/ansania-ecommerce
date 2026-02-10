'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

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

    if (!products || products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="my-12 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl text-white relative">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <Zap className="h-64 w-64 text-white" />
            </div>

            <div className="relative z-10 mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-3 shadow-lg shadow-red-500/30">
                        <Zap className="h-8 w-8 text-white fill-white animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold uppercase tracking-wider text-white font-heading">Flash Sale</h2>
                        <p className="text-gray-400 font-medium">Harga spesial untuk waktu terbatas</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="text-right hidden md:block border-r border-white/10 pr-4 mr-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-red-400">Berakhir Dalam</p>
                        <p className="text-[10px] text-gray-400">Segera dapatkan promonya</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <TimeBox value={timeLeft.hours} label="Jam" />
                        <span className="text-2xl font-bold text-gray-600 pb-4">:</span>
                        <TimeBox value={timeLeft.minutes} label="Menit" />
                        <span className="text-2xl font-bold text-gray-600 pb-4">:</span>
                        <TimeBox value={timeLeft.seconds} label="Detik" />
                    </div>
                </div>

                <Link href="/products?hasDiscount=true" className="hidden md:block">
                    <button className="rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-900 transition-all hover:scale-105 active:scale-95 hover:bg-gray-100 shadow-lg shadow-white/10">
                        Lihat Semua
                    </button>
                </Link>
            </div>

            <div className="relative z-10 -mx-8 overflow-x-auto px-8 pb-4 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    {products.map((product) => {
                        const discountPercentage = product.base_price && product.discount_price
                            ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
                            : 0;

                        return (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -5 }}
                                className="group w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white text-gray-900 shadow-lg transition-shadow hover:shadow-2xl hover:shadow-white/10"
                            >
                                <Link href={`/products/${product.slug}`}>
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={product.thumbnail_url || product.images?.[0]?.image_url || '/placeholder-image.jpg'}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 192px, 192px"
                                        />
                                        {discountPercentage > 0 && (
                                            <span className="absolute top-2 right-2 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-red-600/30">
                                                -{discountPercentage}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 truncate text-sm font-bold text-gray-900 group-hover:text-red-500 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-red-600 text-lg">{formatCurrency(product.discount_price || product.base_price)}</span>
                                        </div>
                                        {product.discount_price && (
                                            <div className="text-xs text-gray-400 line-through font-medium">{formatCurrency(product.base_price)}</div>
                                        )}

                                        {/* Progress bar */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5 font-medium">
                                                <span>Segera Habis</span>
                                                <span className="font-bold text-red-500">80%</span>
                                            </div>
                                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div className="absolute left-0 top-0 h-full w-[80%] bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <div className="mt-6 flex justify-center md:hidden relative z-10">
                <Link href="/products?hasDiscount=true" className="w-full">
                    <button className="w-full rounded-2xl bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                        Lihat Semua Produk Flash Sale
                    </button>
                </Link>
            </div>
        </section>
    );
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm text-gray-900">
                <span className="text-xl font-bold font-mono">{value.toString().padStart(2, '0')}</span>
            </div>
            <span className="mt-1 text-[10px] uppercase text-gray-400 font-medium">{label}</span>
        </div>
    );
}

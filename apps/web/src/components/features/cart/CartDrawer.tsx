'use client';

import { X, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';


/**
 * Cart drawer component that slides from right
 */
export function CartDrawer() {
    const { isCartDrawerOpen, closeCartDrawer } = useUiStore();
    const { cart, removeItem } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartDrawerOpen]);

    if (!mounted) return null;

    const hasItems = cart && cart.items && cart.items.length > 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isCartDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeCartDrawer}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-out",
                    isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <h2 className="text-xl font-bold text-gray-900 font-heading">
                            Keranjang Belanja
                            {hasItems && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({cart.items.length} item)
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={closeCartDrawer}
                            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            aria-label="Tutup keranjang"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    {!hasItems ? (
                        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 mb-6">
                                <ShoppingBag className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 font-heading">
                                Keranjang Kosong
                            </h3>
                            <p className="mt-2 text-gray-500 max-w-xs mx-auto">
                                Wah, keranjangmu masih kosong nih. Yuk mulai belanja sekarang!
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                className="mt-8"
                                href="/products"
                                onClick={closeCartDrawer}
                            >
                                Jelajahi Produk
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                <div className="space-y-6">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 group"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                                                onClick={closeCartDrawer}
                                            >
                                                <Image
                                                    src={item.product.thumbnail_url || `/placeholder.jpg`}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="96px"
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <Link
                                                            href={`/products/${item.product.slug}`}
                                                            className="text-sm font-bold text-gray-900 hover:text-primary-700 hover:underline line-clamp-2"
                                                            onClick={closeCartDrawer}
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-error-600 transition-colors p-0.5"
                                                            aria-label="Hapus item"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {item.variant && (
                                                        <p className="mt-1 text-xs text-gray-500 font-medium">
                                                            {[item.variant.size, item.variant.color, item.variant.finishing]
                                                                .filter(Boolean)
                                                                .join(', ')}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                        Qty: {item.quantity}
                                                    </div>
                                                    <span className="text-sm font-bold text-primary-700">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 p-5 bg-gray-50/50 space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-700">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-primary-700 font-heading">
                                        {formatCurrency(cart.total)}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full bg-white"
                                        href="/cart"
                                        onClick={closeCartDrawer}
                                    >
                                        Lihat Keranjang
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full shadow-lg shadow-primary-500/20"
                                        href="/checkout"
                                        onClick={closeCartDrawer}
                                    >
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

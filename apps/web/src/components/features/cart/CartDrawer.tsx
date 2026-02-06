'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUiStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

/**
 * Cart drawer component that slides from right
 */
export function CartDrawer() {
    const { isCartDrawerOpen, closeCartDrawer } = useUiStore();
    const { removeItem } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock cart items for display
    const mockCartItems = [
        {
            id: 1,
            product_name: 'Kursi Minimalis Modern',
            product_slug: 'kursi-minimalis-modern',
            variant_info: 'Putih, Medium',
            product_image: '/placeholder-product.svg',
            price: 1200000,
            quantity: 2,
            subtotal: 2400000,
        },
    ];

    const mockTotal = 2400000;

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

    return (
        <>
            {/* Backdrop */}
            {isCartDrawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
                    onClick={closeCartDrawer}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Keranjang Belanja
                        </h2>
                        <button
                            onClick={closeCartDrawer}
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Empty State */}
                    {mockCartItems.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                            <svg
                                className="mb-4 h-16 w-16 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="text-lg font-medium text-gray-900">
                                Keranjang Kosong
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                Mulai belanja sekarang!
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                className="mt-6"
                                onClick={() => {
                                    closeCartDrawer();
                                    // Will navigate to products
                                }}
                            >
                                Jelajahi Produk
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4">
                                    {mockCartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 rounded-lg border border-gray-200 p-3"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`/products/${item.product_slug}`}
                                                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                                                onClick={closeCartDrawer}
                                            >
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex flex-1 flex-col">
                                                <Link
                                                    href={`/products/${item.product_slug}`}
                                                    className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary-700"
                                                    onClick={closeCartDrawer}
                                                >
                                                    {item.product_name}
                                                </Link>
                                                {item.variant_info && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {item.variant_info}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-primary-700">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-error-DEFAULT"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 p-4">
                                {/* Total */}
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-base font-medium text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-primary-700">
                                        {formatCurrency(mockTotal)}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-2">
                                    <Link
                                        href="/cart"
                                        onClick={closeCartDrawer}
                                        className="block w-full"
                                    >
                                        <Button variant="primary" size="lg" fullWidth>
                                            Lihat Keranjang
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/checkout"
                                        onClick={closeCartDrawer}
                                        className="block w-full"
                                    >
                                        <Button variant="outline" size="lg" fullWidth>
                                            Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

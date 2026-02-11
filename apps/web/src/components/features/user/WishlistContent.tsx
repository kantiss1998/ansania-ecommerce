'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { wishlistService, WishlistItem } from '@/services/wishlistService';

export function WishlistContent() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const items = await wishlistService.getWishlist();
            setWishlist(items);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (id: number) => {
        try {
            await wishlistService.removeFromWishlist(id);
            // Optimistic update
            setWishlist((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-700 border-t-transparent"></div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Wishlist Kosong</h2>
                <p className="mt-2 text-gray-600">Anda belum menyimpan produk apapun.</p>
                <Link href="/products">
                    <Button variant="primary" className="mt-6">
                        Mulai Belanja
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wishlist Saya</h1>
                    <p className="mt-1 text-sm text-gray-600">{wishlist.length} item disimpan</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                        {/* Remove Button */}
                        <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus dari Wishlist"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <Link href={`/products/${item.product.slug}`}>
                            <div className="relative aspect-square bg-gray-100">
                                {/* Use Image component ideally, but for now img tag for simplicity if product.image is string */}
                                {item.product.thumbnail_url ? (
                                    <img
                                        src={item.product.thumbnail_url}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="p-4">
                            <Link href={`/products/${item.product.slug}`}>
                                <h3 className="text-lg font-medium text-gray-900 hover:text-primary-700 line-clamp-1">{item.product.name}</h3>
                            </Link>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.product.base_price)}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                className="mt-4"
                                onClick={() => window.location.href = `/products/${item.product.slug}`} // Or add to cart directly if possible
                            >
                                Lihat Produk
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

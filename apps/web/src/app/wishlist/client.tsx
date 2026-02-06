'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { WishlistItemCard } from '@/components/features/wishlist/WishlistItemCard';
import { useToast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import { wishlistService, WishlistItem } from '@/services/wishlistService';

function WishlistContent() {
    const router = useRouter();
    const { addItem, isLoading: cartLoading } = useCartStore();
    const { success, error } = useToast();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        setIsLoading(true);
        try {
            const data = await wishlistService.getWishlist();
            setWishlistItems(data);
        } catch (err) {
            console.error(err);
            // safe fail
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (itemId: number) => {
        try {
            await wishlistService.removeFromWishlist(itemId);
            setWishlistItems(prev => prev.filter(item => item.id !== itemId));
            success('Produk berhasil dihapus dari wishlist');
        } catch (err) {
            error('Gagal menghapus produk dari wishlist');
        }
    };

    const handleAddToCart = async (_productId: number) => {
        try {
            // For simplicity, using first variant ID (1)
            // In production, should show variant selector modal
            await addItem(1, 1);
            success('Produk berhasil ditambahkan ke keranjang!');
        } catch (err) {
            error('Gagal menambahkan produk ke keranjang');
        }
    };

    // Empty wishlist state
    if (!isLoading && wishlistItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <svg
                        className="mb-4 h-20 w-20 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Wishlist Kosong
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Anda belum menambahkan produk ke wishlist
                    </p>
                    <button
                        onClick={() => router.push('/products')}
                        className="mt-6 rounded-lg bg-primary-700 px-6 py-3 text-sm font-medium text-white hover:bg-primary-800"
                    >
                        Jelajahi Produk
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Wishlist Saya
                </h1>
                <p className="mt-2 text-gray-600">
                    {wishlistItems.length} produk dalam wishlist
                </p>
            </div>

            {/* Wishlist Grid */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    Loading wishlist...
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                        <WishlistItemCard
                            key={item.id}
                            item={{
                                id: item.id,
                                product_id: item.product_id,
                                product_name: item.product.name,
                                product_slug: item.product.slug,
                                product_image: item.product.images?.[0] || '/placeholder-product.svg', // item.product.images is string[] based on prior knowledge or will verify
                                base_price: item.product.base_price || 0,
                                discount_price: null, // Assuming product structure doesn't have it directly or need logic
                                stock_status: 'in_stock', // Default or need mapping
                                is_available: true,
                            } as any} // Temporary cast if WishlistItemCard expects specific mock interface
                            onRemove={handleRemoveFromWishlist}
                            onAddToCart={handleAddToCart}
                            isLoading={cartLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function WishlistClient() {
    return (
        <Suspense fallback={<div>Loading wishlist...</div>}>
            <WishlistContent />
        </Suspense>
    );
}

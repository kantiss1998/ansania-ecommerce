'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { WishlistItemCard } from '@/components/features/wishlist/WishlistItemCard';
import { useToast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';

function WishlistContent() {
    const router = useRouter();
    const { addItem, isLoading: cartLoading } = useCartStore();
    const { success, error } = useToast();

    // Mock wishlist data - will be replaced with actual API call
    const mockWishlistItems = [
        {
            id: 1,
            product_id: 1,
            product_name: 'Kursi Minimalis Modern',
            product_slug: 'kursi-minimalis-modern',
            product_image: '/placeholder-product.jpg',
            base_price: 1500000,
            discount_price: 1200000,
            stock_status: 'in_stock' as const,
            is_available: true,
        },
        {
            id: 2,
            product_id: 2,
            product_name: 'Meja Makan Kayu Jati',
            product_slug: 'meja-makan-kayu-jati',
            product_image: '/placeholder-product.jpg',
            base_price: 3500000,
            discount_price: null,
            stock_status: 'limited_stock' as const,
            is_available: true,
        },
        {
            id: 3,
            product_id: 3,
            product_name: 'Lemari Pakaian 3 Pintu',
            product_slug: 'lemari-pakaian-3-pintu',
            product_image: '/placeholder-product.jpg',
            base_price: 4500000,
            discount_price: null,
            stock_status: 'out_of_stock' as const,
            is_available: false,
        },
    ];

    const handleRemoveFromWishlist = async (itemId: number) => {
        try {
            // Will implement API call later
            console.log('Remove from wishlist:', itemId);
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
    if (mockWishlistItems.length === 0) {
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Wishlist Saya
                </h1>
                <p className="mt-2 text-gray-600">
                    {mockWishlistItems.length} produk dalam wishlist
                </p>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockWishlistItems.map((item) => (
                    <WishlistItemCard
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveFromWishlist}
                        onAddToCart={handleAddToCart}
                        isLoading={cartLoading}
                    />
                ))}
            </div>
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

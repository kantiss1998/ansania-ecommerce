'use client';

// Product type is not exported from cartStore, so we'll rely on local usage for now or import from a shared types file if available later
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { RatingStars } from '@/components/features/reviews/RatingStars';
import { Button } from '@/components/ui/Button';

// Mock Featured Products Data
const MOCK_FEATURED_PRODUCTS = [
    {
        id: 1,
        name: 'Kursi Minimalis Modern',
        price: 1200000,
        originalPrice: 1500000,
        rating: 4.5,
        image: '/placeholder.jpg',
        slug: 'kursi-minimalis-modern',
        tag: 'Best Seller'
    },
    {
        id: 2,
        name: 'Sofa L-Shape Premium',
        price: 4500000,
        originalPrice: null,
        rating: 4.8,
        image: '/placeholder.jpg',
        slug: 'sofa-l-shape-premium',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Meja Kerja Industrial',
        price: 850000,
        originalPrice: 1200000,
        rating: 4.3,
        image: '/placeholder.jpg',
        slug: 'meja-kerja-industrial',
        tag: 'Promo'
    },
    {
        id: 4,
        name: 'Lemari Pakaian 3 Pintu',
        price: 3200000,
        originalPrice: null,
        rating: 4.6,
        image: '/placeholder.jpg',
        slug: 'lemari-pakaian-3-pintu',
        tag: null
    },
];

export function FeaturedProducts() {
    return (
        <section className="py-12">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Produk Pilihan</h2>
                    <p className="mt-1 text-gray-600">Terfavorit minggu ini untuk hunian Anda</p>
                </div>
                <Link href="/products" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                    Lihat Semua →
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {MOCK_FEATURED_PRODUCTS.map((product) => (
                    <div key={product.id} className="group relative rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                        {/* Image Placeholder */}
                        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                            {/* Tag */}
                            {product.tag && (
                                <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white ${product.tag === 'Best Seller' ? 'bg-warning-500' :
                                    product.tag === 'New' ? 'bg-info-500' :
                                        'bg-error-500'
                                    }`}>
                                    {product.tag}
                                </span>
                            )}

                            <div className="flex h-full items-center justify-center text-gray-300">
                                Product Image
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                                <Link href={`/products/${product.slug}`}>
                                    <Button variant="primary" size="sm" className="shadow-lg">
                                        Lihat Detail
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <Link href={`/products/${product.slug}`}>
                                <h3 className="line-clamp-1 font-medium text-gray-900 group-hover:text-primary-700">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="mt-2 flex items-center gap-2">
                                <RatingStars rating={product.rating} size="sm" />
                                <span className="text-xs text-gray-500">({product.rating})</span>
                            </div>

                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatCurrency(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

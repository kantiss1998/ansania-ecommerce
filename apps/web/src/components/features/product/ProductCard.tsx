import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Star, Heart } from 'lucide-react';

import { Product } from '@/services/productService';

/**
 * Product card component for grid display
 */
export interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const discountPercentage = product.discount_price
        ? Math.round(
            ((product.base_price - product.discount_price) /
                product.base_price) *
            100
        )
        : 0;

    const price = product.discount_price || product.base_price;
    const isOutOfStock = product.stock_status === 'out_of_stock';

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:border-primary-200 h-full">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <Link href={`/products/${product.slug}`} className="block h-full cursor-pointer">
                    <Image
                        src={product.thumbnail_url || '/placeholder-product.svg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-2 z-10 pointer-events-none">
                    {product.is_new && (
                        <Badge variant="info" className="shadow-lg backdrop-blur-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none px-3 py-1.5 rounded-xl font-bold">
                            Baru
                        </Badge>
                    )}
                    {product.is_featured && (
                        <Badge variant="warning" className="shadow-lg backdrop-blur-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none px-3 py-1.5 rounded-xl font-bold">
                            Featured
                        </Badge>
                    )}
                    {discountPercentage > 0 && (
                        <Badge variant="error" className="shadow-lg backdrop-blur-sm bg-gradient-to-r from-red-500 to-pink-500 text-white border-none px-3 py-1.5 rounded-xl font-bold">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-600 hover:text-white hover:scale-110 active:scale-95"
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                        e.preventDefault();
                        // Add wishlist logic here
                    }}
                >
                    <Heart className="h-5 w-5" />
                </button>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20 flex gap-2">
                    <Button
                        variant="primary"
                        className="flex-1 shadow-lg bg-white/95 text-gray-900 hover:bg-gradient-primary hover:text-white backdrop-blur-sm transition-all border-none rounded-xl active:scale-95 font-semibold"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                            e.preventDefault();
                            // Logic to add to cart or view details
                            window.location.href = `/products/${product.slug}`;
                        }}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {isOutOfStock ? 'Habis' : 'Detail'}
                    </Button>
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
                        <span className="rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg backdrop-blur-sm">
                            Stok Habis
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Rating */}
                <div className="mb-2 flex items-center gap-1.5">
                    <div className="flex bg-gradient-to-r from-amber-50 to-orange-50 px-2 py-1 rounded-lg text-amber-600 items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold">
                            {product.rating_average.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                        ({product.total_reviews} ulasan)
                    </span>
                </div>

                {/* Title */}
                <Link
                    href={`/products/${product.slug}`}
                    className="mb-2 line-clamp-2 text-base font-bold text-gray-900 hover:text-primary-600 transition-colors font-heading leading-snug"
                >
                    {product.name}
                </Link>

                {/* Price */}
                <div className="mt-auto pt-2">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent font-heading tracking-tight">
                            {formatCurrency(price)}
                        </span>
                        {product.discount_price && (
                            <span className="text-xs text-gray-400 line-through decoration-gray-300">
                                {formatCurrency(product.base_price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status Text */}
                    {product.stock_status === 'limited_stock' && (
                        <p className="mt-3 text-[11px] font-bold text-amber-600 flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-2 py-1 rounded-lg w-fit shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Stok Terbatas
                        </p>
                    )}
                    {product.stock_status === 'pre_order' && (
                        <p className="mt-3 text-[11px] font-bold text-blue-600 flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 px-2 py-1 rounded-lg w-fit shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Pre-Order
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

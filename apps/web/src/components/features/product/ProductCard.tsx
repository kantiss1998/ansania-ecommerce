import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

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
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
            {/* Image */}
            <Link
                href={`/products/${product.slug}`}
                className="relative aspect-square overflow-hidden bg-gray-100"
            >
                <Image
                    src={product.thumbnail_url || '/placeholder-product.svg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Badges */}
                <div className="absolute left-2 top-2 flex flex-col gap-2">
                    {product.is_new && (
                        <Badge variant="info" className="shadow-sm">
                            Baru
                        </Badge>
                    )}
                    {product.is_featured && (
                        <Badge variant="warning" className="shadow-sm">
                            Featured
                        </Badge>
                    )}
                    {discountPercentage > 0 && (
                        <Badge variant="error" className="shadow-sm">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                            Stok Habis
                        </span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <Link
                    href={`/products/${product.slug}`}
                    className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary-700"
                >
                    {product.name}
                </Link>

                {/* Rating */}
                {product.total_reviews > 0 && (
                    <div className="mb-2 flex items-center gap-1 text-sm">
                        <svg
                            className="h-4 w-4 text-warning-DEFAULT"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-gray-900">
                            {product.rating_average.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                            ({product.total_reviews})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(price)}
                        </span>
                        {product.discount_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.base_price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {product.stock_status === 'limited_stock' && (
                        <p className="mt-1 text-xs text-warning-DEFAULT">
                            Stok Terbatas
                        </p>
                    )}
                    {product.stock_status === 'pre_order' && (
                        <p className="mt-1 text-xs text-info-DEFAULT">
                            Pre-Order
                        </p>
                    )}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-3">
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        disabled={isOutOfStock}
                        onClick={(e) => {
                            e.preventDefault();
                            // Will implement cart functionality later
                            // Add to cart implementation
                            // Since ProductCard doesn't display variants, we typically default to the first variant or redirect.
                            // However, the button says "Tambah ke Keranjang".
                            // If we don't have variant info, we should probably redirect to PDP.
                            // But usually "Add to Card" on listing assumes default variant or opens a modal.
                            // Let's redirect to PDP for complex products, or add default variant if available.
                            // Product interface has 'variants' array (optional?). 
                            // Let's check Product interface.
                            // Actually, let's just redirect to PDP to be safe and avoid complexity
                            // window.location.href = `/products/${product.slug}`; 
                            // Better: use Next Link behavior by not preventing default?
                            // But the button has onClick with preventDefault.

                            // Let's change it to redirect to PDP
                            window.location.href = `/products/${product.slug}`;
                        }}
                    >
                        {isOutOfStock ? 'Stok Habis' : 'Lihat Detail'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

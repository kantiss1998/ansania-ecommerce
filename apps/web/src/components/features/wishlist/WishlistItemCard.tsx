'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

/**
 * Wishlist item type
 */
interface WishlistItem {
    id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    product_image: string;
    base_price: number;
    discount_price: number | null;
    stock_status: 'in_stock' | 'limited_stock' | 'out_of_stock' | 'pre_order';
    is_available: boolean;
}

/**
 * Wishlist item component
 */
export interface WishlistItemCardProps {
    item: WishlistItem;
    onRemove: (itemId: number) => void;
    onAddToCart: (productId: number) => void;
    isLoading?: boolean;
}

export function WishlistItemCard({
    item,
    onRemove,
    onAddToCart,
    isLoading = false,
}: WishlistItemCardProps) {
    const price = item.discount_price || item.base_price;
    const discountPercentage = item.discount_price
        ? Math.round(
            ((item.base_price - item.discount_price) / item.base_price) * 100
        )
        : 0;
    const isOutOfStock = item.stock_status === 'out_of_stock';

    return (
        <div className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
            {/* Remove Button */}
            <button
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                className="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-400 shadow-sm transition-colors hover:bg-error-light hover:text-error-DEFAULT disabled:opacity-50"
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

            <div className="flex gap-4">
                {/* Product Image */}
                <Link
                    href={`/products/${item.product_slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                >
                    <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                    {discountPercentage > 0 && (
                        <div className="absolute left-1 top-1">
                            <Badge variant="error" className="text-xs">
                                -{discountPercentage}%
                            </Badge>
                        </div>
                    )}
                </Link>

                {/* Product Info */}
                <div className="flex flex-1 flex-col">
                    <Link
                        href={`/products/${item.product_slug}`}
                        className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary-700"
                    >
                        {item.product_name}
                    </Link>

                    {/* Price */}
                    <div className="mb-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary-700">
                            {formatCurrency(price)}
                        </span>
                        {item.discount_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(item.base_price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {isOutOfStock ? (
                        <p className="mb-3 text-xs text-error-DEFAULT">Stok Habis</p>
                    ) : item.stock_status === 'limited_stock' ? (
                        <p className="mb-3 text-xs text-warning-DEFAULT">
                            Stok Terbatas
                        </p>
                    ) : null}

                    {/* Add to Cart Button */}
                    <Button
                        variant={isOutOfStock ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => onAddToCart(item.product_id)}
                        disabled={isLoading || isOutOfStock}
                        className="mt-auto"
                    >
                        {isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

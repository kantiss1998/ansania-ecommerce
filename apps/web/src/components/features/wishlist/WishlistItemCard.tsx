'use client';

import { Trash2, ShoppingCart, Percent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
        <div className="group relative rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:border-primary-100 flex flex-col h-full">
            {/* Remove Button */}
            <button
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-400 shadow-sm transition-all hover:bg-error-50 hover:text-error-600 disabled:opacity-50 border border-gray-100"
                aria-label="Hapus dari wishlist"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <div className="flex gap-4 h-full">
                {/* Product Image */}
                <Link
                    href={`/products/${item.product_slug}`}
                    className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-95 transition-opacity"
                >
                    <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100px, 112px"
                    />
                    {discountPercentage > 0 && (
                        <div className="absolute left-2 top-2">
                            <Badge variant="error" className="text-[10px] px-1.5 py-0.5 h-auto font-bold shadow-sm">
                                <Percent className="h-3 w-3 mr-0.5 inline" />
                                {discountPercentage}%
                            </Badge>
                        </div>
                    )}
                </Link>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                        <Link
                            href={`/products/${item.product_slug}`}
                            className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 hover:text-primary-700 transition-colors"
                        >
                            {item.product_name}
                        </Link>

                        {/* Price */}
                        <div className="mb-2 flex flex-col gap-0.5">
                            <span className="text-lg font-bold text-primary-700 font-heading">
                                {formatCurrency(price)}
                            </span>
                            {item.discount_price && (
                                <span className="text-xs text-gray-400 line-through">
                                    {formatCurrency(item.base_price)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        {isOutOfStock ? (
                            <p className="mb-3 text-xs font-semibold text-error-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-error-500"></span>
                                Stok Habis
                            </p>
                        ) : item.stock_status === 'limited_stock' ? (
                            <p className="mb-3 text-xs font-semibold text-warning-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning-500"></span>
                                Stok Terbatas
                            </p>
                        ) : (
                            <p className="mb-3 text-xs font-semibold text-success-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                                Tersedia
                            </p>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="pt-2">
                        <Button
                            variant={isOutOfStock ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => onAddToCart(item.product_id)}
                            disabled={isLoading || isOutOfStock}
                            className="w-full shadow-sm"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {isOutOfStock ? 'Stok Habis' : 'Keranjang'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/services/cartService';

/**
 * Cart item component
 */
export interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    onRemove: (itemId: number) => void;
    isUpdating?: boolean;
}

export function CartItem({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating = false,
}: CartItemProps) {
    const handleQuantityChange = (newQuantity: number) => {
        const stock = item.variant?.stock || 0;
        if (newQuantity > 0 && newQuantity <= stock) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    const variantInfo = [item.variant?.color, item.variant?.size, item.variant?.finishing]
        .filter(Boolean)
        .join(', ');

    return (
        <div className="flex gap-4 border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-xl group/item">
            {/* Product Image */}
            <Link
                href={`/products/${item.product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 group"
            >
                <Image
                    src={item.product.thumbnail_url || '/placeholder-product.svg'}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="96px"
                />
            </Link>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <Link
                            href={`/products/${item.product.slug}`}
                            className="text-base font-bold text-gray-900 hover:text-primary-700 hover:underline active:text-primary-800 line-clamp-2"
                        >
                            {item.product.name}
                        </Link>
                        {variantInfo && (
                            <p className="text-sm font-medium text-gray-500">
                                {variantInfo}
                            </p>
                        )}
                        <p className="text-sm font-semibold text-primary-700">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                </div>

                {/* Quantity & Actions */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
                        <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            type="button"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) handleQuantityChange(val);
                            }}
                            disabled={isUpdating}
                            className="h-7 w-10 border-0 bg-transparent p-0 text-center text-sm font-medium text-gray-900 focus:ring-0 disabled:opacity-50"
                        />
                        <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= (item.variant?.stock || 0)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center gap-4">
                        <p className="hidden sm:block text-sm font-bold text-gray-900">
                            {formatCurrency(item.subtotal)}
                        </p>
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={isUpdating}
                            className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-all opacity-0 group-hover/item:opacity-100"
                            aria-label="Hapus item"
                            type="button"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

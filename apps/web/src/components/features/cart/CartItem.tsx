'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

/**
 * Cart item type
 */
export interface CartItemViewModel {
    id: number;
    product_variant_id: number;
    product_name: string;
    product_slug: string;
    variant_info: string;
    product_image: string;
    price: number;
    quantity: number;
    subtotal: number;
    stock: number;
}

/**
 * Cart item component
 */
export interface CartItemProps {
    item: CartItemViewModel;
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
        if (newQuantity > 0 && newQuantity <= item.stock) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="flex gap-4 border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-xl">
            {/* Product Image */}
            <Link
                href={`/products/${item.product_slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 group"
            >
                <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                />
            </Link>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <Link
                            href={`/products/${item.product_slug}`}
                            className="text-base font-bold text-gray-900 hover:text-primary-700 hover:underline active:text-primary-800 line-clamp-2"
                        >
                            {item.product_name}
                        </Link>
                        {item.variant_info && (
                            <p className="text-sm font-medium text-gray-500">
                                {item.variant_info}
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
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
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
                            disabled={isUpdating || item.quantity >= item.stock}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                            type="button"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
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
                            className="rounded-full p-2 text-gray-400 hover:bg-error-50 hover:text-error-600 disabled:opacity-50 transition-all"
                            aria-label="Hapus item"
                            type="button"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

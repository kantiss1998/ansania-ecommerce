import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

/**
 * Cart item type
 */
interface CartItem {
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
    item: CartItem;
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
        <div className="flex gap-4 border-b border-gray-200 py-6">
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
            </Link>

            {/* Product Info */}
            <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                    <div className="flex-1">
                        <Link
                            href={`/products/${item.product_slug}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-700"
                        >
                            {item.product_name}
                        </Link>
                        {item.variant_info && (
                            <p className="mt-1 text-sm text-gray-500">
                                {item.variant_info}
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="ml-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.price)}
                        </p>
                    </div>
                </div>

                {/* Quantity & Actions */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                                handleQuantityChange(parseInt(e.target.value) || 1)
                            }
                            disabled={isUpdating}
                            className="h-8 w-16 rounded-md border border-gray-300 text-center text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:opacity-50"
                            min="1"
                            max={item.stock}
                        />
                        <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.stock}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            +
                        </button>
                        <span className="ml-2 text-xs text-gray-500">
                            Stok: {item.stock}
                        </span>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(item.subtotal)}
                        </p>
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={isUpdating}
                            className="text-sm font-medium text-error-DEFAULT hover:text-error-dark disabled:opacity-50"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

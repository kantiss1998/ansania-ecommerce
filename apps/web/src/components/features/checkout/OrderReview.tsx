import { formatCurrency } from '@/lib/utils';
import { Address } from '@/services/addressService';
import { PaymentMethod } from './PaymentMethodSelector';

/**
 * Order item type
 */
interface OrderItem {
    product_name: string;
    variant_info?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

/**
 * Order summary data
 */
export interface OrderSummaryData {
    items: OrderItem[];
    subtotal: number;
    shipping_cost: number;
    payment_fee: number;
    discount: number;
    total: number;
    voucher_code?: string;
}

/**
 * Order review component
 */
export interface OrderReviewProps {
    address: Address;
    paymentMethod: PaymentMethod;
    summary: OrderSummaryData;
}

export function OrderReview({
    address,
    paymentMethod,
    summary,
}: OrderReviewProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
                Review Pesanan
            </h3>

            {/* Shipping Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Alamat Pengiriman
                </h4>
                <p className="font-semibold text-gray-900">
                    {address.recipient_name}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="mt-2 text-sm text-gray-700">
                    {address.address_line}
                </p>
                <p className="text-sm text-gray-700">
                    {address.city}, {address.province} {address.postal_code}
                </p>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Metode Pembayaran
                </h4>
                <div className="flex items-center gap-3">
                    {paymentMethod.logo && (
                        <img
                            src={paymentMethod.logo}
                            alt={paymentMethod.name}
                            className="h-8 w-12 object-contain"
                        />
                    )}
                    <div>
                        <p className="font-semibold text-gray-900">
                            {paymentMethod.name}
                        </p>
                        {paymentMethod.description && (
                            <p className="text-sm text-gray-600">
                                {paymentMethod.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                    Produk ({summary.items.length} item)
                </h4>
                <div className="space-y-3">
                    {summary.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {item.product_name}
                                </p>
                                {item.variant_info && (
                                    <p className="text-xs text-gray-500">
                                        {item.variant_info}
                                    </p>
                                )}
                                <p className="mt-1 text-sm text-gray-600">
                                    {formatCurrency(item.price)} × {item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(item.subtotal)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                    Ringkasan Pembayaran
                </h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Subtotal ({summary.items.length} item)
                        </span>
                        <span className="font-medium text-gray-900">
                            {formatCurrency(summary.subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ongkos Kirim</span>
                        <span className="font-medium text-gray-900">
                            {formatCurrency(summary.shipping_cost)}
                        </span>
                    </div>

                    {summary.payment_fee > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Biaya Pembayaran</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(summary.payment_fee)}
                            </span>
                        </div>
                    )}

                    {summary.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Diskon
                                {summary.voucher_code && (
                                    <span className="ml-1 text-xs text-primary-700">
                                        ({summary.voucher_code})
                                    </span>
                                )}
                            </span>
                            <span className="font-medium text-success-DEFAULT">
                                -{formatCurrency(summary.discount)}
                            </span>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                                Total Pembayaran
                            </span>
                            <span className="text-lg font-bold text-primary-700">
                                {formatCurrency(summary.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

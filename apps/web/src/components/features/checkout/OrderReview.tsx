import { formatCurrency } from '@/lib/utils';
import { Address } from '@/services/addressService';
import { PaymentMethod } from './PaymentMethodSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
            <h3 className="text-xl font-bold text-gray-900 font-heading">
                Review Pesanan
            </h3>

            {/* Shipping Address */}
            <Card>
                <CardHeader>
                    <CardTitle>Alamat Pengiriman</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <p className="font-bold text-gray-900">
                            {address.recipient_name}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">{address.phone}</p>
                        <div className="pt-2 text-sm text-gray-500 leading-relaxed">
                            <p>{address.address_line}</p>
                            <p>{address.city}, {address.province} {address.postal_code}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {paymentMethod.logo ? (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-gray-100 bg-white p-2">
                                <img
                                    src={paymentMethod.logo}
                                    alt={paymentMethod.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-900">
                                {paymentMethod.name}
                            </p>
                            {paymentMethod.description && (
                                <p className="text-sm text-gray-500">
                                    {paymentMethod.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Produk <span className="text-gray-500 font-normal text-base ml-1">({summary.items.length} item)</span></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 divide-y divide-gray-100">
                        {summary.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start justify-between pt-4 first:pt-0"
                            >
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">
                                        {item.product_name}
                                    </p>
                                    {item.variant_info && (
                                        <p className="text-sm text-gray-500 font-medium">
                                            {item.variant_info}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {item.quantity} x {formatCurrency(item.price)}
                                    </p>
                                </div>
                                <p className="font-bold text-gray-900">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="bg-gray-50/50 border-dashed">
                <CardHeader>
                    <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-base">
                            <span className="text-gray-600">
                                Subtotal
                            </span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(summary.subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between text-base">
                            <span className="text-gray-600">Ongkos Kirim</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(summary.shipping_cost)}
                            </span>
                        </div>

                        {summary.payment_fee > 0 && (
                            <div className="flex justify-between text-base">
                                <span className="text-gray-600">Biaya Layanan</span>
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(summary.payment_fee)}
                                </span>
                            </div>
                        )}

                        {summary.discount > 0 && (
                            <div className="flex justify-between text-base">
                                <span className="text-gray-600">
                                    Diskon
                                    {summary.voucher_code && (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                            {summary.voucher_code}
                                        </span>
                                    )}
                                </span>
                                <span className="font-semibold text-success-600">
                                    -{formatCurrency(summary.discount)}
                                </span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900 text-lg">
                                    Total Pembayaran
                                </span>
                                <span className="text-2xl font-bold text-primary-700 font-heading">
                                    {formatCurrency(summary.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

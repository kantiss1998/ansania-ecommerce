import { formatCurrency } from '@/lib/utils';
import { Address } from '@/services/addressService';
import { PaymentMethod } from './PaymentMethodSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, CreditCard, ShoppingBag, Receipt, Tag } from 'lucide-react';

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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                <Receipt className="h-6 w-6 text-primary-600" />
                Review Pesanan
            </h3>

            {/* Shipping Address */}
            <Card className="overflow-hidden border-l-4 border-l-primary-500">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        Alamat Pengiriman
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
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
            <Card className="overflow-hidden border-l-4 border-l-primary-500">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        Metode Pembayaran
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                        {paymentMethod.logo ? (
                            <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
                                <img
                                    src={paymentMethod.logo}
                                    alt={paymentMethod.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                <CreditCard className="h-6 w-6" />
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
            <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ShoppingBag className="h-5 w-5 text-gray-500" />
                        Produk <span className="text-gray-500 font-normal ml-1">({summary.items.length} item)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-4 divide-y divide-gray-100">
                        {summary.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start justify-between pt-4 first:pt-0"
                            >
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 line-clamp-2">
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
                                <p className="font-bold text-gray-900 whitespace-nowrap">
                                    {formatCurrency(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="bg-gray-50/50 border-dashed border-2 shadow-none">
                <CardHeader className="pb-2">
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
                                <span className="text-gray-600 flex items-center">
                                    Diskon
                                    {summary.voucher_code && (
                                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                            <Tag className="h-3 w-3" />
                                            {summary.voucher_code}
                                        </span>
                                    )}
                                </span>
                                <span className="font-semibold text-success-600 bg-success-50 px-2 py-0.5 rounded">
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

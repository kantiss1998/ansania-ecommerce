import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';

/**
 * Cart summary data type
 */
export interface CartSummaryData {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    voucher_code?: string;
}

/**
 * Cart summary component
 */
export interface CartSummaryProps {
    summary: CartSummaryData;
    onCheckout?: () => void;
    isCheckoutDisabled?: boolean;
}

export function CartSummary({
    summary,
    onCheckout,
    isCheckoutDisabled = false,
}: CartSummaryProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 sticky top-24">
            <h2 className="mb-6 text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary-600" />
                Ringkasan Belanja
            </h2>

            <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(summary.subtotal)}
                    </span>
                </div>

                {summary.discount > 0 && (
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600 flex items-center gap-2">
                            Diskon
                            {summary.voucher_code && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {summary.voucher_code}
                                </span>
                            )}
                        </span>
                        <span className="font-semibold text-green-600">
                            -{formatCurrency(summary.discount)}
                        </span>
                    </div>
                )}

                {summary.shipping > 0 && (
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            Ongkir
                        </span>
                        <span className="font-semibold text-gray-900">
                            {formatCurrency(summary.shipping)}
                        </span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <div className="text-right">
                    <span className="text-3xl font-bold text-primary-700 font-heading block">
                        {formatCurrency(summary.total)}
                    </span>
                    <span className="text-xs text-gray-500">Termasuk PPN</span>
                </div>
            </div>

            {/* Checkout Button */}
            {onCheckout && (
                <div className="mb-4">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onCheckout}
                        disabled={isCheckoutDisabled}
                        className="shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 transition-shadow h-14 text-lg"
                    >
                        Lanjut ke Pembayaran
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Continue Shopping */}
            <div className="text-center">
                <Link
                    href="/products"
                    className="text-sm font-semibold text-gray-500 hover:text-primary-600 hover:underline transition-colors"
                >
                    Lanjut Belanja
                </Link>
            </div>
        </div>
    );
}

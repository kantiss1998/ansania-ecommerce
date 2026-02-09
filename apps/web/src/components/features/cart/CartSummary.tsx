import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h2 className="mb-6 text-lg font-bold text-gray-900 font-heading">
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

                {summary.shipping > 0 && (
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600">Ongkir</span>
                        <span className="font-semibold text-gray-900">
                            {formatCurrency(summary.shipping)}
                        </span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-700 font-heading">
                    {formatCurrency(summary.total)}
                </span>
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
                        className="shadow-lg shadow-primary-500/20"
                    >
                        Lanjut ke Pembayaran
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

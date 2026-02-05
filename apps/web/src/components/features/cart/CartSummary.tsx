import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

/**
 * Cart summary data type
 */
interface CartSummaryData {
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
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Ringkasan Belanja
            </h2>

            <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                        {formatCurrency(summary.subtotal)}
                    </span>
                </div>

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

                {summary.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ongkir</span>
                        <span className="font-medium text-gray-900">
                            {formatCurrency(summary.shipping)}
                        </span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="mt-4 flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary-700">
                    {formatCurrency(summary.total)}
                </span>
            </div>

            {/* Checkout Button */}
            {onCheckout && (
                <div className="mt-6">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onCheckout}
                        disabled={isCheckoutDisabled}
                    >
                        Lanjut ke Pembayaran
                    </Button>
                </div>
            )}

            {/* Continue Shopping */}
            <div className="mt-4 text-center">
                <Link
                    href="/products"
                    className="text-sm font-medium text-primary-700 hover:text-primary-800"
                >
                    ← Lanjut Belanja
                </Link>
            </div>
        </div>
    );
}

'use client';

import { cn } from '@/lib/utils';

/**
 * Payment method type
 */
export interface PaymentMethod {
    id: string;
    name: string;
    type: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'cod';
    logo?: string;
    description?: string;
    fee?: number;
}

/**
 * Payment method selector component
 */
export interface PaymentMethodSelectorProps {
    methods: PaymentMethod[];
    selectedId?: string;
    onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
    methods,
    selectedId,
    onSelect,
}: PaymentMethodSelectorProps) {
    const groupedMethods = methods.reduce((acc, method) => {
        const type = method.type as string;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(method);
        return acc;
    }, {} as Record<string, PaymentMethod[]>);

    const typeLabels: Record<string, string> = {
        bank_transfer: 'Transfer Bank',
        e_wallet: 'E-Wallet',
        credit_card: 'Kartu Kredit/Debit',
        cod: 'Bayar di Tempat (COD)',
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading">
                Pilih Metode Pembayaran
            </h3>

            {Object.entries(groupedMethods).map(([type, typeMethods]) => (
                <div key={type} className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {typeLabels[type] || type}
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-1">
                        {typeMethods.map((method) => {
                            const isSelected = selectedId === method.id;
                            return (
                                <div
                                    key={method.id}
                                    onClick={() => onSelect(method)}
                                    className={cn(
                                        "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ease-in-out",
                                        isSelected
                                            ? "border-primary-500 bg-primary-50/30 shadow-sm ring-1 ring-primary-500/20"
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {method.logo && (
                                                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm border border-gray-100">
                                                    <img
                                                        src={method.logo}
                                                        alt={method.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {method.name}
                                                </p>
                                                {method.description && (
                                                    <p className="text-sm text-gray-500">
                                                        {method.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {method.fee && method.fee > 0 ? (
                                                <span className="text-sm font-medium text-gray-600">
                                                    +Rp {method.fee.toLocaleString('id-ID')}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-bold text-success-600 bg-success-50 px-2 py-1 rounded-full">
                                                    Gratis
                                                </span>
                                            )}

                                            {isSelected && (
                                                <div className="text-primary-500">
                                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

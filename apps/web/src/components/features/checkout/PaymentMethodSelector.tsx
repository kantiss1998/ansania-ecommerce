'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { CreditCard, Wallet, Banknote, Building, Check } from 'lucide-react';

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

    const typeIcons: Record<string, React.ReactNode> = {
        bank_transfer: <Building className="h-4 w-4" />,
        e_wallet: <Wallet className="h-4 w-4" />,
        credit_card: <CreditCard className="h-4 w-4" />,
        cod: <Banknote className="h-4 w-4" />,
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                Pilih Metode Pembayaran
            </h3>

            {Object.entries(groupedMethods).map(([type, typeMethods]) => (
                <div key={type} className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2 pl-1">
                        {typeIcons[type]}
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
                                        "relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ease-in-out",
                                        isSelected
                                            ? "border-primary-500 bg-primary-50/30 shadow-md ring-1 ring-primary-500/20"
                                            : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {method.logo ? (
                                                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm border border-gray-100">
                                                    <img
                                                        src={method.logo}
                                                        alt={method.name}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                                    <Banknote className="h-5 w-5" />
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
                                                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                    +{formatCurrency(method.fee)}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-bold text-success-600 bg-success-50 px-2 py-1 rounded-full border border-success-100">
                                                    Gratis
                                                </span>
                                            )}

                                            {isSelected && (
                                                <div className="text-primary-600 bg-white rounded-full p-1 shadow-sm">
                                                    <Check className="h-5 w-5" />
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

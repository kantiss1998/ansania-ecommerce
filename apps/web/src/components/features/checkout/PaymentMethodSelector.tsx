'use client';

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
        if (!acc[method.type]) {
            acc[method.type] = [];
        }
        acc[method.type].push(method);
        return acc;
    }, {} as Record<string, PaymentMethod[]>);

    const typeLabels = {
        bank_transfer: 'Transfer Bank',
        e_wallet: 'E-Wallet',
        credit_card: 'Kartu Kredit/Debit',
        cod: 'Bayar di Tempat (COD)',
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
                Pilih Metode Pembayaran
            </h3>

            {Object.entries(groupedMethods).map(([type, typeMethods]) => (
                <div key={type}>
                    <h4 className="mb-3 text-sm font-medium text-gray-700">
                        {typeLabels[type as keyof typeof typeLabels]}
                    </h4>
                    <div className="space-y-2">
                        {typeMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedId === method.id
                                        ? 'border-primary-700 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => onSelect(method)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {method.logo && (
                                            <img
                                                src={method.logo}
                                                alt={method.name}
                                                className="h-8 w-12 object-contain"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {method.name}
                                            </p>
                                            {method.description && (
                                                <p className="text-sm text-gray-600">
                                                    {method.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {method.fee && method.fee > 0 ? (
                                            <span className="text-sm text-gray-600">
                                                +Rp {method.fee.toLocaleString('id-ID')}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-success-DEFAULT">
                                                Gratis
                                            </span>
                                        )}

                                        {selectedId === method.id && (
                                            <svg
                                                className="h-6 w-6 text-primary-700"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Voucher input component
 */
export interface VoucherInputProps {
    onApply: (code: string) => Promise<void>;
    onRemove?: () => void;
    appliedCode?: string;
    isLoading?: boolean;
}

export function VoucherInput({
    onApply,
    onRemove,
    appliedCode,
    isLoading = false,
}: VoucherInputProps) {
    const [code, setCode] = useState('');

    const handleApply = async () => {
        if (!code.trim()) return;
        await onApply(code.trim());
        setCode('');
    };

    if (appliedCode) {
        return (
            <div className="rounded-lg border border-success-DEFAULT bg-success-light p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Voucher diterapkan
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Kode: <span className="font-semibold">{appliedCode}</span>
                        </p>
                    </div>
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="text-sm font-medium text-error-DEFAULT hover:text-error-dark"
                        >
                            Hapus
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
                Punya Kode Voucher?
            </h3>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Masukkan kode voucher"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleApply();
                        }
                    }}
                    className="flex-1"
                />
                <Button
                    variant="outline"
                    size="md"
                    onClick={handleApply}
                    isLoading={isLoading}
                    disabled={!code.trim() || isLoading}
                >
                    Terapkan
                </Button>
            </div>
        </div>
    );
}

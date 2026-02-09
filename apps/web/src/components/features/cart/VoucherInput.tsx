'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const voucherSchema = z.object({
    code: z.string().min(1, 'Kode voucher harus diisi'),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

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
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<VoucherFormData>({
        resolver: zodResolver(voucherSchema),
    });

    const onSubmit = async (data: VoucherFormData) => {
        await onApply(data.code.toUpperCase());
        reset();
    };

    if (appliedCode) {
        return (
            <div className="rounded-2xl border border-success-200 bg-success-50 p-5 transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-900 font-heading">
                            Voucher diterapkan
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Kode: <span className="font-bold font-mono text-primary-700">{appliedCode}</span>
                        </p>
                    </div>
                    {onRemove && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRemove}
                            className="text-error-600 hover:text-error-700 hover:bg-error-50"
                        >
                            Hapus
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-900 font-heading">
                Punya Kode Voucher?
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <div className="flex-1">
                    <Input
                        placeholder="Masukkan kode voucher"
                        error={errors.code?.message}
                        {...register('code')}
                        className="uppercase"
                        disabled={isLoading}
                    />
                </div>
                <Button
                    type="submit"
                    variant="outline"
                    isLoading={isLoading}
                    className="shrink-0"
                >
                    Terapkan
                </Button>
            </form>
        </div>
    );
}

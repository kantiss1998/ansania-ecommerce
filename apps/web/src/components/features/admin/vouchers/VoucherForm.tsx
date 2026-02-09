'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Voucher, adminVoucherService } from '@/services/adminVoucherService';

interface VoucherFormProps {
    initialData?: Voucher | null;
}

export function VoucherForm({ initialData }: VoucherFormProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        code: initialData?.code || '',
        description: initialData?.description || '',
        discount_type: initialData?.discount_type || 'percent',
        discount_amount: initialData?.discount_amount || 0,
        min_purchase: initialData?.min_purchase || 0,
        max_discount: initialData?.max_discount || 0,
        start_date: formatDateForInput(initialData?.start_date),
        end_date: formatDateForInput(initialData?.end_date),
        usage_limit: initialData?.usage_limit || 0,
        is_active: initialData?.is_active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
            };

            if (initialData) {
                await adminVoucherService.updateVoucher(initialData.id, dataToSubmit);
                success('Voucher berhasil diperbarui');
            } else {
                await adminVoucherService.createVoucher(dataToSubmit as any);
                success('Voucher berhasil dibuat');
            }
            router.push('/admin/vouchers');
            router.refresh();
        } catch (err) {
            console.error(err);
            error(initialData ? 'Gagal memperbarui voucher' : 'Gagal membuat voucher');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <Input
                        label="Kode Voucher"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        placeholder="Contoh: SALE1212"
                    />

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Deskripsi voucher (opsional)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tipe Diskon
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={formData.discount_type}
                                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percent' | 'fixed' })}
                            >
                                <option value="percent">Persentase (%)</option>
                                <option value="fixed">Nominal (Rp)</option>
                            </select>
                        </div>
                        <Input
                            label="Jumlah Diskon"
                            type="number"
                            value={formData.discount_amount}
                            onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Min. Belanja"
                            type="number"
                            value={formData.min_purchase}
                            onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                        />
                        <Input
                            label="Maks. Diskon"
                            type="number"
                            value={formData.max_discount}
                            onChange={(e) => setFormData({ ...formData, max_discount: Number(e.target.value) })}
                            helperText={formData.discount_type === 'percent' ? 'Maksimal potongan harga' : undefined}
                            disabled={formData.discount_type === 'fixed'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Mulai Berlaku"
                            type="datetime-local"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            required
                        />
                        <Input
                            label="Berakhir Pada"
                            type="datetime-local"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Batas Penggunaan"
                        type="number"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                        helperText="Kosongkan atau 0 untuk tidak terbatas"
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Aktifkan Voucher
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    {initialData ? 'Simpan Perubahan' : 'Buat Voucher'}
                </Button>
            </div>
        </form>
    );
}

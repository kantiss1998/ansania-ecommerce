'use client';

import { Voucher, VoucherType } from '@repo/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { getAccessToken } from '@/lib/auth';

interface VoucherFormProps {
    initialData?: Voucher;
}

export function VoucherForm({ initialData }: VoucherFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Voucher>>(initialData || {
        code: '',
        name: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_purchase_amount: 0,
        is_active: true,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = getAccessToken();
            const method = isEdit ? 'PUT' : 'POST';
            const endpoint = isEdit ? `/api/admin/vouchers/${initialData.id}` : '/api/admin/vouchers';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/vouchers');
                router.refresh();
            } else {
                alert('Gagal menyimpan voucher.');
            }
        } catch (error) {
            console.error('Submit voucher error:', error);
            alert('Terjadi kesalahan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? `Edit Voucher: ${initialData.code}` : 'Buat Voucher Baru'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Atur parameter diskon dan batasan penggunaan voucher
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" size="md" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                        {isEdit ? 'Update Voucher' : 'Simpan Voucher'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Informasi Utama</h3>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Kode Voucher</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 font-mono uppercase"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="CONTOH: DISKON50"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nama Voucher</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Promo Harbolnas 12.12"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Pengaturan Diskon</h3>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Tipe Diskon</label>
                        <select
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.discount_type}
                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as VoucherType })}
                        >
                            <option value="percentage">Persentase (%)</option>
                            <option value="fixed_amount">Potongan Harga (Rp)</option>
                            <option value="free_shipping">Gratis Ongkir</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Nilai Diskon {formData.discount_type === 'percentage' ? '(%)' : '(Rp)'}
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.discount_value}
                            onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                            required
                        />
                    </div>
                    {formData.discount_type === 'percentage' && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Maksimal Diskon (Rp)</label>
                            <input
                                type="number"
                                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                                value={formData.max_discount_amount}
                                onChange={(e) => setFormData({ ...formData, max_discount_amount: Number(e.target.value) })}
                            />
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Batasan & Validitas</h3>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Minimal Pembelian (Rp)</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.min_purchase_amount}
                            onChange={(e) => setFormData({ ...formData, min_purchase_amount: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Limit Penggunaan (Total)</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.usage_limit}
                            onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                            placeholder="Kosongkan jika tidak terbatas"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Periode Aktif</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                                value={formData.start_date?.split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tanggal Berakhir</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                                value={formData.end_date?.split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Aktifkan Voucher Sekarang</label>
                    </div>
                </div>
            </div>
        </form>
    );
}

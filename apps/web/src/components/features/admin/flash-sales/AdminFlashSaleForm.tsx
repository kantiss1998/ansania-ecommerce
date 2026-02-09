'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { FlashSale, flashSaleService } from '@/services/flashSaleService';

interface AdminFlashSaleFormProps {
    initialData?: FlashSale | null;
}

export function AdminFlashSaleForm({ initialData }: AdminFlashSaleFormProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        // Adjust for timezone offset if necessary or use ISO if backend expects UTC and frontend displays local
        // Here assuming simple local time usage for simplicity or ISO string handling
        return d.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        start_time: formatDateForInput(initialData?.start_time),
        end_time: formatDateForInput(initialData?.end_time),
        is_active: initialData?.is_active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Ensure dates are valid ISO strings
            const dataToSubmit = {
                ...formData,
                start_time: new Date(formData.start_time).toISOString(),
                end_time: new Date(formData.end_time).toISOString(),
            };

            if (initialData) {
                await flashSaleService.updateFlashSale(initialData.id, dataToSubmit);
                success('Flash sale berhasil diperbarui');
            } else {
                await flashSaleService.createFlashSale(dataToSubmit as any);
                success('Flash sale berhasil dibuat');
            }
            router.push('/admin/flash-sales');
            router.refresh();
        } catch (err) {
            console.error(err);
            error(initialData ? 'Gagal memperbarui flash sale' : 'Gagal membuat flash sale');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
                <Input
                    label="Nama Event"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Contoh: Flash Sale 12.12"
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
                        placeholder="Deskripsi event (opsional)"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Waktu Mulai"
                        type="datetime-local"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        required
                    />
                    <Input
                        label="Waktu Berakhir"
                        type="datetime-local"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Aktifkan Event
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                    {initialData ? 'Simpan Perubahan' : 'Buat Flash Sale'}
                </Button>
            </div>
        </form>
    );
}

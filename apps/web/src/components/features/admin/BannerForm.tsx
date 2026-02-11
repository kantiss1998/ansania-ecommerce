'use client';

import { Banner } from '@repo/shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { adminCmsService, BannerData } from '@/services/adminCmsService';

interface BannerFormProps {
    initialData?: Banner;
}

export function BannerForm({ initialData }: BannerFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<BannerData>({
        title: initialData?.title || '',
        image_url: initialData?.image_url || '',
        link_url: initialData?.link_url || '',
        sequence: initialData?.sequence || 1,
        position: (initialData?.position as any) || 'home_hero',
        is_active: initialData?.is_active ?? true
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEdit && initialData) {
                await adminCmsService.updateBanner(initialData.id, formData);
            } else {
                await adminCmsService.createBanner(formData);
            }
            router.push('/admin/cms/banners'); // Redirect to new route structure
            router.refresh();
        } catch (error) {
            console.error('Submit banner error:', error);
            alert('Gagal menyimpan banner.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? `Edit Banner: ${initialData?.title}` : 'Tambah Banner Baru'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola aset visual promosi di berbagai posisi halaman
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" size="md" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                        {isEdit ? 'Simpan Perubahan' : 'Terbitkan Banner'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Judul / Alt Text</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Contoh: Banner Promo Lebaran"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 text-sm"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                                required
                            />
                            <Button type="button" variant="outline">Upload</Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Link Redirect (Optional)</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            placeholder="/shop/category/hijab"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Posisi</label>
                            <select
                                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value as 'home_hero' | 'home_sidebar' | 'promo_page' })}
                            >
                                <option value="home_hero">Home Hero Slider</option>
                                <option value="home_sidebar">Home Sidebar</option>
                                <option value="promo_page">Halaman Promo</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Urutan Tampil</label>
                            <input
                                type="number"
                                className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500"
                                value={formData.sequence}
                                onChange={(e) => setFormData({ ...formData, sequence: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Tampilkan Banner</label>
                        </div>
                    </div>

                    {formData.image_url && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm relative h-40">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Preview</p>
                            <Image
                                src={formData.image_url}
                                alt="Preview"
                                fill
                                className="rounded object-contain bg-gray-50"
                            />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

'use client';

import { Category } from '@repo/shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { getAccessToken } from '@/lib/auth';

interface CategoryFormProps {
    initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Category>>(initialData || {
        name: '',
        slug: '',
        description: '',
        image: '',
    });

    const isEdit = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = getAccessToken();
            const method = isEdit ? 'PUT' : 'POST';
            const endpoint = isEdit ? `/api/admin/categories/${initialData?.id}` : '/api/admin/categories';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/categories');
                router.refresh();
            } else {
                alert('Gagal menyimpan kategori.');
            }
        } catch (error) {
            console.error('Submit category error:', error);
            alert('Terjadi kesalahan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEdit ? `Edit Kategori: ${initialData?.name}` : 'Tambah Kategori Baru'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola struktur pengelompokan produk untuk mempermudah pencarian pelanggan
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" size="md" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                        {isEdit ? 'Update Kategori' : 'Simpan Kategori'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Nama Kategori</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 font-medium"
                            value={formData.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setFormData({
                                    ...formData,
                                    name,
                                    slug: isEdit ? formData.slug : name.toLowerCase().replace(/ /g, '-')
                                });
                            }}
                            placeholder="Contoh: Hijab Square"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Category Slug</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-2.5 border bg-gray-50 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Deskripsi (Optional)</label>
                        <textarea
                            className="w-full rounded-lg border-gray-200 p-2.5 border focus:ring-primary-500 focus:border-primary-500 text-sm"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Jelaskan karakteristik produk dalam kategori ini..."
                        ></textarea>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b pb-2">Media & Status</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Gambar Kategori</label>
                            <div className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 text-center group hover:border-primary-500 transition-all cursor-pointer">
                                {formData.image ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-error-50 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFormData({ ...formData, image: '' });
                                            }}
                                        >✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-2xl text-gray-300 group-hover:text-primary-500">+</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-primary-500">Upload Image</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="text"
                                className="w-full text-xs rounded border-gray-200 p-2 mt-2"
                                placeholder="Atau tempel URL gambar..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={!!(formData as unknown as Record<string, unknown>).is_active !== false}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked } as unknown as Partial<Category>)}
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kategori Aktif</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

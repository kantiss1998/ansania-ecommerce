'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Attribute } from '@repo/shared';
import { getAccessToken } from '@/lib/auth';

interface AdminAttributesProps {
    attributes: Attribute[];
}

export default function AdminAttributesClient({ attributes }: AdminAttributesProps) {
    const [activeAttr, setActiveAttr] = useState<Attribute | null>(attributes[0] || null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddValue = async (attrId: number) => {
        // Mock implementation for adding a value
        const newValue = prompt('Masukkan nilai baru (contoh: Merah atau XL):');
        if (!newValue) return;

        try {
            setIsLoading(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attributes/${attrId}/values`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ label: newValue, value: newValue.toLowerCase().replace(/ /g, '_') }),
            });

            if (response.ok) {
                // Refresh logic here (simplified)
                alert('Nilai berhasil ditambahkan. Silakan refresh halaman.');
            }
        } catch (error) {
            console.error('Add attribute value error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Atribut Produk</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola varian global seperti warna, ukuran, dan jenis bahan
                    </p>
                </div>
                <Button variant="primary" size="md">+ Atribut Baru</Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Attribute List Sidebar */}
                <aside className="lg:w-64 space-y-2">
                    {attributes.map((attr) => (
                        <button
                            key={attr.id}
                            onClick={() => setActiveAttr(attr)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all ${activeAttr?.id === attr.id
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="font-semibold">{attr.name}</span>
                            <Badge variant={activeAttr?.id === attr.id ? 'info' : 'default'} className="bg-white/20 text-[10px]">
                                {attr.values?.length || 0}
                            </Badge>
                        </button>
                    ))}
                </aside>

                {/* Attribute Values Content */}
                <main className="flex-1">
                    {activeAttr ? (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h3 className="font-bold text-gray-900">Nilai Atribut: {activeAttr.name}</h3>
                                    <p className="text-xs text-gray-500">Kode: {activeAttr.code}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddValue(activeAttr.id)}
                                    isLoading={isLoading}
                                >
                                    + Tambah Nilai
                                </Button>
                            </div>

                            <div className="p-6">
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {activeAttr.values?.map((val) => (
                                        <div key={val.id} className="group relative flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-3">
                                                {activeAttr.code === 'color' && val.extra_data && (
                                                    <div
                                                        className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                                                        style={{ backgroundColor: val.extra_data }}
                                                    />
                                                )}
                                                <span className="text-sm font-medium text-gray-800">{val.label}</span>
                                            </div>
                                            <button className="text-gray-300 hover:text-error-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {(!activeAttr.values || activeAttr.values.length === 0) && (
                                        <div className="col-span-full py-12 text-center text-gray-400 italic">
                                            Belum ada nilai untuk atribut ini.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                                Tips: Atribut ini akan muncul sebagai opsi pilihan varian saat Anda membuat atau mengedit produk.
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400">Pilih atribut untuk mengelola nilainya</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Attribute } from '@repo/shared';
import { getAccessToken } from '@/lib/auth';

interface AdminAttributesProps {
    attributes: Attribute[];
}

export default function AdminAttributesClient({ attributes: initialAttributes }: AdminAttributesProps) {
    const [attributes, setAttributes] = useState(initialAttributes);
    const [activeAttr, setActiveAttr] = useState<Attribute | null>(initialAttributes[0] || null);
    const [isLoading, setIsLoading] = useState(false);

    const getEndpoint = (code: string) => {
        if (code === 'color') return 'colors';
        if (code === 'size') return 'sizes';
        if (code === 'finishing') return 'finishing';
        return '';
    };

    const handleEditHex = async (colorId: number, currentName: string, currentHex: string) => {
        const newHex = prompt(`Edit Hex Code untuk "${currentName}":`, currentHex || '#000000');
        if (!newHex || newHex === currentHex) return;

        try {
            setIsLoading(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attributes/colors/${colorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ hex_code: newHex }),
            });

            if (response.ok) {
                // Update local state
                setAttributes(prev => prev.map(attr => {
                    if (attr.code === 'color') {
                        return {
                            ...attr,
                            values: attr.values?.map(val =>
                                val.id === colorId ? { ...val, extra_data: newHex } : val
                            )
                        };
                    }
                    return attr;
                }));

                // Update active selection
                setActiveAttr(prev => {
                    if (!prev || prev.code !== 'color') return prev;
                    return {
                        ...prev,
                        values: prev.values?.map(val =>
                            val.id === colorId ? { ...val, extra_data: newHex } : val
                        )
                    };
                });
            } else {
                alert('Gagal mengupdate hex code.');
            }
        } catch (error) {
            console.error('Update hex error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddValue = async (attr: Attribute) => {
        const endpoint = getEndpoint(attr.code);
        if (!endpoint) return;

        const newValue = prompt(`Tambah ${attr.name} Baru:`);
        if (!newValue) return;

        let extraData = {};
        if (attr.code === 'color') {
            const hex = prompt('Masukkan Hex Code (contoh: #FFFFFF):', '#000000');
            if (hex) extraData = { hex_code: hex };
        }

        try {
            setIsLoading(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attributes/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newValue, ...extraData }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Gagal menambahkan nilai.');
            }
        } catch (error) {
            console.error('Add attribute value error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (attrCode: string, id: number) => {
        const endpoint = getEndpoint(attrCode);
        if (!endpoint || !confirm('Yakin ingin menghapus ini?')) return;

        try {
            setIsLoading(true);
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attributes/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Delete attribute error:', error);
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
                        Kelola warna, ukuran, dan jenis finishing produk
                    </p>
                </div>
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
                                    <h3 className="font-bold text-gray-900">List {activeAttr.name}</h3>
                                    <p className="text-xs text-gray-500">Klik pada warna untuk mengedit Hex Code</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddValue(activeAttr)}
                                    isLoading={isLoading}
                                >
                                    + Tambah Baru
                                </Button>
                            </div>

                            <div className="p-6">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {activeAttr.values?.map((val) => (
                                        <div
                                            key={val.id}
                                            className="group relative flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm transition-all"
                                        >
                                            <div
                                                className={`flex items-center gap-3 ${activeAttr.code === 'color' ? 'cursor-pointer' : ''}`}
                                                onClick={() => activeAttr.code === 'color' && handleEditHex(val.id, val.label, val.extra_data || '#000000')}
                                            >
                                                {activeAttr.code === 'color' && (
                                                    <div
                                                        className="h-6 w-6 rounded-md border border-gray-200 shadow-sm transition-transform group-hover:scale-110"
                                                        style={{ backgroundColor: val.extra_data || '#000000' }}
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{val.label}</span>
                                                    {activeAttr.code === 'color' && (
                                                        <span className="text-[10px] font-mono text-gray-400 group-hover:text-primary-600">
                                                            {val.extra_data || '#000000'} (Edit)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(activeAttr.code, val.id)}
                                                className="text-gray-300 hover:text-error-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            >
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

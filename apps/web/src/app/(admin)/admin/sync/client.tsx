'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SyncStatus, SyncLog } from '@repo/shared';
import { getAccessToken } from '@/lib/auth';

import Link from 'next/link';

interface AdminSyncProps {
    status: SyncStatus;
    recentLogs: SyncLog[];
}

export default function AdminSyncClient({ status, recentLogs }: AdminSyncProps) {
    const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

    const handleTriggerSync = async (type: string) => {
        try {
            setIsSyncing(prev => ({ ...prev, [type]: true }));
            const token = getAccessToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/sync/${type}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert(`Sinkronisasi ${type} telah dijadwalkan.`);
            } else {
                alert('Gagal memicu sinkronisasi.');
            }
        } catch (error) {
            console.error('Trigger sync error:', error);
        } finally {
            setIsSyncing(prev => ({ ...prev, [type]: false }));
        }
    };

    const syncItems = [
        { key: 'products', label: 'Produk & Terjemahan', icon: '🛍️', data: status.products },
        { key: 'stock', label: 'Stok Persediaan', icon: '📦', data: status.stock },
        { key: 'categories', label: 'Kategori & Struktur', icon: '📂', data: status.categories },
        { key: 'orders', label: 'Status Pesanan (Pusher)', icon: '🚚', data: status.orders },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Odoo ERP Synchronization</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Pantau dan kendalikan pertukaran data antara Website dan Odoo
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="md">Konfigurasi Odoo</Button>
                    <Button variant="primary" size="md" onClick={() => handleTriggerSync('all')}>Sinkronkan Semua</Button>
                </div>
            </div>

            {/* Sync Status Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {syncItems.map((item) => (
                    <div key={item.key} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-2xl">{item.icon}</span>
                            <Badge variant={item.data.status === 'idle' ? 'success' : item.data.status === 'running' ? 'info' : 'error'}>
                                {item.data.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-gray-900">{item.label}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Terakhir: {new Date(item.data.last_sync).toLocaleString()}</p>
                        </div>
                        <Button
                            className="mt-6 w-full"
                            size="sm"
                            variant="outline"
                            onClick={() => handleTriggerSync(item.key)}
                            isLoading={isSyncing[item.key]}
                        >
                            Sync Sekarang
                        </Button>
                    </div>
                ))}
            </div>

            {/* Recent Logs Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Riwayat Sinkronisasi Terakhir</h3>
                    <Link href="/admin/sync/logs" className="text-xs font-bold text-primary-600 hover:underline">Lihat Semua Log</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-3">Waktu</th>
                                <th className="px-6 py-3">Entitas</th>
                                <th className="px-6 py-3">Aksi</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Pesan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.entity_type} {log.entity_id && `(#${log.entity_id})`}</td>
                                    <td className="px-6 py-4 capitalize text-gray-600">{log.action}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={log.status === 'success' ? 'success' : 'error'}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{log.message}</td>
                                </tr>
                            ))}
                            {recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 italic">Belum ada riwayat sinkronisasi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

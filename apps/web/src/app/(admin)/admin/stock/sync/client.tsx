'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface SyncLog {
    id: number;
    sync_type: 'manual' | 'auto';
    status: 'success' | 'failed' | 'in_progress';
    products_synced: number;
    errors_count: number;
    started_at: string;
    completed_at?: string;
    error_message?: string;
}

export default function AdminStockSyncClient() {
    const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    useEffect(() => {
        fetchSyncLogs();
    }, []);

    const fetchSyncLogs = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: { logs: SyncLog[]; last_sync: string } }>(
                '/admin/stock/sync/logs'
            );
            setSyncLogs(response.data.data.logs || []);
            setLastSync(response.data.data.last_sync);
        } catch (error) {
            console.error('Failed to fetch sync logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerSync = async () => {
        if (!confirm('Sinkronisasi stok dari Odoo? Proses ini mungkin memakan waktu beberapa menit.')) {
            return;
        }

        setIsSyncing(true);
        try {
            await apiClient.post('/admin/stock/sync');
            alert('Sinkronisasi dimulai. Refresh halaman untuk melihat progress.');
            fetchSyncLogs();
        } catch (error) {
            console.error('Failed to trigger sync:', error);
            alert('Gagal memulai sinkronisasi');
        } finally {
            setIsSyncing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Stock Synchronization</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Sinkronisasi stok produk dengan Odoo
                        </p>
                        {lastSync && (
                            <p className="mt-2 text-xs text-gray-500">
                                Last sync: {new Date(lastSync).toLocaleString('id-ID')}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="primary"
                        onClick={triggerSync}
                        isLoading={isSyncing}
                    >
                        🔄 Sync Now
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Sync History</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sync ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Products Synced</TableHead>
                            <TableHead>Errors</TableHead>
                            <TableHead>Started At</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {syncLogs.length > 0 ? (
                            syncLogs.map((log) => {
                                const duration = log.completed_at
                                    ? Math.round((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000)
                                    : null;

                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-sm">#{log.id}</TableCell>
                                        <TableCell>
                                            <Badge variant={log.sync_type === 'manual' ? 'info' : 'default'}>
                                                {log.sync_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{log.products_synced}</TableCell>
                                        <TableCell>
                                            {log.errors_count > 0 ? (
                                                <span className="text-error-600 font-medium">{log.errors_count}</span>
                                            ) : (
                                                <span className="text-gray-400">0</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(log.started_at).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {duration !== null ? `${duration}s` : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                log.status === 'success' ? 'success' :
                                                    log.status === 'failed' ? 'error' :
                                                        'warning'
                                            }>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                    Belum ada riwayat sinkronisasi.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informasi Sinkronisasi</h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• Sinkronisasi akan mengambil data stok terbaru dari Odoo</p>
                    <p>• Proses sinkronisasi berjalan di background dan mungkin memakan waktu beberapa menit</p>
                    <p>• Sinkronisasi otomatis berjalan setiap 1 jam sekali</p>
                    <p>• Anda dapat memicu sinkronisasi manual kapan saja dengan tombol "Sync Now"</p>
                </div>
            </div>
        </div>
    );
}

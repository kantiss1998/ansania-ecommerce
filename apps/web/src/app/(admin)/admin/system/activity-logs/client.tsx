'use client';

import { Suspense } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { PaginatedResponse } from '@repo/shared';

interface AdminActivityLogsClientProps {
    initialData: PaginatedResponse<any> | null;
}

function AdminActivityLogsContent({ initialData }: AdminActivityLogsClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Audit Trail: Pantau seluruh aktivitas administrator dan sistem
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Waktu</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Aksi</TableHead>
                            <TableHead>Entitas</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((log: any) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {log.user?.full_name || 'System'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        <span className="font-semibold">{log.entity_type}</span> {log.entity_id ? `#${log.entity_id}` : ''}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === 'success' ? 'success' : 'error'}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-400">
                                        {log.ip_address || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Tidak ada data log aktivitas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function AdminActivityLogsClient({ initialData }: AdminActivityLogsClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat audit trail...</div>}>
            <AdminActivityLogsContent initialData={initialData} />
        </Suspense>
    );
}

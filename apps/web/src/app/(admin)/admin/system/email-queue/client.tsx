'use client';

import { PaginatedResponse } from '@repo/shared';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface AdminEmailQueueClientProps {
    initialData: PaginatedResponse<any> | null;
}

function AdminEmailQueueContent({ initialData }: AdminEmailQueueClientProps) {
    const handleRetry = async (id: number) => {
        // Logic to retry email sending would go here
        alert('Retry request sent for email ID ' + id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Email Queue</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Monitor status pengiriman email sistem (transaksional, otp, promosi)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="md">
                        Clear Sent Logs
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Waktu Antre</TableHead>
                            <TableHead>Penerima</TableHead>
                            <TableHead>Subjek</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((email: any) => (
                                <TableRow key={email.id}>
                                    <TableCell className="text-xs text-gray-500">
                                        {new Date(email.created_at).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900">
                                        {email.recipient_email}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600 max-w-xs truncate" title={email.subject}>
                                        {email.subject}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[10px] bg-gray-100 px-1 py-0.5 rounded italic">{email.template_name}</code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            email.status === 'sent' ? 'success' :
                                                email.status === 'pending' ? 'info' :
                                                    'error'
                                        }>
                                            {email.status}
                                        </Badge>
                                        {email.retry_count > 0 && (
                                            <span className="ml-2 text-[10px] text-gray-400">({email.retry_count} retries)</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {email.status !== 'sent' && (
                                            <Button variant="outline" size="sm" onClick={() => handleRetry(email.id)}>
                                                Retry
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Tidak ada data antrean email.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function AdminEmailQueueClient({ initialData }: AdminEmailQueueClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat antrean email...</div>}>
            <AdminEmailQueueContent initialData={initialData} />
        </Suspense>
    );
}

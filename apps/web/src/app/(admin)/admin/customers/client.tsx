'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { User, PaginatedResponse } from '@repo/shared';
import Link from 'next/link';

interface AdminCustomersClientProps {
    initialData: PaginatedResponse<User> | null;
}

function AdminCustomersContent({ initialData }: AdminCustomersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/admin/customers?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Pelanggan</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola data pelanggan dan riwayat aktivitas mereka
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="md">
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                    <Input
                        label="Cari Pelanggan"
                        type="text"
                        placeholder="Nama, email atau nomor telepon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="mt-8">
                        <Button onClick={handleSearch} variant="secondary">Cari</Button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>No. Telepon</TableHead>
                            <TableHead>Odoo ID</TableHead>
                            <TableHead>Bergabung</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData?.items && initialData.items.length > 0 ? (
                            initialData.items.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium text-gray-900">
                                        {customer.full_name || 'Tanpa Nama'}
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="default" className="bg-gray-100 text-gray-700">
                                            {customer.odoo_user_id}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(customer.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={customer.email_verified ? 'success' : 'warning'}>
                                            {customer.email_verified ? 'Terverifikasi' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={`/admin/customers/${customer.id}`}>
                                            <Button variant="outline" size="sm">Detail</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                    {initialData ? 'Tidak ada pelanggan ditemukan' : 'Gagal memuat data pelanggan'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {initialData?.pagination && initialData.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
                        <p className="text-sm text-gray-700">
                            Menampilkan halaman <span className="font-medium">{initialData.pagination.page}</span> dari <span className="font-medium">{initialData.pagination.totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={initialData.pagination.page <= 1}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (initialData.pagination.page - 1).toString());
                                    router.push(`/admin/customers?${params.toString()}`);
                                }}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={initialData.pagination.page >= initialData.pagination.totalPages}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('page', (initialData.pagination.page + 1).toString());
                                    router.push(`/admin/customers?${params.toString()}`);
                                }}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminCustomersClient({ initialData }: AdminCustomersClientProps) {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat data pelanggan...</div>}>
            <AdminCustomersContent initialData={initialData} />
        </Suspense>
    );
}

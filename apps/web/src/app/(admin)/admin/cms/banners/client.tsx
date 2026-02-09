'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Banner } from '@repo/shared';
import adminCmsService from '@/services/adminCmsService';

interface BannersClientProps {
    initialData: Banner[];
}

function BannersContent({ initialData }: BannersClientProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return;

        setIsDeleting(id);
        try {
            await adminCmsService.deleteBanner(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete banner:', error);
            alert('Gagal menghapus banner');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Banner Management</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Atur banner promosi di halaman utama
                    </p>
                </div>
                <Link href="/admin/cms/banners/create">
                    <Button variant="primary">
                        + Tambah Banner
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Posisi</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length > 0 ? (
                            initialData.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                        <div className="h-12 w-24 overflow-hidden rounded bg-gray-100">
                                            <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-900">{banner.title}</div>
                                        <div className="text-xs text-gray-500">{banner.link_url}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="capitalize">{banner.position.replace('_', ' ')}</span>
                                    </TableCell>
                                    <TableCell>{banner.sequence}</TableCell>
                                    <TableCell>
                                        {banner.is_active ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                                                Non-aktif
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/cms/banners/${banner.id}`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-error-600 hover:bg-error-50"
                                                isLoading={isDeleting === banner.id}
                                                onClick={() => handleDelete(banner.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                                    Belum ada banner.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function BannersClient({ initialData }: BannersClientProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BannersContent initialData={initialData} />
        </Suspense>
    );
}

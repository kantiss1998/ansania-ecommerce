'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface WorstPerformer {
    product_id: number;
    product_name: string;
    product_slug: string;
    product_image?: string;
    total_sold: number;
    total_revenue: number;
    stock_remaining: number;
    days_since_last_sale: number;
}

export default function AdminWorstPerformersClient() {
    const [products, setProducts] = useState<WorstPerformer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'30days' | '90days' | 'all'>('90days');

    useEffect(() => {
        fetchWorstPerformers();
    }, [period]);

    const fetchWorstPerformers = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: WorstPerformer[] }>(
                `/admin/reports/products/worst-performers?period=${period}`
            );
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch worst performers:', error);
        } finally {
            setIsLoading(false);
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
                        <h2 className="text-xl font-semibold text-gray-900">Worst Performers</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Produk dengan penjualan terendah yang perlu perhatian
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === '30days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('30days')}
                        >
                            30 Hari
                        </Button>
                        <Button
                            variant={period === '90days' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('90days')}
                        >
                            90 Hari
                        </Button>
                        <Button
                            variant={period === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('all')}
                        >
                            Semua
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead>Total Terjual</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Stock Tersisa</TableHead>
                            <TableHead>Last Sale</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {product.product_image && (
                                                <img
                                                    src={product.product_image}
                                                    alt=""
                                                    className="h-12 w-12 rounded object-cover border border-gray-100"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{product.product_name}</p>
                                                <p className="text-xs text-gray-500">{product.product_slug}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-error-600">
                                            {product.total_sold} unit
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        Rp {product.total_revenue.toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>{product.stock_remaining}</TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {product.days_since_last_sale > 0
                                            ? `${product.days_since_last_sale} hari lalu`
                                            : 'Belum pernah terjual'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {product.days_since_last_sale > 90 ? (
                                            <Badge variant="error">Sangat Lambat</Badge>
                                        ) : product.days_since_last_sale > 60 ? (
                                            <Badge variant="warning">Lambat</Badge>
                                        ) : (
                                            <Badge variant="default">Perlu Perhatian</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/products/${product.product_id}`}>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-500">
                                    Semua produk berkinerja baik!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

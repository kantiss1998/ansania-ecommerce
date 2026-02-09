'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface ProductViewStat {
    product_id: number;
    product_name: string;
    product_slug: string;
    view_count: number;
    unique_viewers: number;
}

export default function AdminProductViewsClient() {
    const [data, setData] = useState<ProductViewStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProductViews();
    }, []);

    const fetchProductViews = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: ProductViewStat[] }>('/admin/analytics/product-views');
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch product views:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Memuat data views...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Product Views Analytics</h1>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Total Views</TableHead>
                            <TableHead className="text-right">Unique Viewers</TableHead>
                            <TableHead>Popularity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.product_id}>
                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                <TableCell className="text-right">{item.view_count}</TableCell>
                                <TableCell className="text-right">{item.unique_viewers}</TableCell>
                                <TableCell>
                                    <div className="h-2 w-24 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500"
                                            style={{ width: `${Math.min(100, item.view_count / 10)}%` }}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

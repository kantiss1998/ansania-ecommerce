'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import apiClient from '@/lib/api';

interface SearchStat {
    keyword: string;
    count: number;
    results_count: number;
}

export default function AdminSearchAnalyticsClient() {
    const [data, setData] = useState<SearchStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSearchAnalytics();
    }, []);

    const fetchSearchAnalytics = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<{ data: SearchStat[] }>('/admin/analytics/search-analytics');
            setData(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch search analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Memuat data pencarian...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Search Keywords Analytics</h1>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kata Kunci</TableHead>
                            <TableHead className="text-right">Jumlah Pencarian</TableHead>
                            <TableHead className="text-right">Hasil Ditemukan (Avg)</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{item.keyword}</TableCell>
                                <TableCell className="text-right">{item.count}</TableCell>
                                <TableCell className="text-right">{item.results_count}</TableCell>
                                <TableCell>
                                    {item.results_count === 0 ? (
                                        <span className="text-error-600 text-xs font-bold">MISSING PRODUCTS</span>
                                    ) : (
                                        <span className="text-success-600 text-xs font-bold">OPTIMIZED</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

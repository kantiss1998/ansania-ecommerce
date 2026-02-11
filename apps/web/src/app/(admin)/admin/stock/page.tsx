import { StockItem, PaginatedResponse } from '@repo/shared';
import { cookies } from 'next/headers';

import AdminStockClient from './client';

export const dynamic = 'force-dynamic';

async function getStock(searchParams: { page?: string; search?: string; type?: string }): Promise<PaginatedResponse<StockItem> | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        let endpoint = '/admin/stock';
        if (searchParams.type === 'low_stock') {
            endpoint = '/admin/stock/low-stock';
        } else if (searchParams.type === 'out_of_stock') {
            endpoint = '/admin/stock/out-of-stock';
        }

        const query = new URLSearchParams({
            page: searchParams.page || '1',
            limit: '20',
            ...(searchParams.search && { search: searchParams.search }),
        });

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}${endpoint}?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch stock:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching stock:', error);
        return null;
    }
}

export default async function AdminStockPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}) {
    const resolvedParams = await searchParams;
    const stockData = await getStock(resolvedParams);

    return <AdminStockClient initialData={stockData} />;
}

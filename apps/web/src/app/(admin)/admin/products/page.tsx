import { Product, PaginatedResponse } from '@repo/shared';
import { cookies } from 'next/headers';

import AdminProductsClient from './client';

export const dynamic = 'force-dynamic';

async function getProducts(searchParams: { page?: string; search?: string; category?: string }): Promise<PaginatedResponse<Product> | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const query = new URLSearchParams({
            page: searchParams.page || '1',
            limit: '20',
            ...(searchParams.search && { search: searchParams.search }),
            ...(searchParams.category && { category: searchParams.category }),
        });

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/admin/products?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch products:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
    const resolvedParams = await searchParams;
    const productsData = await getProducts(resolvedParams);

    return <AdminProductsClient initialData={productsData} />;
}

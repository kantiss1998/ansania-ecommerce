import { User, PaginatedResponse } from '@repo/shared';
import { cookies } from 'next/headers';

import AdminCustomersClient from './client';

export const dynamic = 'force-dynamic';

async function getCustomers(searchParams: { page?: string; search?: string }): Promise<PaginatedResponse<User> | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const query = new URLSearchParams({
            page: searchParams.page || '1',
            limit: '20',
            ...(searchParams.search && { search: searchParams.search }),
        });

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/admin/customers?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch customers:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        return null;
    }
}

export default async function AdminCustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const resolvedParams = await searchParams;
    const customersData = await getCustomers(resolvedParams);

    return <AdminCustomersClient initialData={customersData} />;
}

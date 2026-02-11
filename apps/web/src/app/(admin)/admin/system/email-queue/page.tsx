import { cookies } from 'next/headers';

import AdminEmailQueueClient from './client';

export const dynamic = 'force-dynamic';

async function getEmailQueue(params: { page?: string; search?: string }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const query = new URLSearchParams({
            page: params.page || '1',
            search: params.search || '',
            limit: '20'
        }).toString();

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/admin/system/email-queue?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching email queue:', error);
        return null;
    }
}

export default async function AdminEmailQueuePage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const resolvedParams = await searchParams;
    const emailData = await getEmailQueue(resolvedParams);

    return <AdminEmailQueueClient initialData={emailData} />;
}

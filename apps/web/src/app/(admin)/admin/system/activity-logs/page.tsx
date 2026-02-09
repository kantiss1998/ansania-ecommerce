import { cookies } from 'next/headers';
import AdminActivityLogsClient from './client';

export const dynamic = 'force-dynamic';

async function getActivityLogs(params: { page?: string; search?: string }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const query = new URLSearchParams({
            page: params.page || '1',
            search: params.search || '',
            limit: '20'
        }).toString();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/system/activity-logs?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return null;
    }
}

export default async function AdminActivityLogsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const resolvedParams = await searchParams;
    const logsData = await getActivityLogs(resolvedParams);

    return <AdminActivityLogsClient initialData={logsData} />;
}

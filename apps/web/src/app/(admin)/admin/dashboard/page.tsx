import { DashboardStats } from '@repo/shared';
import { cookies } from 'next/headers';

import AdminDashboardClient from './client';

export const dynamic = 'force-dynamic';

async function getDashboardStats(): Promise<DashboardStats | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/admin/dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!response.ok) {
            console.error('Failed to fetch dashboard stats:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
    }
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return <AdminDashboardClient initialStats={stats} />;
}

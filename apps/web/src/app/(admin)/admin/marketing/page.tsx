import { cookies } from 'next/headers';
import AdminMarketingClient from './client';

export const dynamic = 'force-dynamic';

async function getMarketingStats() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [abandonedRes, analyticsRes] = await Promise.all([
            fetch(`${baseUrl}/api/admin/analytics/abandoned-carts`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/api/admin/analytics/conversion`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        const abandonedCarts = abandonedRes.ok ? (await abandonedRes.json()).data : null;
        const conversion = analyticsRes.ok ? (await analyticsRes.json()).data : null;

        return { abandonedCarts, conversion };
    } catch (error) {
        console.error('Error fetching marketing stats:', error);
        return null;
    }
}

export default async function AdminMarketingPage() {
    const stats = await getMarketingStats();

    return <AdminMarketingClient initialStats={stats} />;
}

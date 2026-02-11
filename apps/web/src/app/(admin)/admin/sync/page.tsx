import { cookies } from 'next/headers';

import AdminSyncClient from './client';

export const dynamic = 'force-dynamic';

async function getSyncData() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return { status: null, logs: [] };

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

        const [statusRes, logsRes] = await Promise.all([
            fetch(`${baseUrl}/admin/sync/status`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/admin/sync/logs?limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        const status = statusRes.ok ? (await statusRes.json()).data : {
            products: { last_sync: new Date().toISOString(), status: 'idle' },
            stock: { last_sync: new Date().toISOString(), status: 'idle' },
            categories: { last_sync: new Date().toISOString(), status: 'idle' },
            orders: { last_sync: new Date().toISOString(), status: 'idle' }
        };
        const logs = logsRes.ok ? (await logsRes.json()).data : [];

        return { status, logs };
    } catch (error) {
        console.error('Error fetching sync data:', error);
        return { status: null, logs: [] };
    }
}

export default async function AdminSyncPage() {
    const { status, logs } = await getSyncData();

    if (!status) {
        return <div className="p-12 text-center text-gray-500">Gagal memuat status sinkronisasi.</div>;
    }

    return (
        <div className="container mx-auto">
            <AdminSyncClient status={status} recentLogs={logs} />
        </div>
    );
}

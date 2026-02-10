import { cookies } from 'next/headers';
import AdminReportsClient from './client';

export const dynamic = 'force-dynamic';

async function getReportsOverview() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

        const [salesRes, customersRes, inventoryRes] = await Promise.all([
            fetch(`${baseUrl}/admin/reports/sales?period=this_month`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/admin/reports/customers?period=this_month`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/admin/reports/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        const sales = salesRes.ok ? (await salesRes.json()).data : null;
        const customers = customersRes.ok ? (await customersRes.json()).data : null;
        const inventory = inventoryRes.ok ? (await inventoryRes.json()).data : null;

        return { sales, customers, inventory };
    } catch (error) {
        console.error('Error fetching reports overview:', error);
        return null;
    }
}

export default async function AdminReportsPage() {
    const data = await getReportsOverview();

    return <AdminReportsClient initialData={data} />;
}

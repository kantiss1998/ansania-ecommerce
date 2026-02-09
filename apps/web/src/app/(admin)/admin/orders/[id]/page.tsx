import { cookies } from 'next/headers';
import AdminOrderDetailClient from './client';

export const dynamic = 'force-dynamic';

async function getOrderDetails(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/admin/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}

export default async function AdminOrderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const order = await getOrderDetails(resolvedParams.id);

    if (!order) {
        return (
            <div className="p-8 text-center text-gray-500">
                Pesanan tidak ditemukan atau terjadi kesalahan saat mengambil data.
            </div>
        );
    }

    return <AdminOrderDetailClient order={order} />;
}

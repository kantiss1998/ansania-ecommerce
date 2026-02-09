import AdminDailySalesClient from './client';

export const dynamic = 'force-dynamic';

export default function AdminDailySalesPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <AdminDailySalesClient />
        </div>
    );
}

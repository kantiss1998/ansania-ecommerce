import AdminSearchAnalyticsClient from './client';

export const dynamic = 'force-dynamic';

export default function AdminSearchAnalyticsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <AdminSearchAnalyticsClient />
        </div>
    );
}

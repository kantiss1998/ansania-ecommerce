import AdminProductViewsClient from './client';

export const dynamic = 'force-dynamic';

export default function AdminProductViewsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <AdminProductViewsClient />
        </div>
    );
}

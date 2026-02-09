import adminCmsService from '@/services/adminCmsService';
import PagesClient from './client';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
    const pages = await adminCmsService.getAllPages();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <PagesClient initialData={pages} />
        </div>
    );
}

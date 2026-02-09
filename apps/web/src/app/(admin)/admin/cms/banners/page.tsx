import adminCmsService from '@/services/adminCmsService';
import BannersClient from './client';

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
    const banners = await adminCmsService.getAllBanners();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <BannersClient initialData={banners} />
        </div>
    );
}

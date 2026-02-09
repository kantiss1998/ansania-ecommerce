import { cookies } from 'next/headers';
import AdminBannersClient from './client';
import { Banner } from '@repo/shared';

export const dynamic = 'force-dynamic';

async function getBanners(): Promise<Banner[] | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/cms/banners`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch banners:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        return null;
    }
}

export default async function AdminBannersPage() {
    const banners = await getBanners();

    return <AdminBannersClient initialData={banners} />;
}

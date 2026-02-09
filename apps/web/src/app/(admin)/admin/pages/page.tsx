import { cookies } from 'next/headers';
import AdminPagesClient from './client';
import { CMSPage } from '@repo/shared';

export const dynamic = 'force-dynamic';

async function getPages(): Promise<CMSPage[] | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/cms/pages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            console.error('Failed to fetch pages:', response.statusText);
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching pages:', error);
        return null;
    }
}

export default async function AdminPagesPage() {
    const pages = await getPages();

    return <AdminPagesClient initialData={pages} />;
}

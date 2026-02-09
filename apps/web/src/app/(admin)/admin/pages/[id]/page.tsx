import { cookies } from 'next/headers';
import { CMSPageForm } from '@/components/features/admin/CMSPageForm';

export const dynamic = 'force-dynamic';

async function getCMSPage(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/admin/cms/pages/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching CMS page:', error);
        return null;
    }
}

export default async function EditCMSPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const page = await getCMSPage(resolvedParams.id);

    if (!page) {
        return <div className="p-8 text-center text-gray-500">Halaman tidak ditemukan.</div>;
    }

    return (
        <div className="container mx-auto">
            <CMSPageForm initialData={page} />
        </div>
    );
}

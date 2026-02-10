import { cookies } from 'next/headers';
import { BannerForm } from '@/components/features/admin/BannerForm';

export const dynamic = 'force-dynamic';

async function getBanner(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/admin/cms/banners/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        return null;
    }
}

export default async function EditBannerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const banner = await getBanner(resolvedParams.id);

    if (!banner) {
        return <div className="p-8 text-center text-gray-500">Banner tidak ditemukan.</div>;
    }

    return (
        <div className="container mx-auto">
            <BannerForm initialData={banner} />
        </div>
    );
}

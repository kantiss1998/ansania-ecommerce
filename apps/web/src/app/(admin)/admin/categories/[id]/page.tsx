import { cookies } from 'next/headers';
import { CategoryForm } from '@/components/features/admin/CategoryForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCategory(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/admin/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return null;

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const category = await getCategory(resolvedParams.id);

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto">
            <CategoryForm initialData={category} />
        </div>
    );
}

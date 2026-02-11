import { cookies } from 'next/headers';

import { ProductForm } from '@/components/features/admin/ProductForm';

export const dynamic = 'force-dynamic';

async function getProductAndCategories(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

        if (!token) return { product: null, categories: [] };

        const [productRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        let product = null;
        if (productRes.ok) {
            const data = await productRes.json();
            product = data.data;
        } else {
            const errorText = await productRes.text();
            console.error(`[Admin] Product fetch error: ${errorText}`);
        }

        let categories = [];
        if (categoriesRes.ok) {
            const data = await categoriesRes.json();
            categories = data.data;
        }

        return { product, categories };
    } catch (error) {
        console.error('Error fetching product edit data:', error);
        return { product: null, categories: [] };
    }
}

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const { product, categories } = await getProductAndCategories(resolvedParams.id);

    if (!product) {
        return <div className="p-8 text-center text-gray-500">Produk tidak ditemukan.</div>;
    }

    return (
        <div className="container mx-auto">
            <ProductForm initialData={product} categories={categories} />
        </div>
    );
}

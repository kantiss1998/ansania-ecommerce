import { cookies } from 'next/headers';
import { ProductForm } from '@/components/features/admin/ProductForm';

export const dynamic = 'force-dynamic';

async function getProductAndCategories(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return { product: null, categories: [] };

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [productRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        const product = productRes.ok ? (await productRes.ok ? await productRes.json() : null)?.data : null;
        const categories = categoriesRes.ok ? (await categoriesRes.json()).data : [];

        // Re-read category data if nested
        const resolvedProduct = product;

        return { product: resolvedProduct, categories };
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

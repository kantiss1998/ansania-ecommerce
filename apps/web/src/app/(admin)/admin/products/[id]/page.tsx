import { cookies } from 'next/headers';
import { ProductForm } from '@/components/features/admin/ProductForm';

export const dynamic = 'force-dynamic';

async function getProductAndCategories(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

        if (!token) return { product: null, categories: [] };

        console.log(`[DEBUG] Fetching product detail for ID: ${id}`);
        const [productRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${baseUrl}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ]);

        console.log(`[DEBUG] Product Res Status: ${productRes.status}`);
        console.log(`[DEBUG] Categories Res Status: ${categoriesRes.status}`);

        let product = null;
        if (productRes.ok) {
            const data = await productRes.json();
            product = data.data;
            console.log(`[DEBUG] Product data found: ${!!product}`);
        } else {
            const errorText = await productRes.text();
            console.error(`[DEBUG] Product fetch error: ${errorText}`);
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

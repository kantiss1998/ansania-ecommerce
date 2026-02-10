import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getCategoryData(slug: string) {
    try {
        const category = await categoryService.getCategoryBySlug(slug);
        const productsRes = await productService.getProducts({ category: slug, limit: 20 });
        return { category, products: productsRes.items };
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getCategoryData(slug);

    if (!data) return { title: 'Category Not Found' };

    return {
        title: `${data.category.name} | Ansania`,
        description: data.category.description || `Lihat koleksi ${data.category.name} terbaik di Ansania.`,
    };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCategoryData(slug);

    if (!data) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Hero / Header */}
                <div className="mb-12 rounded-3xl bg-primary-900 p-8 text-white md:p-16">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold md:text-5xl">
                            {data.category.name}
                        </h1>
                        {data.category.description && (
                            <p className="mt-4 text-lg text-primary-100/80 leading-relaxed">
                                {data.category.description}
                            </p>
                        )}
                        <div className="mt-8 flex items-center gap-2 text-sm text-primary-200">
                            <span>Beranda</span>
                            <span>/</span>
                            <span>Kategori</span>
                            <span>/</span>
                            <span className="font-bold text-white uppercase tracking-tighter">{data.category.name}</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Content */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Semua Produk</h2>
                        <p className="text-sm text-gray-500">{data.products.length} produk ditemukan</p>
                    </div>

                    {data.products.length > 0 ? (
                        <ProductGrid products={data.products} />
                    ) : (
                        <div className="py-24 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                            <p className="text-xl text-gray-500 italic">Belum ada produk di kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

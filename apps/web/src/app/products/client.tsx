'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { ProductFilters, FilterOptions } from '@/components/features/product/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { productService, Product } from '@/services/productService';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getProducts({
                    search: searchParams.get('q') || undefined,
                });
                setProducts(response.items);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const handleFilterChange = (filters: FilterOptions) => {
        const params = new URLSearchParams(searchParams);

        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('colors');
        params.delete('sizes');
        params.delete('finishings');
        params.delete('stock_status');

        if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
        if (filters.colors) params.set('colors', filters.colors.join(','));
        if (filters.sizes) params.set('sizes', filters.sizes.join(','));
        if (filters.finishings) params.set('finishings', filters.finishings.join(','));
        if (filters.stock_status) params.set('stock_status', filters.stock_status);

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Semua Produk
                </h1>
                <p className="mt-2 text-gray-600">
                    Temukan furnitur berkualitas untuk rumah Anda
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <aside className="lg:col-span-1">
                    <div className="sticky top-20">
                        <ProductFilters
                            onFilterChange={handleFilterChange}
                            availableColors={['Putih', 'Hitam', 'Coklat', 'Abu-abu']}
                            availableSizes={['Small', 'Medium', 'Large', 'XL']}
                            availableFinishings={['Glossy', 'Matte', 'Natural']}
                        />
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {products.length} produk
                        </p>
                        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700">
                            <option value="newest">Terbaru</option>
                            <option value="price_low">Harga: Rendah ke Tinggi</option>
                            <option value="price_high">Harga: Tinggi ke Rendah</option>
                            <option value="popular">Terpopuler</option>
                            <option value="rating">Rating Tertinggi</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            Loading...
                        </div>
                    ) : (
                        <ProductGrid products={products} />
                    )}

                    <div className="mt-8">
                        <Pagination
                            currentPage={1}
                            totalPages={3}
                            onPageChange={(page) => console.log('Change page to', page)}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function ProductsClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}

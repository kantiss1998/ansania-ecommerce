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
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 12 });

    // Attribute options state
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [finishings, setFinishings] = useState<string[]>([]);

    useEffect(() => {
        // Fetch attribute options
        const fetchAttributes = async () => {
            try {
                const [colorsData, sizesData, finishingsData] = await Promise.all([
                    productService.getColors(),
                    productService.getSizes(),
                    productService.getFinishings()
                ]);
                setColors(colorsData);
                setSizes(sizesData);
                setFinishings(finishingsData);
            } catch (error) {
                console.error('Failed to fetch attributes:', error);
            }
        };

        fetchAttributes();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getProducts({
                    search: searchParams.get('q') || undefined,
                    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
                    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
                    category: searchParams.get('category') || undefined,
                    // Pass attributes if service/backend supports them
                    // Assuming backend accepts these as query params
                    sort: searchParams.get('sort') || undefined,
                    page: Number(searchParams.get('page')) || 1,
                    limit: 12,
                } as any); // Type assertion to bypass strict typing if needed for extra params like colors

                // We need to inject color/size/finishing manually if they are not in ProductListParams
                // Note: The service might need update if it filters out unknown params.
                // Assuming service uses { ...params } spread, we can pass them.

                setProducts(response.items || []);
                if (response.meta) {
                    setPagination({
                        page: response.meta.page,
                        totalPages: response.meta.totalPages,
                        total: response.meta.total,
                        limit: response.meta.limit
                    });
                }
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
                            availableColors={colors}
                            availableSizes={sizes}
                            availableFinishings={finishings}
                        />
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {products?.length || 0} produk
                        </p>
                        <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700"
                            value={searchParams.get('sort') || 'newest'}
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams);
                                params.set('sort', e.target.value);
                                router.push(`/products?${params.toString()}`);
                            }}
                        >
                            <option value="newest">Terbaru</option>
                            <option value="price_asc">Harga: Rendah ke Tinggi</option>
                            <option value="price_desc">Harga: Tinggi ke Rendah</option>
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
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', page.toString());
                                router.push(`/products?${params.toString()}`);
                            }}
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

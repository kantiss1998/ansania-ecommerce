'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { ProductFilters, FilterOptions } from '@/components/features/product/ProductFilters';
import { productService, Product } from '@/services/productService';
import { Pagination } from '@/components/ui/Pagination';

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await productService.getProducts({
                    search: query,
                    page: Number(searchParams.get('page')) || 1,
                    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
                    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
                    sort: searchParams.get('sort') || undefined,
                    limit: 12
                });

                setProducts(response.items);
                setPagination({
                    page: response.meta.page,
                    totalPages: response.meta.totalPages,
                    total: response.meta.total
                });

                // Record search stats
                productService.recordSearch(query, {}, response.meta.total);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchParams, query]);

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
        if (filters.stock_status) params.set('stock_status', filters.stock_status);

        params.set('page', '1');
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <nav className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Beranda</Link>
                    <span>/</span>
                    <span className="text-gray-900">Hasil Pencarian</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Pencarian: <span className="text-primary-700 italic">"{query}"</span>
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Menemukan {pagination.total} produk yang sesuai
                        </p>
                    </div>
                    {products.length > 0 && (
                        <select
                            className="w-full md:w-48 rounded-lg border-gray-200 p-2.5 text-sm font-medium border focus:ring-primary-500 focus:border-primary-500"
                            value={searchParams.get('sort') || 'newest'}
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams);
                                params.set('sort', e.target.value);
                                router.push(`/search?${params.toString()}`);
                            }}
                        >
                            <option value="newest">Terbaru</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                        <ProductFilters
                            onFilterChange={handleFilterChange}
                            availableColors={[]} // Fetch if needed
                            availableSizes={[]}
                            availableFinishings={[]}
                        />
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="aspect-[3/4] rounded-2xl bg-gray-100" />
                                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                                    <div className="h-4 w-1/2 rounded bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-24 text-center">
                            <div className="mb-6 rounded-full bg-white p-6 shadow-sm">
                                <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Maaf, tidak ada hasil ditemukan</h2>
                            <p className="mt-2 text-gray-600">Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda.</p>
                            <Button
                                variant="primary"
                                size="md"
                                className="mt-8"
                                onClick={() => router.push('/products')}
                            >
                                Lihat Semua Produk
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={products} />
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(page) => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('page', page.toString());
                                        router.push(`/search?${params.toString()}`);
                                    }}
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-12 text-center text-gray-400">Mencari produk...</div>}>
            <SearchContent />
        </Suspense>
    );
}

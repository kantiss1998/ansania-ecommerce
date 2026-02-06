'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/features/product/ProductGrid';
import { ProductFilters, FilterOptions } from '@/components/features/product/ProductFilters';
import { useRouter } from 'next/navigation';
// import { Product } from '@/store/listingStore'; // Commenting out until listingStore is available

// Mock Data reusing the page structure
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Kursi Minimalis Modern',
        slug: 'kursi-minimalis-modern',
        description: 'Kursi dengan desain minimalis yang cocok untuk ruang tamu',
        base_price: 1500000,
        discount_price: 1200000,
        thumbnail_url: '/placeholder-product.svg',
        stock_status: 'in_stock' as const,
        rating_average: 4.5,
        total_reviews: 24,
        is_featured: true,
        is_new: false,
        category: { id: 1, name: 'Kursi', slug: 'kursi' }
    },
    {
        id: 2,
        name: 'Meja Makan Kayu Jati',
        slug: 'meja-makan-kayu-jati',
        description: 'Meja makan dari kayu jati berkualitas tinggi',
        base_price: 3500000,
        discount_price: undefined,
        thumbnail_url: '/placeholder-product.svg',
        stock_status: 'in_stock' as const,
        rating_average: 4.8,
        total_reviews: 56,
        is_featured: false,
        is_new: true,
        category: { id: 2, name: 'Meja', slug: 'meja' }
    },
    {
        id: 3,
        name: 'Sofa Bed Multifungsi',
        slug: 'sofa-bed-multifungsi',
        description: 'Sofa yang bisa diubah menjadi tempat tidur',
        base_price: 2500000,
        discount_price: 2000000,
        thumbnail_url: '/placeholder-product.svg',
        stock_status: 'pre_order' as const,
        rating_average: 4.2,
        total_reviews: 12,
        is_featured: false,
        is_new: false,
        category: { id: 3, name: 'Sofa', slug: 'sofa' }
    },
];

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    // Filter logic simulating backend search
    const filteredProducts = MOCK_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleFilterChange = (filters: FilterOptions) => {
        const params = new URLSearchParams(searchParams);

        // Clear existing filter params
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('colors');
        params.delete('sizes');
        params.delete('finishings');
        params.delete('stock_status');

        // Add new filter params
        if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
        if (filters.colors) params.set('colors', filters.colors.join(','));
        if (filters.sizes) params.set('sizes', filters.sizes.join(','));
        if (filters.finishings) params.set('finishings', filters.finishings.join(','));
        if (filters.stock_status) params.set('stock_status', filters.stock_status);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <nav className="mb-4 text-sm text-gray-600">
                    <span>Home</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Search Results</span>
                </nav>
                <h1 className="text-3xl font-bold text-gray-900">
                    Hasil Pencarian untuk "{query}"
                </h1>
                <p className="mt-2 text-gray-600">
                    Menampilkan {filteredProducts.length} produk
                </p>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-6 text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">Tidak ada produk ditemukan</h2>
                    <p className="mb-6 text-gray-600">Coba kata kunci lain atau periksa ejaan Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Filters Sidebar */}
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

                    {/* Product Grid */}
                    <main className="lg:col-span-3">
                        <ProductGrid products={filteredProducts} />
                    </main>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}

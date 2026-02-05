import { ProductCard } from './ProductCard';

import { Product } from '@/services/productService';

/**
 * Product grid component with responsive layout
 */
export interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export function ProductGrid({
    products,
    isLoading = false,
    emptyMessage = 'Tidak ada produk ditemukan',
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                        {/* Image skeleton */}
                        <div className="aspect-square animate-pulse bg-gray-200" />
                        {/* Content skeleton */}
                        <div className="p-4 space-y-3">
                            <div className="h-4 animate-pulse rounded bg-gray-200" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                            <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg
                    className="mb-4 h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
                <p className="text-lg font-medium text-gray-900">
                    {emptyMessage}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Coba ubah filter atau kata kunci pencarian Anda
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

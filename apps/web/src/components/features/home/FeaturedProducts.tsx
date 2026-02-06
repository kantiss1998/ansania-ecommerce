import { Product } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { RatingStars } from '@/components/features/reviews/RatingStars';
import { Button } from '@/components/ui/Button';

interface FeaturedProductsProps {
    products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-12">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Produk Pilihan</h2>
                    <p className="mt-1 text-gray-600">Terfavorit minggu ini untuk hunian Anda</p>
                </div>
                <Link href="/products?isFeatured=true" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                    Lihat Semua →
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => {
                    // Logic to determine tag
                    let tag = null;
                    let tagColor = '';

                    if (product.is_new) {
                        tag = 'New';
                        tagColor = 'bg-info-500';
                    } else if (product.is_featured) {
                        tag = 'Best Seller'; // Assuming featured often doubles as best seller visually or we can add logic
                        tagColor = 'bg-warning-500';
                    } else if (product.discount_price) {
                        tag = 'Promo';
                        tagColor = 'bg-error-500';
                    }

                    return (
                        <div key={product.id} className="group relative rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            {/* Image Placeholder */}
                            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                                {/* Tag */}
                                {tag && (
                                    <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white ${tagColor}`}>
                                        {tag}
                                    </span>
                                )}

                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <img
                                        src={product.thumbnail_url || product.images?.[0] || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                                    <Link href={`/products/${product.slug}`}>
                                        <Button variant="primary" size="sm" className="shadow-lg">
                                            Lihat Detail
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <Link href={`/products/${product.slug}`}>
                                    <h3 className="line-clamp-1 font-medium text-gray-900 group-hover:text-primary-700">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="mt-2 flex items-center gap-2">
                                    <RatingStars rating={product.rating_average || 0} size="sm" />
                                    <span className="text-xs text-gray-500">({product.rating_average || 0})</span>
                                </div>

                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(product.discount_price || product.base_price)}
                                    </span>
                                    {product.discount_price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {formatCurrency(product.base_price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    );
}

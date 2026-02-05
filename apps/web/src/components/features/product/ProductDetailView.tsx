'use client';

import { useState } from 'react';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { VariantSelector, ProductVariant } from '@/components/features/product/VariantSelector';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { ReviewList, Review } from '@/components/features/reviews/ReviewList';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

// Define Product interface locally for now, matching the mock data structure
export interface ProductDetailData {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    discount_price?: number;
    images: string[];
    rating_average: number;
    total_reviews: number;
    is_featured: boolean;
    is_new: boolean;
    category: string;
    variants: ProductVariant[];
    reviews: Review[];
}

interface ProductDetailViewProps {
    product: ProductDetailData;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
    const { addItem } = useCartStore();
    const { success } = useToast();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants[0] || null
    );
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addItem(selectedVariant.id, quantity);
        success(`${quantity}x ${product.name} ditambahkan ke keranjang!`);
    };

    const discountPercentage = product.discount_price
        ? Math.round(
            ((product.base_price - product.discount_price) /
                product.base_price) *
            100
        )
        : 0;

    const currentPrice =
        selectedVariant?.price || product.discount_price || product.base_price;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Column - Images */}
                <div>
                    <ProductImageGallery
                        images={product.images}
                        productName={product.name}
                    />
                </div>

                {/* Right Column - Product Info */}
                <div>
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: product.category, href: `/products?category=${product.category}` },
                            { label: product.name },
                        ]}
                    />

                    {/* Product Name */}
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    {/* Badges */}
                    <div className="mb-4 flex gap-2">
                        {product.is_new && <Badge variant="info">Baru</Badge>}
                        {product.is_featured && (
                            <Badge variant="warning">Featured</Badge>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="mb-6 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <svg
                                className="h-5 w-5 text-warning-DEFAULT"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold text-gray-900">
                                {product.rating_average.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-600">
                            ({product.total_reviews} ulasan)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-primary-700">
                                {formatCurrency(currentPrice)}
                            </span>
                            {discountPercentage > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatCurrency(product.base_price)}
                                    </span>
                                    <Badge variant="error">-{discountPercentage}%</Badge>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900">
                            Deskripsi
                        </h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Variant Selector */}
                    <div className="mb-6">
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onVariantChange={setSelectedVariant}
                        />
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-medium text-gray-900">
                            Jumlah
                        </h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                }
                                className="h-10 w-20 rounded-lg border border-gray-300 text-center focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                min="1"
                                max={selectedVariant?.stock || 1}
                            />
                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.min(
                                            selectedVariant?.stock || 1,
                                            quantity + 1
                                        )
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex-1"
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stock === 0}
                        >
                            Tambah ke Keranjang
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                // Will implement wishlist later
                                console.log('Add to wishlist');
                            }}
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 rounded-lg border border-gray-200 bg-white p-8">
                <h2 className="mb-8 text-2xl font-bold text-gray-900">
                    Ulasan Pelanggan
                </h2>
                <ReviewList
                    reviews={product.reviews}
                    averageRating={product.rating_average}
                    totalReviews={product.total_reviews}
                />
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { VariantSelector, ProductVariant } from '@/components/features/product/VariantSelector';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import { ReviewList } from '@/components/features/reviews/ReviewList';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FeaturedProducts } from '@/components/features/home/FeaturedProducts';
import { Product } from '@/services/productService';
import { wishlistService } from '@/services/wishlistService';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, Sparkles } from 'lucide-react';

interface ProductDetailViewProps {
    product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
    const { addItem } = useCartStore();
    const { success } = useToast();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants?.[0] || null
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

    // Map images to string array for gallery component
    const galleryImages = product.images?.map(img => img.image_url) || [product.thumbnail_url || ''];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Breadcrumb - Top Spacing */}
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { label: product.category?.name || 'Produk', href: `/products?category=${product.category?.slug || ''}` },
                            { label: product.name },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column - Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProductImageGallery
                            images={galleryImages}
                            productName={product.name}
                        />
                    </motion.div>

                    {/* Right Column - Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <div className="sticky top-24 space-y-8">
                            <div>
                                {/* Enhanced Badges */}
                                <div className="mb-4 flex gap-2">
                                    {product.is_new && (
                                        <div className="relative overflow-hidden rounded-xl px-3 py-1.5 shadow-lg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-lg opacity-30" />
                                            <span className="relative text-sm font-bold text-white">Baru</span>
                                        </div>
                                    )}
                                    {product.is_featured && (
                                        <div className="relative overflow-hidden rounded-xl px-3 py-1.5 shadow-lg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 blur-lg opacity-30" />
                                            <span className="relative text-sm font-bold text-white">Featured</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Name with Gradient */}
                                <h1 className="mb-4 text-4xl font-bold font-heading bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent leading-tight tracking-tight">
                                    {product.name}
                                </h1>

                                {/* Enhanced Rating */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                            {product.rating_average.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-600 font-medium hover:text-primary-600 cursor-pointer underline decoration-dotted underline-offset-4 transition-colors">
                                        {product.total_reviews} Ulasan
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced Price Card */}
                            <div className="relative overflow-hidden p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-lg">
                                {/* Decorative gradient blur */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full blur-3xl opacity-30" />

                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="h-4 w-4 text-primary-600" />
                                        <span className="text-sm font-semibold text-primary-700">Harga Terbaik</span>
                                    </div>
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent tracking-tight font-heading">
                                            {formatCurrency(currentPrice)}
                                        </span>
                                        {discountPercentage > 0 && (
                                            <div className="flex flex-col items-start">
                                                <span className="text-lg text-gray-400 line-through decoration-2">
                                                    {formatCurrency(product.base_price)}
                                                </span>
                                                <div className="relative overflow-hidden rounded-full px-2.5 py-1 shadow-md">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500" />
                                                    <span className="relative text-sm font-bold text-white">
                                                        Hemat {discountPercentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>
                                        Termasuk pajak & biaya layanan
                                    </p>
                                </div>
                            </div>

                            {/* Enhanced Description */}
                            <div className="prose prose-sm text-gray-600 leading-relaxed">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 font-heading flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary-600" />
                                    Deskripsi Produk
                                </h3>
                                <p>{product.description}</p>
                            </div>

                            {/* Selections */}
                            <div className="space-y-8 pt-8 border-t border-gray-100">
                                {/* Variant Selector */}
                                <VariantSelector
                                    variants={product.variants || []}
                                    selectedVariant={selectedVariant}
                                    onVariantChange={setSelectedVariant}
                                />

                                {/* Quantity Selector */}
                                <div>
                                    <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Jumlah
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-l-xl transition-colors active:bg-gray-100"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                                }
                                                className="w-16 border-none text-center font-bold text-gray-900 focus:ring-0 appearance-none bg-transparent"
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
                                                className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-r-xl transition-colors active:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">
                                            Stok: <span className="font-bold text-gray-900">{selectedVariant?.stock || 0}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-1 rounded-xl text-lg h-14 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all active:scale-[0.98]"
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant || selectedVariant.stock === 0}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {(!selectedVariant || selectedVariant.stock === 0) ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-xl h-14 w-14 p-0 flex items-center justify-center border-gray-200 hover:border-error-200 hover:bg-error-50 hover:text-error-500 transition-all active:scale-95"
                                    onClick={async () => {
                                        try {
                                            await wishlistService.addToWishlist(product.id);
                                            success('Produk ditambahkan ke wishlist');
                                        } catch (err) {
                                            console.error(err);
                                            success('Produk ditambahkan ke wishlist');
                                        }
                                    }}
                                >
                                    <Heart className="h-6 w-6" />
                                </Button>
                            </div>

                            {/* Feature Icons */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                                <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-gray-50/50 hover:bg-emerald-50/50 transition-colors group cursor-default">
                                    <div className="p-3 bg-white text-emerald-600 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">Garansi Asli</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 transition-colors group cursor-default">
                                    <div className="p-3 bg-white text-blue-600 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">Pengiriman Cepat</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-gray-50/50 hover:bg-purple-50/50 transition-colors group cursor-default">
                                    <div className="p-3 bg-white text-purple-600 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                        <RotateCcw className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">30 Hari Kembali</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Enhanced Reviews Section */}
                <div className="mt-20">
                    <div className="mb-8 flex items-center justify-between border-b-2 border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                                <Star className="h-5 w-5 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Ulasan Pelanggan <span className="ml-2 text-lg font-normal text-gray-500">({product.reviews?.length || 0})</span>
                            </h2>
                        </div>
                    </div>
                    <ReviewList
                        reviews={product.reviews || []}
                        averageRating={product.rating_average}
                        totalReviews={product.total_reviews}
                    />
                </div>

                {/* Enhanced Related Products Section */}
                {product.related_products && product.related_products.length > 0 && (
                    <div className="mt-20 border-t-2 border-gray-100 pt-16">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 mb-4">
                                <Sparkles className="h-4 w-4 text-primary-600" />
                                <span className="text-sm font-semibold text-primary-700">Rekomendasi</span>
                            </div>
                            <h2 className="text-3xl font-bold font-heading bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent">
                                Produk Sejenis
                            </h2>
                        </div>
                        <FeaturedProducts products={product.related_products} />
                    </div>
                )}
            </div>
        </div>
    );
}

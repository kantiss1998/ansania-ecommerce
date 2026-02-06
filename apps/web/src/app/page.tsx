import { cmsClient } from '@/lib/cms';
import { productService } from '@/services/productService';
import { flashSaleService } from '@/services/flashSaleService';
import { BannerCarousel } from '@/components/features/home/BannerCarousel';
import { FlashSale } from '@/components/features/home/FlashSale';
import { FeaturedProducts } from '@/components/features/home/FeaturedProducts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const bannersPromise = cmsClient.getBanners();
    const featuredProductsPromise = productService.getProducts({ isFeatured: true, limit: 4 });
    const flashSalesPromise = flashSaleService.getActiveFlashSales();
    const siteSettingsPromise = cmsClient.getSettings();

    const [banners, featuredProductsRes, flashSales, siteSettings] = await Promise.all([
        bannersPromise,
        featuredProductsPromise,
        flashSalesPromise,
        siteSettingsPromise
    ]);

    // Use the first active flash sale if available
    const activeFlashSale = flashSales.length > 0 ? flashSales[0] : null;

    // Map FlashSaleProduct to Product structure expected by component
    const flashSaleProducts = activeFlashSale?.products.map(item => ({
        ...item.product,
        base_price: item.original_price,
        discount_price: item.flash_sale_price,
        // Ensure thumbnail is available
        thumbnail_url: item.product.thumbnail_url || item.product.images?.[0]
    })) || [];

    return (
        <main className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Hero / Banners */}
                <BannerCarousel banners={banners} />

                {/* Flash Sale Section */}
                {activeFlashSale && flashSaleProducts.length > 0 && (
                    <FlashSale
                        products={flashSaleProducts}
                        endTime={new Date(activeFlashSale.end_time)}
                    />
                )}

                {/* Featured Products */}
                <FeaturedProducts products={featuredProductsRes.items} />

                {/* Value Props Section */}
                <section className="my-16 grid grid-cols-1 gap-8 rounded-2xl bg-primary-50 p-8 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mb-2 font-bold text-gray-900">Kualitas Terjamin</h3>
                        <p className="text-sm text-gray-600">Material pilihan dan pengerjaan rapi untuk kepuasan Anda.</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 font-bold text-gray-900">Pengiriman Cepat</h3>
                        <p className="text-sm text-gray-600">Layanan pengiriman tepat waktu ke seluruh Indonesia.</p>
                    </div>
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 font-bold text-gray-900">24/7 Support</h3>
                        <p className="text-sm text-gray-600">Layanan pelanggan siap membantu Anda kapan saja.</p>
                    </div>
                </section>

                {/* Social Media Links from Settings */}
                {siteSettings && siteSettings.socialLinks && (
                    <section className="my-8 flex justify-center gap-6">
                        {siteSettings.socialLinks.instagram && (
                            <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                                Instagram
                            </a>
                        )}
                        {siteSettings.socialLinks.facebook && (
                            <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                                Facebook
                            </a>
                        )}
                        {siteSettings.socialLinks.whatsapp && (
                            <a href={siteSettings.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                                WhatsApp
                            </a>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}

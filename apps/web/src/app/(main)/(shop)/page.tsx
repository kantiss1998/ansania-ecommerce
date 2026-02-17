import { Instagram, Facebook, MessageCircle, Sparkles } from "lucide-react";

import { BannerCarousel } from "@/components/features/home/BannerCarousel";
import { FeaturedProducts } from "@/components/features/home/FeaturedProducts";
import { FlashSale } from "@/components/features/home/FlashSale";
import { HomeMockup } from "@/components/features/home/HomeMockup";
import { ValueProps } from "@/components/features/home/ValueProps";
import { cmsClient } from "@/lib/cms";
import { flashSaleService } from "@/services/flashSaleService";
import { productService } from "@/services/productService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const bannersPromise = cmsClient.getBanners();
  const featuredProductsPromise = productService.getProducts({
    isFeatured: true,
    limit: 8,
  });
  const flashSalesPromise = flashSaleService.getActiveFlashSales();
  const siteSettingsPromise = cmsClient.getSettings();

  const [banners, featuredProductsRes, flashSales, siteSettings] =
    await Promise.all([
      bannersPromise,
      featuredProductsPromise,
      flashSalesPromise,
      siteSettingsPromise,
    ]);

  // Use the first active flash sale if available
  const activeFlashSale = flashSales.length > 0 ? flashSales[0] : null;

  // Map FlashSaleProduct to Product structure expected by component
  const flashSaleProducts = (activeFlashSale?.products || [])
    .filter((item) => !!item.product)
    .map((item) => ({
      id: item.product!.id,
      name: item.product!.name,
      slug: item.product!.slug,
      description: item.product!.description || "",
      base_price: item.original_price,
      discount_price: item.flash_sale_price,
      thumbnail_url: item.product!.main_image || "/placeholder-product.svg",
      stock_status: item.product!.stock_status,
      rating_average: item.product!.rating || 0,
      total_reviews: item.product!.total_reviews || 0,
      is_featured: item.product!.is_featured,
      is_new: false,
      images: item.product!.images || [],
    }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute top-1/2 left-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-8 space-y-16 relative z-10">
        {/* --- MOCKUP SECTION (Comment this once you have real data) --- */}
        <HomeMockup />
        {/* ------------------------------------------------------------- */}

        {/* Hero / Banners */}
        <BannerCarousel banners={banners} />

        {/* Value Props Section */}
        <ValueProps />

        {/* Flash Sale Section */}
        {activeFlashSale && flashSaleProducts.length > 0 && (
          <FlashSale
            products={flashSaleProducts}
            endTime={new Date(activeFlashSale.end_date)}
          />
        )}

        {/* Featured Products */}
        <FeaturedProducts products={featuredProductsRes.items} />

        {/* Social Media Links from Settings */}
        {siteSettings && siteSettings.socialLinks && (
          <section className="mt-20 mb-12 relative">
            {/* Enhanced Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-purple-50 to-pink-50 rounded-3xl blur-3xl opacity-40" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-300/30 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-300/30 rounded-full blur-2xl" />

            <div className="relative flex flex-col items-center justify-center gap-8 border-t border-gray-100 pt-16 pb-8">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md border border-gray-200/50">
                <Sparkles className="h-4 w-4 text-primary-600 animate-pulse" />
                <span className="text-sm font-bold text-transparent bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text">
                  Terhubung dengan Kami
                </span>
              </div>

              {/* Enhanced Title Section */}
              <div className="text-center space-y-3">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-purple-700 bg-clip-text text-transparent font-heading mb-3">
                  Ikuti Kami di Media Sosial
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                  Dapatkan inspirasi gaya, tips padu padan, dan update koleksi
                  terbaru
                </p>
              </div>

              {/* Enhanced Social Media Cards */}
              <div className="flex flex-wrap gap-6 justify-center">
                {siteSettings.socialLinks.instagram && (
                  <a
                    href={siteSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-pink-200 min-w-[160px]"
                    aria-label="Instagram"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl group-hover:shadow-pink-500/50 transition-all duration-500">
                        <Instagram className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-base font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                        Instagram
                      </span>
                      <p className="text-xs text-gray-500">@ansania</p>
                    </div>
                  </a>
                )}
                {siteSettings.socialLinks.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-blue-200 min-w-[160px]"
                    aria-label="Facebook"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl group-hover:shadow-blue-500/50 transition-all duration-500">
                        <Facebook className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Facebook
                      </span>
                      <p className="text-xs text-gray-500">/ansania</p>
                    </div>
                  </a>
                )}
                {siteSettings.socialLinks.whatsapp && (
                  <a
                    href={siteSettings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-green-200 min-w-[160px]"
                    aria-label="WhatsApp"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl group-hover:shadow-green-500/50 transition-all duration-500">
                        <MessageCircle className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        WhatsApp
                      </span>
                      <p className="text-xs text-gray-500">Chat Kami</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

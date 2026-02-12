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
      images: item.product!.images?.map((url) => ({ image_url: url })) || [],
    }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 py-8 space-y-16">
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
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-purple-50 to-pink-50 rounded-3xl blur-3xl opacity-30" />

            <div className="relative flex flex-col items-center justify-center gap-8 border-t border-gray-100 pt-16 pb-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Terhubung dengan Kami
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 bg-clip-text text-transparent font-heading mb-3">
                  Ikuti Kami di Media Sosial
                </h3>
                <p className="text-gray-600">
                  Dapatkan inspirasi dan update terbaru dari kami
                </p>
              </div>

              <div className="flex gap-6">
                {siteSettings.socialLinks.instagram && (
                  <a
                    href={siteSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-transparent"
                    aria-label="Instagram"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg group-hover:shadow-pink-500/30 transition-shadow">
                      <Instagram className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                      Instagram
                    </span>
                  </a>
                )}
                {siteSettings.socialLinks.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-transparent"
                    aria-label="Facebook"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                      <Facebook className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      Facebook
                    </span>
                  </a>
                )}
                {siteSettings.socialLinks.whatsapp && (
                  <a
                    href={siteSettings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-transparent"
                    aria-label="WhatsApp"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg group-hover:shadow-green-500/30 transition-shadow">
                      <MessageCircle className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                      WhatsApp
                    </span>
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

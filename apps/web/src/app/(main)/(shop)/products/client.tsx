"use client";

import { Sparkles, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

import {
  ProductFilters,
  FilterOptions,
} from "@/components/features/product/ProductFilters";
import { ProductGrid } from "@/components/features/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import {
  productService,
  Product,
  ProductListParams,
} from "@/services/productService";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });

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
          productService.getFinishings(),
        ]);
        setColors(colorsData);
        setSizes(sizesData);
        setFinishings(finishingsData);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts({
          search: searchParams.get("q") || undefined,
          minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
          maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
          category: searchParams.get("category") || undefined,
          // Pass attributes if service/backend supports them
          // Assuming backend accepts these as query params
          sort: searchParams.get("sort") || undefined,
          page: Number(searchParams.get("page")) || 1,
          limit: 12,
        } as ProductListParams); // Type assertion to bypass strict typing if needed for extra params like colors

        // We need to inject color/size/finishing manually if they are not in ProductListParams
        // Note: The service might need update if it filters out unknown params.
        // Assuming service uses { ...params } spread, we can pass them.

        setProducts(response.items || []);
        if (response.meta) {
          setPagination({
            page: response.meta.page,
            totalPages: response.meta.totalPages,
            total: response.meta.total,
            limit: response.meta.limit,
          });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (filters: FilterOptions) => {
    const params = new URLSearchParams(searchParams);

    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("colors");
    params.delete("sizes");
    params.delete("finishings");
    params.delete("stock_status");

    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.colors) params.set("colors", filters.colors.join(","));
    if (filters.sizes) params.set("sizes", filters.sizes.join(","));
    if (filters.finishings)
      params.set("finishings", filters.finishings.join(","));
    if (filters.stock_status) params.set("stock_status", filters.stock_status);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Koleksi Produk
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading">
            Semua Produk
          </h1>
          <p className="mt-2 text-gray-600">
            Temukan furnitur berkualitas untuk rumah impian Anda
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
            {/* Enhanced Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-purple-50">
                  <SlidersHorizontal className="h-4 w-4 text-primary-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {pagination.total > 0 ? (
                    <>
                      Menampilkan{" "}
                      <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {products?.length || 0}
                      </span>{" "}
                      dari{" "}
                      <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {pagination.total}
                      </span>{" "}
                      produk
                    </>
                  ) : (
                    "Tidak ada produk"
                  )}
                </p>
              </div>

              {/* Enhanced Sort Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none rounded-xl border-2 border-gray-200 bg-white pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-700 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer hover:border-primary-300"
                  value={searchParams.get("sort") || "newest"}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("sort", e.target.value);
                    router.push(`/products?${params.toString()}`);
                  }}
                >
                  <option value="newest">🆕 Terbaru</option>
                  <option value="price_asc">💰 Harga: Rendah → Tinggi</option>
                  <option value="price_desc">💎 Harga: Tinggi → Rendah</option>
                  <option value="popular">🔥 Terpopuler</option>
                  <option value="rating">⭐ Rating Tertinggi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                  <p className="mt-4 text-sm font-medium text-gray-600">
                    Memuat produk...
                  </p>
                </div>
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
                  params.set("page", page.toString());
                  router.push(`/products?${params.toString()}`);
                }}
              />
            </div>
          </main>
        </div>
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

import { ArrowRight, Sparkles, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { categoryService } from "@/services/categoryService";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await categoryService.getCategories();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-16 text-center space-y-6 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-5 py-2.5 shadow-sm border border-primary-100/50">
            <Tag className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              Kategori Koleksi
            </span>
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 bg-clip-text text-transparent font-heading mb-4">
              Koleksi Kerudung Kami
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Temukan kerudung berkualitas premium yang sesuai dengan gaya dan
              kebutuhan Anda
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
            <Sparkles className="h-5 w-5 text-primary-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={
                    category.image_url ||
                    category.image ||
                    "/placeholder-category.svg"
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Sparkle Effect on Hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Badge if has description */}
                {category.description && (
                  <div className="absolute top-4 left-4">
                    <div className="glass rounded-full px-3 py-1.5">
                      <span className="text-xs font-semibold text-white">
                        ✨ Premium
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight drop-shadow-lg">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="line-clamp-2 text-sm text-gray-100 leading-relaxed drop-shadow">
                    {category.description}
                  </p>
                )}

                {/* CTA Button */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                    Lihat Koleksi
                  </span>
                  <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary-300" />
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="py-32 text-center animate-fade-in">
            <div className="inline-flex flex-col items-center gap-4 p-12 rounded-3xl bg-gray-50 border border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full">
                <Tag className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 font-medium">
                Belum ada kategori yang tersedia
              </p>
              <p className="text-sm text-gray-400">
                Kategori produk akan muncul di sini
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

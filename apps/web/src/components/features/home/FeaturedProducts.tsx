"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RatingStars } from "@/components/features/reviews/RatingStars";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/services/productService";

interface FeaturedProductsProps {
  products: Product[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16">
      {/* Section Header with Gradient */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-full px-4 py-2 mb-4"
        >
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            Pilihan Terbaik
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent font-heading mb-4"
        >
          Produk Pilihan
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Terfavorit minggu ini untuk hunian impian Anda
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((product) => {
          // Logic to determine tag
          let tag = null;
          let tagColor = "";

          if (product.is_new) {
            tag = "New";
            tagColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
          } else if (product.is_featured) {
            tag = "Best Seller";
            tagColor = "bg-gradient-to-r from-yellow-500 to-orange-500";
          } else if (product.discount_price) {
            tag = "Promo";
            tagColor = "bg-gradient-to-r from-red-500 to-pink-500";
          }

          return (
            <motion.div
              variants={itemVariants}
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:border-primary-200"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Tag */}
                {tag && (
                  <span
                    className={`absolute left-3 top-3 z-10 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm ${tagColor}`}
                  >
                    {tag}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-600 hover:text-white hover:scale-110 active:scale-95"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>

                <div className="h-full w-full">
                  <Image
                    src={
                      product.thumbnail_url ||
                      product.images?.[0]?.image_url ||
                      "/placeholder.jpg"
                    }
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block w-full"
                  >
                    <Button className="w-full justify-center bg-white/95 text-gray-900 backdrop-blur-sm hover:bg-gradient-primary hover:text-white shadow-lg rounded-xl h-12 border-none font-semibold">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <Link href={`/products/${product.slug}`} className="mb-2 block">
                  <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600 font-heading leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-4 flex items-center gap-2">
                  <RatingStars rating={product.rating_average || 0} size="sm" />
                  <span className="text-xs font-medium text-gray-400">
                    (
                    {product.rating_average
                      ? product.rating_average.toFixed(1)
                      : "0.0"}
                    )
                  </span>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent font-heading tracking-tight">
                        {formatCurrency(
                          product.discount_price || product.base_price,
                        )}
                      </span>
                    </div>
                    {product.discount_price && (
                      <span className="text-sm text-gray-400 line-through decoration-gray-300">
                        {formatCurrency(product.base_price)}
                      </span>
                    )}
                  </div>
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-purple-50 text-primary-600 transition-all hover:from-primary-600 hover:to-purple-600 hover:text-white hover:scale-110 active:scale-95 shadow-sm hover:shadow-lg hover:shadow-primary-500/30"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 flex justify-center"
      >
        <Link href="/products?isFeatured=true">
          <Button
            variant="outline"
            size="lg"
            className="group rounded-full px-8 border-2 border-gray-200 hover:border-primary-600 hover:bg-primary-50"
            rightIcon={ArrowRight}
          >
            <span className="font-semibold">Lihat Semua Produk</span>
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

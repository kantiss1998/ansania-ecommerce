"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

import { Product } from "@/services/productService";

import { ProductCard } from "./ProductCard";

/**
 * Product grid component with responsive layout
 */
export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "Tidak ada produk ditemukan",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            {/* Image skeleton */}
            <div className="aspect-[4/5] animate-pulse bg-gray-100" />
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-50" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-16 text-center">
        <div className="mb-6 rounded-full bg-white p-4 shadow-sm">
          <SearchX className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Coba ubah filter atau kata kunci pencarian Anda untuk menemukan produk
          yang Anda cari.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

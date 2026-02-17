"use client";

import { Heart, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { wishlistService, WishlistItem } from "@/services/wishlistService";

export function WishlistContent() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await wishlistService.getWishlist();
        setWishlist(items);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (id: number) => {
    try {
      await wishlistService.removeFromWishlist(id);
      // Optimistic update
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-rose-50">
          <Heart className="h-10 w-10 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Wishlist Kosong</h2>
        <p className="mt-3 text-base text-gray-600">
          Anda belum menyimpan produk apapun.
        </p>
        <Link href="/products">
          <Button variant="gradient" className="mt-6 shadow-lg hover:shadow-xl">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Mulai Belanja
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-2.5 shadow-sm border border-pink-100/50 mb-4">
          <Heart className="h-4 w-4 text-pink-600" />
          <span className="text-sm font-semibold text-pink-700">
            Wishlist Saya
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-800 to-gray-900 bg-clip-text text-transparent font-heading">
          Produk Favorit
        </h1>
        <p className="mt-2 text-base text-gray-600">
          <span className="font-semibold text-pink-600">{wishlist.length}</span>{" "}
          produk tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-xl"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveFromWishlist(item.id)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              title="Hapus dari Wishlist"
            >
              <X className="h-5 w-5" />
            </button>

            <Link href={`/products/${item.product.slug}`}>
              <div className="relative aspect-square bg-gray-100">
                {/* Use Image component */}
                {item.product.thumbnail_url || item.product.images?.[0] ? (
                  <Image
                    src={
                      item.product.thumbnail_url ||
                      item.product.images?.[0] ||
                      ""
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </Link>

            <div className="p-5">
              <Link href={`/products/${item.product.slug}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-pink-600 line-clamp-2 transition-colors">
                  {item.product.name}
                </h3>
              </Link>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(
                    Number(item.product.selling_price) ||
                      Number(item.product.base_price) ||
                      0,
                  )}
                </span>
              </div>
              <Button
                variant="gradient"
                size="sm"
                fullWidth
                className="mt-4 shadow-md hover:shadow-lg"
                onClick={() =>
                  (window.location.href = `/products/${item.product.slug}`)
                }
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Lihat Produk
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

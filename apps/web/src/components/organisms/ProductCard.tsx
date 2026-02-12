import { ShoppingCart, Star, Heart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent, CardImage } from "@/components/atoms/Card";
import { Stack } from "@/components/layout/Stack";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/services/productService";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.discount_price
    ? Math.round(
        ((product.base_price - product.discount_price) / product.base_price) *
          100,
      )
    : 0;

  const price = product.discount_price || product.base_price;
  const isOutOfStock = product.stock_status === "out_of_stock";

  return (
    <Card
      hover
      padding="none"
      className="overflow-hidden group h-full transition-all duration-base"
    >
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden"
        >
          <CardImage
            src={product.thumbnail_url || "/placeholder-product.svg"}
            alt={product.name}
            aspectRatio="portrait"
            className="group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10 pointer-events-none">
          {product.is_new && <Badge variant="info">Baru</Badge>}
          {product.is_featured && <Badge variant="warning">Featured</Badge>}
          {discountPercentage > 0 && (
            <Badge variant="error">-{discountPercentage}%</Badge>
          )}
        </div>

        <button
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-base hover:bg-primary hover:text-white"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <Badge
              variant="default"
              className="bg-white/95 text-gray-900 border-none px-4 py-2 font-bold shadow-lg"
            >
              Stok Habis
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        <Stack spacing={2} className="flex-1">
          <div className="flex items-center gap-1.5">
            <div className="flex bg-amber-50 px-2 py-0.5 rounded-lg text-amber-600 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold">
                {product.rating_average.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              ({product.total_reviews})
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-base font-bold text-gray-900 hover:text-primary transition-colors font-heading"
          >
            {product.name}
          </Link>

          <Stack spacing={1} className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary font-heading">
                {formatCurrency(price)}
              </span>
              {product.discount_price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.base_price)}
                </span>
              )}
            </div>

            {product.stock_status === "limited_stock" && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Stok Terbatas
              </div>
            )}
          </Stack>
        </Stack>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-base">
          <Button
            href={`/products/${product.slug}`}
            variant="primary"
            fullWidth
            size="sm"
            disabled={isOutOfStock}
            leftIcon={<ShoppingCart className="h-4 w-4" />}
          >
            {isOutOfStock ? "Habis" : "Detail"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

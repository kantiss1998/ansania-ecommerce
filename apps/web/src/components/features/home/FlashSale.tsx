"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/services/productService";

interface FlashSaleProps {
  products: Product[];
  endTime?: Date;
}

export function FlashSale({ products, endTime }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = endTime || new Date(new Date().setHours(24, 0, 0, 0));
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!products || products.length === 0) return null;

  return (
    <Section
      background="dark"
      className="rounded-3xl overflow-hidden relative"
      spacing="md"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Zap className="h-64 w-64 text-white" />
      </div>

      <Stack spacing={8} className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-destructive p-3 shadow-lg shadow-destructive/30">
              <Zap className="h-8 w-8 text-white fill-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-wider text-white font-heading">
                Flash Sale
              </h2>
              <p className="text-gray-400 font-medium">
                Harga spesial untuk waktu terbatas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="text-right hidden md:block border-r border-white/10 pr-4 mr-2">
              <p className="text-xs font-bold uppercase tracking-widest text-destructive">
                Berakhir Dalam
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TimeBox value={timeLeft.hours} label="Jam" />
              <span className="text-2xl font-bold text-gray-600 pb-4">:</span>
              <TimeBox value={timeLeft.minutes} label="Menit" />
              <span className="text-2xl font-bold text-gray-600 pb-4">:</span>
              <TimeBox value={timeLeft.seconds} label="Detik" />
            </div>
          </div>

          <Button
            href="/products?hasDiscount=true"
            variant="secondary"
            size="md"
            className="rounded-full px-8 bg-white hover:bg-gray-100 text-gray-900 border-none shadow-lg hidden md:flex"
          >
            Lihat Semua
          </Button>
        </div>

        <div className="relative -mx-8 overflow-x-auto px-8 pb-4 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {products.map((product) => {
              const discountPercentage =
                product.base_price && product.discount_price
                  ? Math.round(
                      ((product.base_price - product.discount_price) /
                        product.base_price) *
                        100,
                    )
                  : 0;

              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="w-56 flex-shrink-0"
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card
                      padding="none"
                      className="overflow-hidden h-full group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={
                            product.thumbnail_url || "/placeholder-product.svg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-slow group-hover:scale-110"
                        />
                        {discountPercentage > 0 && (
                          <Badge
                            variant="error"
                            className="absolute top-2 right-2 shadow-lg scale-110"
                          >
                            -{discountPercentage}%
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1 truncate text-sm font-bold text-gray-900 group-hover:text-primary transition-colors font-heading">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-primary text-lg">
                            {formatCurrency(
                              product.discount_price || product.base_price,
                            )}
                          </span>
                          {product.discount_price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatCurrency(product.base_price)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-gray-500">Tersedia</span>
                            <span className="text-destructive">
                              80% Terjual
                            </span>
                          </div>
                          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="absolute left-0 top-0 h-full w-[80%] bg-destructive rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden">
          <Button
            href="/products?hasDiscount=true"
            variant="ghost"
            fullWidth
            className="text-white border border-white/20"
          >
            Lihat Semua Promo
          </Button>
        </div>
      </Stack>
    </Section>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <Stack align="center" spacing={1}>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md text-gray-900">
        <span className="text-xl font-bold font-mono">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] uppercase text-gray-400 font-bold">
        {label}
      </span>
    </Stack>
  );
}

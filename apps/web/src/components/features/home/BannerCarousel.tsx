"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Stack } from "@/components/layout/Stack";
import { CMSBanner } from "@/lib/cms";

export function BannerCarousel({ banners }: { banners: CMSBanner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % banners.length),
    [banners.length],
  );
  const prevSlide = useCallback(
    () =>
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length),
    [banners.length],
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [currentIndex, banners.length, isPaused, nextSlide]);

  if (!banners.length) return null;

  return (
    <div
      className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl md:h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gray-800"
            style={{
              backgroundImage: `url(${banners[currentIndex].imageUrl || "/placeholder-banner.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20">
            <Stack spacing={6} className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge
                  variant="primary"
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white py-2 px-4"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                  Koleksi Terbaru
                </Badge>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-5xl font-bold leading-tight text-white md:text-7xl drop-shadow-2xl"
              >
                {banners[currentIndex].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-100 md:text-2xl drop-shadow-lg font-light leading-relaxed"
              >
                {banners[currentIndex].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  href={banners[currentIndex].linkUrl}
                  variant="gradient"
                  size="lg"
                  className="rounded-full h-14 px-10"
                >
                  {banners[currentIndex].linkText}
                </Button>
                <Button
                  href="/products"
                  variant="outline"
                  size="lg"
                  className="rounded-full h-14 px-10 text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20"
                >
                  Lihat Katalog
                </Button>
              </motion.div>
            </Stack>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-base ${index === currentIndex ? "w-10 bg-white" : "w-3 bg-white/40"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-4 text-white backdrop-blur-md hover:bg-white/20 transition-all duration-base"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-4 text-white backdrop-blur-md hover:bg-white/20 transition-all duration-base"
      >
        <ArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}

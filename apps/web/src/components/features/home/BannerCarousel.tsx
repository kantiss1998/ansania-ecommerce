'use client';

import { useState, useEffect } from 'react';
import { CMSBanner } from '@/lib/cms';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export function BannerCarousel({ banners }: { banners: CMSBanner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => clearInterval(interval);
    }, [currentIndex, banners.length, isPaused]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (!banners.length) return null;

    return (
        <div
            className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-gray-900 shadow-2xl md:h-[600px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Multi-layer gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-transparent to-black/70 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                        {/* Background Image */}
                        <motion.div
                            className="absolute inset-0 bg-gray-800"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.7 }}
                            style={{
                                backgroundImage: `url(${banners[currentIndex].imageUrl || '/placeholder-banner.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        {/* Decorative blur elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl z-10" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-10" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20">
                        <div className="max-w-2xl space-y-6">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 w-fit"
                            >
                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-medium text-white">Koleksi Terbaru</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="font-heading text-5xl font-bold leading-tight text-white md:text-7xl drop-shadow-2xl"
                            >
                                {banners[currentIndex].title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-xl text-gray-100 md:text-2xl drop-shadow-lg font-light leading-relaxed"
                            >
                                {banners[currentIndex].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="flex gap-4"
                            >
                                <Link href={banners[currentIndex].linkUrl}>
                                    <Button
                                        variant="gradient"
                                        size="lg"
                                        className="h-14 px-8 text-lg font-semibold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 rounded-full"
                                    >
                                        {banners[currentIndex].linkText}
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 px-8 text-lg font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 rounded-full"
                                    >
                                        Lihat Katalog
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-10 bg-white shadow-lg shadow-white/30'
                                : 'w-3 bg-white/40 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95 md:left-8 shadow-lg"
                aria-label="Previous slide"
            >
                <ArrowLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95 md:right-8 shadow-lg"
                aria-label="Next slide"
            >
                <ArrowRight className="h-6 w-6" />
            </button>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { CMSBanner } from '@/lib/cms';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function BannerCarousel({ banners }: { banners: CMSBanner[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (!banners.length) return null;

    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gray-900 md:h-[500px]">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Image Placeholder Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center bg-black/40 px-6 md:px-16">
                        <div className="max-w-xl space-y-4 text-white">
                            <h2 className="animate-fade-in-up text-4xl font-bold md:text-5xl">
                                {banner.title}
                            </h2>
                            <p className="animate-fade-in-up text-lg text-gray-200 delay-100">
                                {banner.description}
                            </p>
                            <div className="animate-fade-in-up pt-4 delay-200">
                                <Link href={banner.linkUrl}>
                                    <Button size="lg" variant="primary" className="border-none bg-white text-gray-900 hover:bg-gray-100">
                                        {banner.linkText}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 md:left-8"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 md:right-8"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Product image gallery component
 */
export interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-square w-full rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={images[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index
                                ? 'border-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 25vw, 12.5vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

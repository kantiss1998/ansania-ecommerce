'use client';

import { useState } from 'react';

/**
 * Product variant type
 */
export interface ProductVariant {
    id: number;
    color?: string;
    size?: string;
    finishing?: string;
    price: number;
    stock: number;
    sku: string;
}

/**
 * Variant selector component
 */
export interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onVariantChange: (variant: ProductVariant) => void;
}

export function VariantSelector({
    variants,
    selectedVariant,
    onVariantChange,
}: VariantSelectorProps) {
    // Extract unique options
    const colors = [
        ...new Set(variants.map((v) => v.color).filter(Boolean)),
    ] as string[];
    const sizes = [
        ...new Set(variants.map((v) => v.size).filter(Boolean)),
    ] as string[];
    const finishings = [
        ...new Set(variants.map((v) => v.finishing).filter(Boolean)),
    ] as string[];

    const [selectedColor, setSelectedColor] = useState<string | null>(
        selectedVariant?.color || null
    );
    const [selectedSize, setSelectedSize] = useState<string | null>(
        selectedVariant?.size || null
    );
    const [selectedFinishing, setSelectedFinishing] = useState<string | null>(
        selectedVariant?.finishing || null
    );

    // Find matching variant based on selections
    const findMatchingVariant = (
        color: string | null,
        size: string | null,
        finishing: string | null
    ) => {
        return variants.find(
            (v) =>
                (!color || v.color === color) &&
                (!size || v.size === size) &&
                (!finishing || v.finishing === finishing)
        );
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
        const variant = findMatchingVariant(color, selectedSize, selectedFinishing);
        if (variant) onVariantChange(variant);
    };

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
        const variant = findMatchingVariant(selectedColor, size, selectedFinishing);
        if (variant) onVariantChange(variant);
    };

    const handleFinishingChange = (finishing: string) => {
        setSelectedFinishing(finishing);
        const variant = findMatchingVariant(selectedColor, selectedSize, finishing);
        if (variant) onVariantChange(variant);
    };

    return (
        <div className="space-y-6">
            {/* Color Selector */}
            {colors.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                        Warna:{' '}
                        <span className="font-normal text-gray-600">
                            {selectedColor || 'Pilih warna'}
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            const isAvailable = variants.some(
                                (v) =>
                                    v.color === color &&
                                    v.stock > 0 &&
                                    (!selectedSize || v.size === selectedSize) &&
                                    (!selectedFinishing || v.finishing === selectedFinishing)
                            );
                            const isSelected = selectedColor === color;

                            return (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    disabled={!isAvailable}
                                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${isSelected
                                            ? 'border-primary-700 bg-primary-700 text-white'
                                            : isAvailable
                                                ? 'border-gray-300 bg-white text-gray-900 hover:border-primary-700'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {color}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                        Ukuran:{' '}
                        <span className="font-normal text-gray-600">
                            {selectedSize || 'Pilih ukuran'}
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const isAvailable = variants.some(
                                (v) =>
                                    v.size === size &&
                                    v.stock > 0 &&
                                    (!selectedColor || v.color === selectedColor) &&
                                    (!selectedFinishing || v.finishing === selectedFinishing)
                            );
                            const isSelected = selectedSize === size;

                            return (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    disabled={!isAvailable}
                                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${isSelected
                                            ? 'border-primary-700 bg-primary-700 text-white'
                                            : isAvailable
                                                ? 'border-gray-300 bg-white text-gray-900 hover:border-primary-700'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Finishing Selector */}
            {finishings.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                        Finishing:{' '}
                        <span className="font-normal text-gray-600">
                            {selectedFinishing || 'Pilih finishing'}
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {finishings.map((finishing) => {
                            const isAvailable = variants.some(
                                (v) =>
                                    v.finishing === finishing &&
                                    v.stock > 0 &&
                                    (!selectedColor || v.color === selectedColor) &&
                                    (!selectedSize || v.size === selectedSize)
                            );
                            const isSelected = selectedFinishing === finishing;

                            return (
                                <button
                                    key={finishing}
                                    onClick={() => handleFinishingChange(finishing)}
                                    disabled={!isAvailable}
                                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${isSelected
                                            ? 'border-primary-700 bg-primary-700 text-white'
                                            : isAvailable
                                                ? 'border-gray-300 bg-white text-gray-900 hover:border-primary-700'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {finishing}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock Info */}
            {selectedVariant && (
                <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stok tersedia:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedVariant.stock} unit
                        </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">SKU:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedVariant.sku}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

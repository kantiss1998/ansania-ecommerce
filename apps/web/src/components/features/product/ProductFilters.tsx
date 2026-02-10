'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';

/**
 * Filter options type
 */
export interface FilterOptions {
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: string[];
    finishings?: string[];
    stock_status?: string;
}

/**
 * Product filters component
 */
export interface ProductFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
    availableColors?: string[];
    availableSizes?: string[];
    availableFinishings?: string[];
}

export function ProductFilters({
    onFilterChange,
    availableColors = [],
    availableSizes = [],
    availableFinishings = [],
}: ProductFiltersProps) {
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedFinishings, setSelectedFinishings] = useState<string[]>([]);
    const [stockStatus, setStockStatus] = useState<string>('');

    const handleApplyFilters = () => {
        const filters: FilterOptions = {};

        if (minPrice) filters.minPrice = parseFloat(minPrice);
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
        if (selectedColors.length > 0) filters.colors = selectedColors;
        if (selectedSizes.length > 0) filters.sizes = selectedSizes;
        if (selectedFinishings.length > 0) filters.finishings = selectedFinishings;
        if (stockStatus) filters.stock_status = stockStatus;

        onFilterChange(filters);
    };

    const handleReset = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedFinishings([]);
        setStockStatus('');
        onFilterChange({});
    };

    const toggleSelection = (
        value: string,
        selected: string[],
        setter: (values: string[]) => void
    ) => {
        if (selected.includes(value)) {
            setter(selected.filter((v) => v !== value));
        } else {
            setter([...selected, value]);
        }
    };

    const hasActiveFilters = minPrice || maxPrice || selectedColors.length > 0 || selectedSizes.length > 0 || selectedFinishings.length > 0 || stockStatus;

    return (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-purple-50">
                        <Filter className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading text-gray-900">Filter Produk</h3>
                        {hasActiveFilters && (
                            <p className="text-xs text-primary-600 font-medium">Filter aktif</p>
                        )}
                    </div>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div>
                <h4 className="mb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-600" />
                    Rentang Harga
                </h4>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="text-sm"
                    />
                    <span className="flex items-center text-gray-400 font-bold">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="text-sm"
                    />
                </div>
            </div>

            {/* Colors */}
            {availableColors.length > 0 && (
                <div>
                    <h4 className="mb-3 text-sm font-bold text-gray-900">
                        Warna
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => (
                            <button
                                key={color}
                                onClick={() =>
                                    toggleSelection(
                                        color,
                                        selectedColors,
                                        setSelectedColors
                                    )
                                }
                                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${selectedColors.includes(color)
                                        ? 'border-primary-600 bg-gradient-primary text-white shadow-md shadow-primary-500/30 scale-105'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
                <div>
                    <h4 className="mb-3 text-sm font-bold text-gray-900">
                        Ukuran
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() =>
                                    toggleSelection(
                                        size,
                                        selectedSizes,
                                        setSelectedSizes
                                    )
                                }
                                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${selectedSizes.includes(size)
                                        ? 'border-primary-600 bg-gradient-primary text-white shadow-md shadow-primary-500/30 scale-105'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Finishings */}
            {availableFinishings.length > 0 && (
                <div>
                    <h4 className="mb-3 text-sm font-bold text-gray-900">
                        Finishing
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {availableFinishings.map((finishing) => (
                            <button
                                key={finishing}
                                onClick={() =>
                                    toggleSelection(
                                        finishing,
                                        selectedFinishings,
                                        setSelectedFinishings
                                    )
                                }
                                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${selectedFinishings.includes(finishing)
                                        ? 'border-primary-600 bg-gradient-primary text-white shadow-md shadow-primary-500/30 scale-105'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                                    }`}
                            >
                                {finishing}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock Status */}
            <div>
                <h4 className="mb-3 text-sm font-bold text-gray-900">
                    Ketersediaan
                </h4>
                <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                >
                    <option value="">Semua</option>
                    <option value="in_stock">Tersedia</option>
                    <option value="limited_stock">Stok Terbatas</option>
                    <option value="pre_order">Pre-Order</option>
                </select>
            </div>

            {/* Apply Button */}
            <Button
                variant="gradient"
                size="md"
                fullWidth
                onClick={handleApplyFilters}
                className="shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
                Terapkan Filter
            </Button>
        </div>
    );
}

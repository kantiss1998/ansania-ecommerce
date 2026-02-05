'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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

    return (
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                <button
                    onClick={handleReset}
                    className="text-sm font-medium text-primary-700 hover:text-primary-800"
                >
                    Reset
                </button>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900">
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
                    <span className="flex items-center text-gray-500">-</span>
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
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
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
                                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${selectedColors.includes(color)
                                        ? 'border-primary-700 bg-primary-700 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-700'
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
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
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
                                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${selectedSizes.includes(size)
                                        ? 'border-primary-700 bg-primary-700 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-700'
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
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
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
                                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${selectedFinishings.includes(finishing)
                                        ? 'border-primary-700 bg-primary-700 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary-700'
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
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                    Ketersediaan
                </h4>
                <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700"
                >
                    <option value="">Semua</option>
                    <option value="in_stock">Tersedia</option>
                    <option value="limited_stock">Stok Terbatas</option>
                    <option value="pre_order">Pre-Order</option>
                </select>
            </div>

            {/* Apply Button */}
            <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleApplyFilters}
            >
                Terapkan Filter
            </Button>
        </div>
    );
}

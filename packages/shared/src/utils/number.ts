/**
 * Number Utility Functions
 * 
 * Pure utility functions for number manipulation
 * Following CODING_STANDARDS.md - Framework Agnostic
 */

/**
 * Format number as Indonesian Rupiah currency
 * @param amount - Amount to format
 * @param includeSymbol - Include Rp symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, includeSymbol = true): string {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

    return includeSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Percentage value
 */
export function calculatePercentage(value: number, total: number, decimals = 2): number {
    if (total === 0) return 0;
    return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Calculate discount amount
 * @param price - Original price
 * @param discountPercentage - Discount percentage
 * @returns Discount amount
 */
export function calculateDiscount(price: number, discountPercentage: number): number {
    return Math.round(price * (discountPercentage / 100));
}

/**
 * Calculate final price after discount
 * @param price - Original price
 * @param discountPercentage - Discount percentage
 * @returns Final price
 */
export function calculateFinalPrice(price: number, discountPercentage: number): number {
    const discount = calculateDiscount(price, discountPercentage);
    return price - discount;
}

/**
 * Round number to specified decimal places
 * @param num - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function roundNumber(num: number, decimals = 2): number {
    return Number(num.toFixed(decimals));
}

/**
 * Clamp number between min and max
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

/**
 * Check if number is in range
 * @param num - Number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if in range
 */
export function isInRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
}

/**
 * Generate random number between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate tax amount
 * @param amount - Base amount
 * @param taxRate - Tax rate percentage (e.g., 11 for 11%)
 * @returns Tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
    return Math.round(amount * (taxRate / 100));
}

/**
 * Calculate total with tax
 * @param amount - Base amount
 * @param taxRate - Tax rate percentage
 * @returns Total with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number): number {
    const tax = calculateTax(amount, taxRate);
    return amount + tax;
}

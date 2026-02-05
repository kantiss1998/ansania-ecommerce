/**
 * Utility Functions for Shared Use
 */

/**
 * Format price to Indonesian Rupiah
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXX
 */
export function generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `ORD-${dateStr}-${random}`;
}

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
    price: number,
    discountType: 'percentage' | 'fixed_amount',
    discountValue: number,
    maxDiscount?: number
): number {
    let discount = 0;

    if (discountType === 'percentage') {
        discount = (price * discountValue) / 100;
        if (maxDiscount && discount > maxDiscount) {
            discount = maxDiscount;
        }
    } else {
        discount = discountValue;
    }

    return Math.min(discount, price); // Never discount more than the price
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(page: number, limit: number, total: number) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Delay/sleep utility for async operations
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number, suffix = '...'): string {
    if (text.length <= length) return text;
    return text.slice(0, length - suffix.length) + suffix;
}

/**
 * Check if email is valid format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Parse phone number to E.164 format
 */
export function parsePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }

    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }

    return '+' + cleaned;
}

/**
 * Generate random string
 */
export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Remove undefined/null values from object
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key as keyof T] = value;
        }
        return acc;
    }, {} as Partial<T>);
}

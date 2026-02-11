
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// Use shared utilities
import {
    formatCurrency as sharedFormatCurrency,
    formatDate as sharedFormatDate,
    truncate as sharedTruncate,
    isValidEmail as sharedIsValidEmail
} from '@repo/shared/utils';

/**
 * Utility function to merge class names
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
    return sharedFormatCurrency(amount);
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date): string {
    return sharedFormatDate(date);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
    return sharedFormatDate(date, true);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    return sharedTruncate(text, maxLength);
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
    return sharedIsValidEmail(email);
}

/**
 * Format phone number to Indonesian format
 * Keeping specific web formatting for visual appeal
 */
export function formatPhone(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format: +62 812-3456-7890
    if (cleaned.startsWith('62')) {
        const number = cleaned.slice(2);
        return `+62 ${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
    }

    // Format: 0812-3456-7890
    if (cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }

    return phone;
}

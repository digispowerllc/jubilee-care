/**
 * Utility functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names together with Tailwind-merge and clsx
 * @param inputs Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string
 * @param date Date object or string
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Converts a string to title case
 * @param str String to convert
 * @returns Title-cased string (e.g., "hello world" -> "Hello World")
 */
export function toTitleCase(str: string): string {
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
}

/**
 * Generates a random string ID
 * @param length Length of the ID (default: 16)
 * @returns Random string ID
 */
export function generateId(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Debounces a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
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
 * Truncates text with an ellipsis
 * @param text Text to truncate
 * @param length Maximum length before truncation
 * @returns Truncated text
 */
export function truncate(text: string, length: number): string {
    return text.length > length ? `${text.substring(0, length)}...` : text;
}

/**
 * Checks if a value is empty
 * @param value Value to check
 * @returns True if the value is empty, false otherwise
 */
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
    return false;
}

/**
 * Creates a currency formatter
 * @param locale Locale to use (default: 'en-US')
 * @param currency Currency to use (default: 'USD')
 * @returns Currency formatter function
 */
export function createCurrencyFormatter(
    locale: string = 'en-US',
    currency: string = 'USD'
): (value: number) => string {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    });

    return (value: number) => formatter.format(value);
}

// Type guard for error objects
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

/**
 * Delays execution for a given time
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the given time
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
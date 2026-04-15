import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Validate 10-word statement
 */
export function validateTenWordStatement(statement: string): {
  valid: boolean;
  wordCount: number;
  error?: string;
} {
  const words = statement.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { valid: false, wordCount, error: "Statement cannot be empty" };
  }
  if (wordCount > 10) {
    return {
      valid: false,
      wordCount,
      error: `Statement must be 10 words or less (currently ${wordCount})`,
    };
  }

  return { valid: true, wordCount };
}

/**
 * Generate a random ticker symbol
 */
export function generateTicker(name: string): string {
  const words = name.toUpperCase().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 4);
  }
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 4);
}

/**
 * Country code to flag emoji
 */
export function countryToFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility for animations/delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

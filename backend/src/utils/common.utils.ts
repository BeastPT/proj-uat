/**
 * Utility functions for common operations
 */

/**
 * Safely parse JSON without throwing an exception
 * @param json The JSON string to parse
 * @param fallback The fallback value if parsing fails
 * @returns The parsed JSON or fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Delay execution for a specified time
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value The value to check
 * @returns True if the value is empty, false otherwise
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

/**
 * Remove undefined properties from an object
 * @param obj The object to clean
 * @returns A new object without undefined properties
 */
export function removeUndefined<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.entries(obj as Record<string, unknown>).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      (acc as Record<string, unknown>)[key] = value;
    }
    return acc;
  }, {} as T);
}

/**
 * Format a date to a string (YYYY-MM-DD)
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Safely parse a date string without throwing an exception
 * @param dateStr The date string to parse
 * @param fallback The fallback date if parsing fails (defaults to current date)
 * @returns A valid Date object
 */
export function safeParseDate(dateStr: string | undefined, fallback: Date = new Date()): Date {
  if (!dateStr) return fallback;
  
  const parsedDate = new Date(dateStr);
  return isNaN(parsedDate.getTime()) ? fallback : parsedDate;
}

/**
 * Create a standardized error response object
 * @param message Error message
 * @param code Optional error code
 * @param details Optional additional details
 * @returns Error response object
 */
export function createErrorResponse(message: string, code?: string, details?: unknown): {
  error: string;
  code?: string;
  details?: unknown;
} {
  return {
    error: message,
    ...(code && { code }),
    ...(details && { details })
  };
}

/**
 * Calculate date difference in days
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of days between dates (rounded up)
 */
export function dateDiffInDays(startDate: Date, endDate: Date): number {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
/**
 * Utility Functions for Shared Use
 */

// Export utility modules
export * from "./string";
export * from "./number";
export * from "./date";

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${dateStr}-${random}`;
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number,
) {
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
 * Parse phone number to E.164 format
 * Note: prefer formatPhone from ./string if possible, but this forces +62
 */
export function parsePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // If starts with 0, replace with 62 (Indonesia country code)
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  // If doesn't start with 62, add it
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }

  return "+" + cleaned;
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
export function removeEmptyValues<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  const result: Partial<T> = {};
  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });
  return result;
}

/**
 * Convert array of objects to CSV string
 */
export function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  const firstRow = data[0];
  if (!firstRow) return "";

  const headers = Object.keys(firstRow);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const escaped = (val !== undefined && val !== null ? "" + val : "").replace(
        /"/g,
        '""',
      ); // Escape double quotes
      return `"${escaped}"`; // Wrap in double quotes
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

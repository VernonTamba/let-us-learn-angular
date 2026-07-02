/**
 * =============================================================================
 * HELPERS.TS - Utility Functions
 * =============================================================================
 *
 * 📘 KONSEP: Utility Functions & Pure Functions
 *
 * Best practices:
 * - Pure functions (no side effects)
 * - Well-typed (full TypeScript types)
 * - Single responsibility
 * - Well-documented
 * =============================================================================
 */

// ===== DATE UTILITIES =====

/** Format date ke ISO string tanpa timezone */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/** Parse ISO date string */
export function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return date;
}

/** Get date range (last N days) */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

// ===== NUMBER UTILITIES =====

/** Clamp number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Round to N decimal places */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Format large numbers (1000 → 1K, 1000000 → 1M) */
export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
}

// ===== STRING UTILITIES =====

/** Generate unique ID */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Slugify string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ===== ARRAY UTILITIES =====

/** Group array by key */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/** Sort array by key */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/** Remove duplicates by key */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

// ===== OBJECT UTILITIES =====

/** Deep clone object (structured clone) */
export function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

/** Pick specific keys from object */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/** Omit specific keys from object */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

// ===== VALIDATION UTILITIES =====

/** Check if value is empty (null, undefined, empty string, empty array) */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== COLOR UTILITIES (for charts) =====

/** Generate color palette for charts */
export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#1a237e', '#0277bd', '#2e7d32', '#ff6f00',
    '#d32f2f', '#7b1fa2', '#00695c', '#e65100',
    '#1565c0', '#558b2f'
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle for even distribution
    colors.push(`hsl(${hue}, 70%, 45%)`);
  }
  return colors;
}

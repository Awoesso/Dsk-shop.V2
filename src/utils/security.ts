/**
 * DSK-SHOP Security & Sanitization Utilities
 * Implements strict input validation, query bounded limits, XSS mitigation,
 * and safe error abstraction adhering to OWASP & Supabase security best practices.
 */

// Maximum records allowable in a single PostgREST fetch to prevent DOS/resource exhaustion
export const MAX_QUERY_LIMIT = 50;
export const DEFAULT_QUERY_LIMIT = 24;

/**
 * Sanitizes search input to prevent PostgREST / SQL filter injection.
 * PostgREST uses commas, colons, parentheses, and dots in its query grammar (e.g. `or=(...)`).
 * This removes dangerous characters and trims whitespace.
 */
export function sanitizeSearchQuery(query: unknown): string {
  if (typeof query !== 'string') {
    return '';
  }
  // Trim and limit length to 100 chars
  const trimmed = query.trim().slice(0, 100);
  // Remove PostgREST operator injection tokens: ( ) [ ] { } , ; : \ " ' ` %
  return trimmed.replace(/[()[\]{},;:\\"'`%]/g, '').trim();
}

/**
 * Validates and sanitizes a URL slug.
 * Slugs should only contain lowercase alphanumeric characters and hyphens.
 */
export function sanitizeSlug(slug: unknown): string {
  if (typeof slug !== 'string') {
    return '';
  }
  return slug
    .trim()
    .toLowerCase()
    .slice(0, 120)
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Enforces strict pagination boundaries to prevent payload abuse or DOS.
 */
export function clampPagination(
  page: number = 1,
  limit: number = DEFAULT_QUERY_LIMIT,
  maxLimit: number = MAX_QUERY_LIMIT
): { from: number; to: number; safeLimit: number; safePage: number } {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safeLimit = Math.min(maxLimit, Math.max(1, Math.floor(Number(limit) || DEFAULT_QUERY_LIMIT)));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  return { from, to, safeLimit, safePage };
}

/**
 * Sanitizes numeric filter values (prices, ratings, counts).
 */
export function sanitizeNumber(
  val: unknown,
  fallback: number = 0,
  min: number = 0,
  max: number = 10000000
): number {
  const num = Number(val);
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, num));
}

/**
 * Safe error abstraction.
 * Strips raw PostgreSQL error codes, internal table/column names, and database stack traces.
 * Returns a user-friendly, localized message for the UI.
 * Logs diagnostic details in development mode only.
 */
export interface SafeAppError {
  userMessage: string;
  isPolicyError?: boolean;
}

export function handleSecureError(
  error: unknown,
  context: string = 'Operation'
): SafeAppError {
  const isDev = Boolean(
    (typeof import.meta !== 'undefined' && import.meta?.env?.DEV) ||
    (typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production')
  );

  // Supabase / PostgREST error structures
  const postgrestError = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;

  const code = postgrestError?.code || '';

  // Safe developer logging (never exposes in production client logs)
  if (isDev) {
    console.group(`[DSK-Security] ${context} Error Caught`);
    console.warn('Sanitized Code:', code);
    console.warn('Internal Details:', postgrestError?.message || error);
    console.groupEnd();
  }

  // 42501 = insufficient_privilege (RLS policy violation)
  if (code === '42501' || code === 'PGRST301') {
    return {
      userMessage: 'Accès non autorisé ou ressource restreinte.',
      isPolicyError: true,
    };
  }

  // PGRST116 = JSON single row violation (not found)
  if (code === 'PGRST116') {
    return {
      userMessage: 'La ressource demandée est introuvable.',
    };
  }

  // Generic secure fallback - prevents any SQL syntax / schema disclosure
  return {
    userMessage: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer ultérieurement.',
  };
}

/**
 * Sanitizes dynamic HTML / text strings to prevent Cross-Site Scripting (XSS).
 */
export function sanitizeText(text: unknown): string {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

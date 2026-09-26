/**
 * Currency utility for DSK-Shop
 * Standard currency: Franc CFA (FCFA)
 * In database, prices are directly stored in FCFA (e.g. 130000, 12049)
 */

export const USD_TO_FCFA_RATE = 1;

/**
 * Formats an amount directly into formatted FCFA string (e.g. "130 000 FCFA")
 */
export const formatFCFA = (amountInFCFA: number): string => {
  if (!amountInFCFA || isNaN(amountInFCFA) || amountInFCFA <= 0) return '0 FCFA';
  const rounded = Math.round(amountInFCFA);
  return `${rounded.toLocaleString('fr-FR').replace(/,/g, ' ')} FCFA`;
};

/**
 * Format price helper: formats price stored directly in FCFA
 */
export const formatPrice = (price: number): string => {
  return formatFCFA(price);
};

export const toFCFA = (amount: number): number => {
  return Math.round(amount || 0);
};

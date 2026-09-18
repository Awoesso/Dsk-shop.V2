/**
 * Currency utility for DSK-Shop
 * Standard currency: Franc CFA (FCFA)
 * Conversion rate: 1 USD = 650 FCFA
 */

export const USD_TO_FCFA_RATE = 650;

/**
 * Converts a base USD amount to rounded integer FCFA
 */
export const toFCFA = (amountInUSD: number): number => {
  if (!amountInUSD || isNaN(amountInUSD) || amountInUSD <= 0) return 0;
  return Math.round(amountInUSD * USD_TO_FCFA_RATE);
};

/**
 * Formats a base USD amount into formatted FCFA string (e.g. "194 350 FCFA")
 */
export const formatPrice = (amountInUSD: number): string => {
  if (!amountInUSD || isNaN(amountInUSD) || amountInUSD <= 0) return '0 FCFA';
  const fcfa = toFCFA(amountInUSD);
  return `${fcfa.toLocaleString('fr-FR').replace(/,/g, ' ')} FCFA`;
};

/**
 * Formats an amount already in FCFA into formatted FCFA string
 */
export const formatFCFA = (amountInFCFA: number): string => {
  if (!amountInFCFA || isNaN(amountInFCFA) || amountInFCFA <= 0) return '0 FCFA';
  const rounded = Math.round(amountInFCFA);
  return `${rounded.toLocaleString('fr-FR').replace(/,/g, ' ')} FCFA`;
};

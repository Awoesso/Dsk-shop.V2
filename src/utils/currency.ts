/**
 * Currency utility for DSK-Shop
 * Standard currency: Franc CFA (FCFA)
 * Conversion rate: 1 USD = 650 FCFA
 */

export const USD_TO_FCFA_RATE = 650;

export const formatPrice = (amountInUSD: number): string => {
  if (amountInUSD === 0) return '0 FCFA';
  const fcfa = amountInUSD < 1000 ? Math.round(amountInUSD * USD_TO_FCFA_RATE) : Math.round(amountInUSD);
  return `${fcfa.toLocaleString('fr-FR').replace(/,/g, ' ')} FCFA`;
};

export const toFCFA = (amountInUSD: number): number => {
  return amountInUSD < 1000 ? Math.round(amountInUSD * USD_TO_FCFA_RATE) : Math.round(amountInUSD);
};

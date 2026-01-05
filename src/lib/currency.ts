// Algerian Dinar currency utilities
// TVA (Taxe sur la Valeur Ajoutée) rate in Algeria is 19%
const TVA_RATE = 0.19;

export interface PriceBreakdown {
  subtotal: number;
  tva: number;
  total: number;
}

/**
 * Calculate price breakdown with TVA for Algerian Dinars
 * @param amount - Base amount in DZD
 * @returns Object containing subtotal, TVA, and total
 */
export function calculatePriceWithTVA(amount: number): PriceBreakdown {
  const subtotal = amount;
  const tva = subtotal * TVA_RATE;
  const total = subtotal + tva;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Format amount in Algerian Dinars
 * @param amount - Amount to format
 * @returns Formatted string with DZD currency
 */
export function formatDZD(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format price breakdown for display
 * @param breakdown - Price breakdown object
 * @returns Formatted breakdown with labels
 */
export function formatPriceBreakdown(breakdown: PriceBreakdown) {
  return {
    subtotal: formatDZD(breakdown.subtotal),
    tva: formatDZD(breakdown.tva),
    total: formatDZD(breakdown.total),
  };
}

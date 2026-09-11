/**
 * Utility to convert Kobo amounts to formatted Naira strings.
 * e.g., 350000 Kobo = ₦3,500
 * e.g., 50000 Kobo = ₦500
 */
export function formatNairaFromKobo(kobo: number): string {
  const naira = Math.floor(kobo / 100);
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(naira);
  return `₦${formatted}`;
}

export function koboToNairaNumber(kobo: number): number {
  return kobo / 100;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

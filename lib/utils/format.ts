/**
 * Format an integer as Indonesian Rupiah, e.g. 1250000 -> "Rp1.250.000".
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compute discount percent from original/final price. Returns null when no
 * meaningful discount applies.
 */
export function discountPercent(
  original: number,
  final: number,
): number | null {
  if (!Number.isFinite(original) || !Number.isFinite(final)) return null;
  if (original <= 0 || final >= original) return null;
  return Math.round(((original - final) / original) * 100);
}

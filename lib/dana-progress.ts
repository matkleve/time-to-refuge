/** Decade marks for the log-scale dana meter (equal visual steps). */
export const DANA_LOG_MARKS = [10, 100, 1_000, 10_000, 100_000, 1_000_000] as const;

export const DANA_DEFAULT_TARGET = 1_000_000;

/**
 * Log₁₀ progress from €0 → target. Each decade (10 → 100 → … → 1M) is an
 * equal slice of the bar, so early dana moves the fill more than late dana.
 */
export function danaLogFill(currentEuros: number, targetEuros = DANA_DEFAULT_TARGET): number {
  if (!(targetEuros > 1) || !(currentEuros > 0)) return 0;
  if (currentEuros >= targetEuros) return 1;
  return Math.min(1, Math.log10(Math.max(currentEuros, 1)) / Math.log10(targetEuros));
}

/** European-style grouping: 1.000.000 */
export function formatEuroAmount(euros: number): string {
  const rounded = Math.max(0, Math.round(euros));
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatEuro(euros: number): string {
  return `${formatEuroAmount(euros)}€`;
}

export function shortMarkLabel(euros: number): string {
  if (euros >= 1_000_000) return "1M";
  if (euros >= 1_000) return `${euros / 1_000}k`;
  return String(euros);
}

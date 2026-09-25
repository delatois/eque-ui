export { cn } from "cn";

/**
 * Shared presentational formatters (TASKS.md 0.8).
 * All output is locale-stable (en-US) so Storybook snapshots and tabular
 * figures (Spline Sans Mono + `tabular` class) align across environments.
 */

/** Currency: 1234.5 → "$1,234.50". */
export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Percentage: 12.345 → "12.35%" (value already in percent units). */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/** Grouped number for APY/amount displays: 1234567.891 → "1,234,567.89". */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Wallet truncation: "0x1234...aBcD" (leading 6 incl. 0x, trailing 4). */
export function truncateAddress(
  address: string,
  leading = 6,
  trailing = 4
): string {
  if (address.length <= leading + trailing) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

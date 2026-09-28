/**
 * Chart mock data (Phase 5). Values are illustrative only.
 */
import type { ApyBreakdownDatum } from "@/components/organisms/ApyBreakdownChart";
import type { PerformanceDatum } from "@/components/organisms/PerformanceChart";

/** 8 epochs of APY breakdown, oldest first (TASKS.md 5.1). */
export const mockApyBreakdown: ApyBreakdownDatum[] = [  { label: "E41", base: 4.2, reward: 2.1, boost: 1.0 },
  { label: "E42", base: 4.5, reward: 2.4, boost: 1.2 },
  { label: "E43", base: 3.9, reward: 2.8, boost: 1.5 },
  { label: "E44", base: 5.1, reward: 3.0, boost: 1.1 },
  { label: "E45", base: 4.8, reward: 2.6, boost: 1.8 },
  { label: "E46", base: 5.4, reward: 3.2, boost: 1.4 },
  { label: "E47", base: 4.9, reward: 2.9, boost: 2.0 },
  { label: "E48", base: 5.2, reward: 3.1, boost: 1.7 },
];

const DAY_MS = 86_400_000;

/**
 * 180 days of performance history ending today, oldest first
 * (TASKS.md 5.3, revised 2026-09-28). Deterministic pseudo-random
 * walks — stable across builds.
 */
export const mockPerformanceHistory: PerformanceDatum[] = (() => {
  const out: PerformanceDatum[] = [];
  const end = Date.now();
  let tvl = 12_000_000;
  let price = 168;
  let apy = 7.2;
  for (let i = 179; i >= 0; i--) {
    tvl =
      tvl * (1 + 0.004 * Math.sin(i * 0.7) + 0.002 * Math.sin(i * 0.23 + 1.7)) +
      18_000;
    price = price * (1 + 0.006 * Math.sin(i * 0.5 + 0.9)) + 0.12;
    apy = Math.max(2, apy + 0.05 * Math.sin(i * 0.4) + 0.008);
    out.push({
      timestamp: end - i * DAY_MS,
      tvl: Math.round(tvl),
      price: Math.round(price * 100) / 100,
      apy: Math.round(apy * 100) / 100,
    });
  }
  return out;
})();

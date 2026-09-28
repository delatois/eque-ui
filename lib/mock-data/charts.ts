/**
 * Chart mock data (Phase 5). Values are illustrative only.
 */
import type { ApyBreakdownDatum } from "@/components/organisms/ApyBreakdownChart";
import type { TvlChartDatum } from "@/components/organisms/TvlPerformanceChart";

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
 * 180 days of TVL history ending today, oldest first (TASKS.md 5.3).
 * Deterministic pseudo-random walk — stable across builds.
 */
export const mockTvlHistory: TvlChartDatum[] = (() => {
  const out: TvlChartDatum[] = [];
  const end = Date.now();
  let v = 12_000_000;
  for (let i = 179; i >= 0; i--) {
    v =
      v *
        (1 + 0.004 * Math.sin(i * 0.7) + 0.002 * Math.sin(i * 0.23 + 1.7)) +
      18_000;
    out.push({ timestamp: end - i * DAY_MS, value: Math.round(v) });
  }
  return out;
})();

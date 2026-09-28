"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "cn";
import { formatTvl } from "@/lib/utils";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PercentageChangeIndicator } from "@/components/molecules/PercentageChangeIndicator";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export interface TvlChartDatum {
  /** Point timestamp (ms). */
  timestamp: number;
  /** TVL in USD. */
  value: number;
}

export type TvlRangeKey = "7D" | "30D" | "90D" | "ALL";

export interface TvlPerformanceChartProps {
  /** Chart title (default `"TVL history"`). */
  title?: string;
  /** Full history, oldest first — ranges slice from the latest point. */
  data: TvlChartDatum[];
  /** Initial range (uncontrolled). */
  defaultRange?: TvlRangeKey;
  /** Shows a skeleton instead of the chart. */
  loading?: boolean;
  /** Chart height in px (default 280). */
  height?: number;
  /** Fires on range change. */
  onRangeChange?: (range: TvlRangeKey) => void;
  /** Extra classes merged onto the root (tailwind-merge wins). */
  className?: string;
}

const DAY_MS = 86_400_000;

const RANGES: { key: TvlRangeKey; label: string; days: number | null }[] = [
  { key: "7D", label: "7D", days: 7 },
  { key: "30D", label: "30D", days: 30 },
  { key: "90D", label: "90D", days: 90 },
  { key: "ALL", label: "All", days: null },
];

const fullUsd = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function formatTick(timestamp: number, range: TvlRangeKey): string {
  const d = new Date(timestamp);
  if (range === "7D" || range === "30D")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: TvlChartDatum }[];
}) {
  const point = active && payload?.[0]?.payload;
  if (!point) return null;
  return (
    <div className="border border-border-subtle bg-surface-raised px-3 py-2.5">
      <p className="mb-1 font-mono text-xs text-text-tertiary">
        {new Date(point.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p className="font-mono text-sm font-bold text-primary">
        {fullUsd(point.value)}
      </p>
    </div>
  );
}

/**
 * Eque TVL/performance chart (TASKS.md 5.3) — area chart of historical
 * value with a 7D/30D/90D/All range selector, hover tooltip showing the
 * value at the point, and a range-change indicator in the header.
 * Loading and empty states included.
 */
function TvlPerformanceChart({
  title = "TVL history",
  data,
  defaultRange = "30D",
  loading = false,
  height = 280,
  onRangeChange,
  className,
}: TvlPerformanceChartProps) {
  const [range, setRange] = React.useState<TvlRangeKey>(defaultRange);
  const reduceMotion = usePrefersReducedMotion();
  const gradientId = React.useId();

  const end = data.length > 0 ? data[data.length - 1].timestamp : 0;
  const rangeDays = RANGES.find((r) => r.key === range)?.days ?? null;
  const visible =
    rangeDays == null
      ? data
      : data.filter((d) => d.timestamp >= end - rangeDays * DAY_MS);

  const latest = visible[visible.length - 1];
  const first = visible[0];
  const changePct =
    first && latest && first.value > 0
      ? ((latest.value - first.value) / first.value) * 100
      : 0;

  const handleRange = (key: TvlRangeKey) => {
    setRange(key);
    onRangeChange?.(key);
  };

  return (
    <figure
      data-slot="tvl-performance-chart"
      className={cn("border border-border-subtle bg-surface p-6", className)}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="font-heading text-base font-semibold text-text-primary">
            {title}
          </h3>
          {!loading && latest ? (
            <>
              <span className="font-mono text-sm font-bold text-text-primary">
                {fullUsd(latest.value)}
              </span>
              <PercentageChangeIndicator value={changePct} />
            </>
          ) : null}
        </div>
        <div
          role="group"
          aria-label="Time range"
          className="flex shrink-0 border border-border-subtle"
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={range === r.key}
              onClick={() => handleRange(r.key)}
              className={cn(
                "px-3 py-1.5 font-mono text-xs outline-none transition-colors duration-micro ease-eque focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary focus-visible:outline-offset-2",
                range === r.key
                  ? "bg-primary-a08 font-bold text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="w-full" style={{ height }} label="Loading chart" />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Performance data appears once the vault has onchain activity."
        />
      ) : (
        <div
          role="img"
          aria-label={`${title}: ${fullUsd(latest.value)} latest, ${changePct >= 0 ? "up" : "down"} ${Math.abs(changePct).toFixed(2)} percent over the selected ${range === "ALL" ? "full" : range} range.`}
        >
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={visible}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#1FFFC3" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#1FFFC3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#1A222D" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={{ stroke: "#1A222D" }}
                tick={{ fill: "#718094", fontSize: 11 }}
                tickFormatter={(t: number) => formatTick(t, range)}
                minTickGap={32}
                dy={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fill: "#718094", fontSize: 11 }}
                tickFormatter={(v: number) => formatTvl(v)}
                domain={[(dataMin: number) => dataMin * 0.92, "auto"]}
              />
              <RechartsTooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#1FFFC3", strokeOpacity: 0.35 }}
              />
              <Area
                type="linear"
                dataKey="value"
                stroke="#1FFFC3"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#1FFFC3",
                  stroke: "#070A0F",
                  strokeWidth: 2,
                }}
                isAnimationActive={!reduceMotion}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </figure>
  );
}

export { TvlPerformanceChart };

"use client"

import * as React from "react"
import { Progress as BaseProgress } from "@base-ui/react/progress"
import {
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { cn } from "cn"

export type ProgressBarVariant = "linear" | "segmented"

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Linear fill bar or §6.2.5 segmented blocks. */
  variant?: ProgressBarVariant
  /** Current value. Clamped to [min, max]. Ignored when `indeterminate`. */
  value?: number
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Indeterminate (loading) state: sweeps a sharp block across the track. */
  indeterminate?: boolean
  /** Segmented block count (default 20). */
  segments?: number
  /** Visible caption above the bar. */
  label?: string
  /** Render the computed percent beside the label. */
  showValue?: boolean
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

/**
 * Eque progress bar atom (TASKS.md 1.9, DESIGN.md §6.2.5).
 *
 * - `linear`: 8px sharp track in `surface-high`, `primary` fill that
 *   animates width on the §8 default duration.
 * - `segmented`: 8px-wide blocks with 2px gaps; filled blocks `primary`,
 *   empty blocks `surface-high`. No smooth rounded fills.
 * - `indeterminate`: a sharp block sweeps the track
 *   (`animate-progress-scan`); static under reduced-motion.
 *
 * Semantics come from the Base UI Root (`role="progressbar"` with
 * `aria-valuemin/max/now`; `aria-valuenow` omitted when indeterminate).
 * Non-interactive by design: no hover/press treatment applies.
 */
const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      variant = "linear",
      value = 0,
      min = 0,
      max = 100,
      indeterminate = false,
      segments = 20,
      label,
      showValue = false,
      className,
      ...props
    },
    ref
  ) => {
    const safeMax = max === min ? min + 1 : max
    const clamped = clamp(value, Math.min(min, safeMax), Math.max(min, safeMax))
    const span = Math.max(min, safeMax) - Math.min(min, safeMax)
    const ratio = span === 0 ? 0 : (clamped - Math.min(min, safeMax)) / span
    const percent = Math.round(ratio * 100)

    const segmentCount = Math.max(1, Math.floor(segments))
    const filledCount = indeterminate
      ? 0
      : Math.round(ratio * segmentCount)

    return (
      <BaseProgress.Root
        ref={ref}
        data-slot="progress-bar"
        data-variant={variant}
        value={indeterminate ? null : clamped}
        min={min}
        max={safeMax}
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {label || showValue ? (
          <div className="flex items-baseline justify-between gap-4">
            {label ? (
              <span className="font-body text-xs text-text-secondary">
                {label}
              </span>
            ) : (
              <span />
            )}
            {showValue && !indeterminate ? (
              <span className="font-heading text-xs text-text-primary tabular-nums">
                {percent}%
              </span>
            ) : null}
          </div>
        ) : null}
        {variant === "linear" ? (
          <ProgressTrack>
            {indeterminate ? (
              <span
                aria-hidden="true"
                data-testid="progress-scan"
                className="absolute inset-y-0 left-0 w-1/4 animate-progress-scan bg-primary"
              />
            ) : (
              <ProgressIndicator />
            )}
          </ProgressTrack>
        ) : (
          <div
            aria-hidden="true"
            data-slot="progress-segments"
            className="relative flex w-fit gap-0.5 overflow-hidden"
          >
            {Array.from({ length: segmentCount }, (_, i) => (
              <span
                key={i}
                data-filled={i < filledCount}
                className={cn(
                  "h-2 w-2 shrink-0",
                  i < filledCount ? "bg-primary" : "bg-surface-high"
                )}
              />
            ))}
            {indeterminate ? (
              <span
                data-testid="progress-scan"
                className="absolute inset-y-0 left-0 h-full w-2 animate-progress-scan bg-primary"
              />
            ) : null}
          </div>
        )}
      </BaseProgress.Root>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }

"use client"

import * as React from "react"
import { Fuel } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"

export type GasSpeed = "slow" | "standard" | "fast"

export interface GasEstimate {
  /** Fee in native token, e.g. "0.00042 ETH". */
  native: string
  /** Fee in USD, e.g. "$1.24". */
  usd: string
  /** Confirmation hint, e.g. "~5 min". */
  eta?: string
}

export interface GasFeeEstimatorProps {
  /** Estimates keyed by speed. */
  estimates?: Record<GasSpeed, GasEstimate>
  /** Selected speed (controlled). */
  speed?: GasSpeed
  /** Uncontrolled initial speed. */
  defaultSpeed?: GasSpeed
  /** Fires when the speed changes. */
  onSpeedChange?: (speed: GasSpeed) => void
  /** Loading state — renders skeletons while "estimating". */
  loading?: boolean
  /** Native token symbol, e.g. "ETH". */
  nativeSymbol?: string
  /** Extra classes merged onto the root. */
  className?: string
}

const SPEEDS: { id: GasSpeed; label: string }[] = [
  { id: "slow", label: "Slow" },
  { id: "standard", label: "Standard" },
  { id: "fast", label: "Fast" },
]

const FALLBACK_ESTIMATES: Record<GasSpeed, GasEstimate> = {
  slow: { native: "0.00021 ETH", usd: "$0.62", eta: "~5 min" },
  standard: { native: "0.00042 ETH", usd: "$1.24", eta: "~1 min" },
  fast: { native: "0.00089 ETH", usd: "$2.63", eta: "~15 sec" },
}

/**
 * Gas Fee Estimator (3.5) — estimated fee in native token + USD with a
 * Slow/Standard/Fast selector. The selected speed is highlighted with
 * the primary tint + label; a skeleton state covers "estimating".
 */
function GasFeeEstimator({
  estimates = FALLBACK_ESTIMATES,
  speed,
  defaultSpeed = "standard",
  onSpeedChange,
  loading = false,
  nativeSymbol = "ETH",
  className,
}: GasFeeEstimatorProps) {
  const [internal, setInternal] = React.useState<GasSpeed>(defaultSpeed)
  const selected = speed ?? internal

  const handleChange = (value: string) => {
    const next = value as GasSpeed
    setInternal(next)
    onSpeedChange?.(next)
  }

  if (loading) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 border border-subtle bg-surface p-4",
          className
        )}
        aria-label={`Estimating ${nativeSymbol} gas fee`}
        role="status"
      >
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-3 gap-2">
          {SPEEDS.map((s) => (
            <Skeleton key={s.id} className="h-[68px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-subtle bg-surface p-4",
        className
      )}
    >
      <p className="flex items-center gap-2 font-heading text-xs text-text-tertiary">
        <Fuel aria-hidden="true" className="size-3.5" />
        ESTIMATED GAS FEE
      </p>
      <RadioGroup
        value={selected}
        onValueChange={handleChange}
        className="grid grid-cols-3 gap-2"
        aria-label="Transaction speed"
      >
        {SPEEDS.map((s) => {
          const est = estimates[s.id]
          const isSelected = selected === s.id
          return (
            <label
              key={s.id}
              className={cn(
                "flex cursor-pointer flex-col gap-1 border p-3 transition-colors duration-micro ease-eque outline-none has-focus-visible:outline-2 has-focus-visible:outline-solid has-focus-visible:outline-primary",
                isSelected
                  ? "border-primary-a32 bg-primary-a08"
                  : "border-subtle bg-surface-raised hover:border-border-strong"
              )}
            >
              <span className="flex items-center gap-2">
                <RadioGroupItem
                  value={s.id}
                  aria-label={`${s.label} — ${est.native} (${est.usd})`}
                />
                <span
                  className={cn(
                    "font-heading text-xs font-medium",
                    isSelected ? "text-primary" : "text-text-secondary"
                  )}
                >
                  {s.label}
                </span>
              </span>
              <span className="font-heading text-sm text-text-primary tabular-nums">
                {est.native}
              </span>
              <span className="font-body text-xs text-text-tertiary tabular-nums">
                {est.usd}
                {est.eta ? ` · ${est.eta}` : null}
              </span>
            </label>
          )
        })}
      </RadioGroup>
      <p className="font-body text-xs text-text-tertiary">
        Fee paid in {nativeSymbol}. Actual cost depends on network congestion.
      </p>
    </div>
  )
}

export { GasFeeEstimator }

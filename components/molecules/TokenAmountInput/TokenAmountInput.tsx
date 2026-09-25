"use client"

import * as React from "react"
import { Button } from "@/components/atoms/Button"
import { Input, sanitizeAmount } from "@/components/atoms/Input"
import { Select } from "@/components/atoms/Select"
import { Slider } from "@/components/atoms/Slider"
import { MonoNumber } from "@/components/atoms/Typography"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { Token } from "@/lib/mock-data/tokens"
import mockupIcon from "@/assets/example-mockup.png"
import type { StaticImageData } from "next/image"
import { cn } from "cn"

/**
 * Mock token logo (user-supplied `assets/example-mockup.png`) — the
 * same placeholder the Select atom's stories use for network/token/
 * avatar art. Next image imports resolve to `{ src, … }` while Vite
 * resolves to a URL string; normalize to a plain URL for the `<img>`.
 * Every token shares the one mock image: placeholder art, not an icon
 * system (AGENTS.md §1), deliberately NOT abstracted into a Token
 * Icon component.
 */
export const TOKEN_ICON_SRC: string =
  typeof mockupIcon === "string"
    ? mockupIcon
    : (mockupIcon as StaticImageData).src

export interface TokenAmountInputProps {
  /** Currently selected token: ticker art + `decimals` cap. */
  token: Token
  /** Dropdown options (default `[token]`). Parent owns selection. */
  tokens?: Token[]
  /** Fires when the dropdown picks another token. */
  onTokenChange?: (token: Token) => void
  /** Available balance of the current token (Max target + slider base). */
  balance: number
  /** Token price in USD; when provided, an estimate renders below. */
  tokenPriceUsd?: number
  /** Field label (default "Amount"). */
  label?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Controlled value (string so mid-typing states like `"12."` survive). */
  value?: string
  /** String-level change handler (the Input atom sanitizes first). */
  onChange?: (value: string) => void
  /** External validation message (e.g. "Insufficient balance"). */
  error?: string
  /** Disables the field, dropdown, Max, and slider. */
  disabled?: boolean
  /** Field id; auto-generated when omitted (label stays associated). */
  id?: string
  /** Extra classes merged onto the root. */
  className?: string
}

/**
 * Format a number as a field-fill string: no grouping separators and
 * at most `decimals` fraction digits, without `toFixed` trailing
 * zeros. Used by Max and by the percentage slider.
 */
export function formatMaxValue(amount: number, decimals: number): string {
  const rounded =
    decimals === 0
      ? Math.trunc(amount)
      : parseFloat(amount.toFixed(decimals))
  return String(rounded)
}

/** Mock token artwork: 20px sharp image, decorative. */
function TokenArt() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local mock placeholder, not a production asset
    <img
      src={TOKEN_ICON_SRC}
      alt=""
      aria-hidden="true"
      data-slot="token-art"
      width={20}
      height={20}
      className="size-5 shrink-0"
    />
  )
}

/**
 * Eque token amount input molecule (2.3) — label + available-balance
 * line, amount field (`Input` number variant capped at the token's
 * decimals) beside a token dropdown (`Select` atom: mock art + ticker
 * trigger, token column-list popup) and a tertiary Max button, plus a
 * USD estimate line and a percentage-of-balance slider that stays
 * two-way in sync with the field. Uncontrolled by default; pass
 * `value`/`onChange` to control. The parent owns token selection
 * (balance/price swap with the token), so `token` is a controlled
 * prop with `onTokenChange`. Validation stays with the consumer via
 * `error`. No ref is forwarded: focus targets the inner input via
 * the associated label.
 */
function TokenAmountInput({
  token,
  tokens,
  onTokenChange,
  balance,
  tokenPriceUsd,
  label = "Amount",
  defaultValue = "",
  value: valueProp,
  onChange,
  error,
  disabled = false,
  id: idProp,
  className,
}: TokenAmountInputProps) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = valueProp ?? internalValue
  const options = tokens ?? [token]

  const commit = (next: string) => {
    if (valueProp === undefined) setInternalValue(next)
    onChange?.(next)
  }

  const handleMax = () => {
    commit(formatMaxValue(balance, token.decimals))
  }

  const handleTokenSelect = (symbol: string | null) => {
    if (symbol == null) return
    const next = options.find((t) => t.symbol === symbol)
    if (!next || next.symbol === token.symbol) return
    // Keep the typed amount, re-capped to the new token's decimals.
    commit(sanitizeAmount(value, next.decimals))
    onTokenChange?.(next)
  }

  const parsed = parseFloat(value)
  const estimate =
    tokenPriceUsd !== undefined && Number.isFinite(parsed)
      ? parsed * tokenPriceUsd
      : 0

  const percent =
    balance > 0 && Number.isFinite(parsed)
      ? Math.min(100, Math.max(0, (parsed / balance) * 100))
      : 0

  const handleSlider = (next: number | readonly number[]) => {
    const pct = (Array.isArray(next) ? next : [next])[0] ?? 0
    commit(formatMaxValue((balance * pct) / 100, token.decimals))
  }

  return (
    <div
      data-slot="token-amount-input"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="font-heading text-xs font-medium text-text-secondary"
        >
          {label}
        </label>
        <p
          data-slot="token-amount-balance"
          className="truncate font-body text-xs text-tertiary"
        >
          Available {formatNumber(balance)} {token.symbol}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Input
            variant="number"
            decimals={token.decimals}
            id={id}
            value={value}
            onChange={(e) => commit(e.target.value)}
            error={error}
            disabled={disabled}
            placeholder="0.00"
          />
        </div>
        <Select
          options={options.map((t) => ({
            value: t.symbol,
            label: (
              <span className="flex items-center gap-1.5">
                <TokenArt />
                <span className="font-heading text-[11px] font-medium uppercase">
                  {t.symbol}
                </span>
              </span>
            ),
          }))}
          value={token.symbol}
          onValueChange={handleTokenSelect}
          disabled={disabled}
          label={<span className="sr-only">Token</span>}
          className="w-auto shrink-0"
          triggerClassName="w-auto px-2.5"
        />
        <Button
          variant="tertiary"
          size="sm"
          onClick={handleMax}
          disabled={disabled}
          aria-label={`Use max ${token.symbol} balance`}
        >
          Max
        </Button>
      </div>
      {tokenPriceUsd !== undefined ? (
        <p data-slot="token-amount-estimate">
          <MonoNumber className="text-xs text-text-secondary">
            ≈ {formatCurrency(estimate)}
          </MonoNumber>
        </p>
      ) : null}
      <div data-slot="token-amount-slider">
        <Slider
          value={[percent]}
          onValueChange={handleSlider}
          disabled={disabled || balance <= 0}
          thumbLabels={["Amount percentage"]}
          showValue
          formatValue={(v) => `${Math.round(v)}%`}
        />
      </div>
    </div>
  )
}

export { TokenAmountInput }

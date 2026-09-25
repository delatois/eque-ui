"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox"
import { cn } from "cn"

export interface CheckboxProps {
  /** Controlled ticked state. */
  checked?: boolean
  /** Uncontrolled initial ticked state. */
  defaultChecked?: boolean
  /**
   * Mixed state: dash glyph + `aria-checked="mixed"`. Controlled-only
   * (Base UI exposes no uncontrolled indeterminate) — pass with a
   * parent handler for tri-state behavior.
   */
  indeterminate?: boolean
  /** Fires with the next ticked state on toggle (narrowed from the Base UI handler — no event wrapping). */
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  /** Inline label beside the box. Omit only when `ariaLabel` is set. */
  label?: React.ReactNode
  /** Caption below the label. */
  description?: React.ReactNode
  /** Accessible name when no visible `label` is rendered. */
  ariaLabel?: string
  id?: string
  /** Wrapper (row) classes. */
  className?: string
  /** Box classes, merged over the primitive treatment. */
  boxClassName?: string
}

/**
 * Eque checkbox atom (DESIGN.md §7.2) — 16px sharp box with an inline
 * label. Checked and indeterminate fill `primary` (check vs dash
 * glyph); the label toggles via `htmlFor`, so the whole row is
 * clickable and keyboard support comes from the Base UI primitive.
 */
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      label,
      description,
      ariaLabel,
      id: idProp,
      className,
      boxClassName,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <CheckboxPrimitive
          ref={ref}
          id={id}
          disabled={disabled}
          aria-label={label ? undefined : ariaLabel}
          className={cn("mt-0.5", boxClassName)}
          {...props}
        />
        {label || description ? (
          <div className="min-w-0">
            {label ? (
              <label
                htmlFor={id}
                className={cn(
                  "block cursor-pointer font-heading text-sm leading-5 text-text-primary",
                  disabled && "cursor-not-allowed text-text-disabled"
                )}
              >
                {label}
              </label>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "mt-1 font-body text-xs text-text-tertiary",
                  disabled && "text-text-disabled"
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

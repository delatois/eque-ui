"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@/components/ui/switch"
import { cn } from "cn"

export interface SwitchProps {
  /** Controlled state. */
  checked?: boolean
  /** Uncontrolled initial state. */
  defaultChecked?: boolean
  /** Fires with the next state on toggle (narrowed from the Base UI handler — no event wrapping). */
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  /** Label left of the control. Omit only when `ariaLabel` is set. */
  label?: React.ReactNode
  /** Caption below the label. */
  description?: React.ReactNode
  /** Accessible name when no visible `label` is rendered. */
  ariaLabel?: string
  id?: string
  /** Wrapper (row) classes. */
  className?: string
  /** Control classes, merged over the primitive treatment. */
  controlClassName?: string
}

/**
 * Eque switch atom (DESIGN.md §7.2) — settings row with the label on
 * the left and the 36×20 control on the right. Label and control are
 * both 20px tall, so the row aligns by construction; the label toggles
 * via `htmlFor` and keyboard support comes from the Base UI primitive.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      description,
      ariaLabel,
      id: idProp,
      className,
      controlClassName,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId

    return (
      <div className={cn("flex w-full items-start justify-between gap-4", className)}>
        {label || description ? (
          <div className="min-w-0 flex-1">
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
        <SwitchPrimitive
          ref={ref}
          id={id}
          disabled={disabled}
          aria-label={label ? undefined : ariaLabel}
          className={controlClassName}
          {...props}
        />
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

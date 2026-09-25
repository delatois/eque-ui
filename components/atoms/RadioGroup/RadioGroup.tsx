"use client"

import * as React from "react"
import {
  RadioGroup as RadioGroupPrimitive,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { cn } from "cn"

export interface RadioOption {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Controlled selection (option value). */
  value?: string
  /** Uncontrolled initial selection. */
  defaultValue?: string
  /** Fires with the next value on select (narrowed from the Base UI handler — no event wrapping). */
  onValueChange?: (value: string) => void
  options: RadioOption[]
  /** Group label above the options (Mono, Input-label language). */
  label?: React.ReactNode
  name?: string
  /** Disables the whole group. */
  disabled?: boolean
  id?: string
  className?: string
  itemClassName?: string
}

/**
 * Eque radio group atom (DESIGN.md §7.2) — single-select stack.
 * Rows reuse the checkbox atom's geometry (16px control, `mt-0.5`,
 * block Mono label + caption) so box–text alignment carries over.
 * Arrow-key navigation comes from the Base UI group primitive.
 */
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      label,
      disabled = false,
      id: idProp,
      className,
      itemClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId

    return (
      <div className={cn("w-full", className)}>
        {label ? (
          <p
            id={`${id}-label`}
            className="mb-2 font-heading text-xs font-medium text-text-secondary"
          >
            {label}
          </p>
        ) : null}
        <RadioGroupPrimitive
          ref={ref}
          id={id}
          disabled={disabled}
          aria-labelledby={label ? `${id}-label` : undefined}
          {...props}
        >
          {options.map((option) => {
            const itemDisabled = disabled || option.disabled
            const itemId = `${id}-${option.value}`
            return (
              <div
                key={option.value}
                className={cn("flex items-start gap-3", itemClassName)}
              >
                <RadioGroupItem
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <label
                    htmlFor={itemId}
                    className={cn(
                      "block cursor-pointer font-heading text-sm leading-5 text-text-primary",
                      itemDisabled && "cursor-not-allowed text-text-disabled"
                    )}
                  >
                    {option.label}
                  </label>
                  {option.description ? (
                    <p
                      className={cn(
                        "mt-1 font-body text-xs text-text-tertiary",
                        itemDisabled && "text-text-disabled"
                      )}
                    >
                      {option.description}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </RadioGroupPrimitive>
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }

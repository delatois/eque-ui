"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

/**
 * Eque radio group shell (DESIGN.md §7.2) — vertical stack of options.
 */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    />
  )
}

/**
 * Eque radio item (DESIGN.md §7.2) — 16px circle (the permitted
 * exception to the sharp-corner language, so single-select reads
 * differently from the square checkbox). Selected fills `primary`
 * with an `on-primary` center dot; hover/focus/active/disabled mirror
 * the checkbox primitive.
 */
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-default bg-transparent text-on-primary outline-none transition-colors duration-micro ease-eque",
        "hover:border-border-strong hover:bg-hover-overlay",
        "focus-visible:border-primary focus-visible:shadow-halo",
        "active:bg-primary-a16",
        "data-checked:border-primary data-checked:bg-primary data-checked:hover:border-primary data-checked:hover:bg-primary-hover data-checked:active:bg-primary-pressed",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-default disabled:hover:bg-transparent data-checked:disabled:hover:bg-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="grid place-content-center"
      >
        <span className="size-1.5 rounded-full bg-on-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }

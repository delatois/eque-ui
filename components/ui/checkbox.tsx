"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"

/**
 * Eque checkbox primitive (DESIGN.md §7.2) — 16px sharp square.
 * Unchecked is transparent with a `border-default` edge; checked and
 * indeterminate fill `primary` with an `on-primary` glyph (check vs
 * dash, swapped via the root `data-indeterminate` attribute — Base UI
 * exposes indeterminate as a separate boolean prop, not a checked
 * value). Focus uses the system halo; hover/active follow the button
 * tint ladder.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-none border border-border-default bg-transparent text-on-primary outline-none transition-colors duration-micro ease-eque",
        "hover:border-border-strong hover:bg-hover-overlay",
        "focus-visible:border-primary focus-visible:shadow-halo",
        "active:bg-primary-a16",
        "data-checked:border-primary data-checked:bg-primary data-checked:hover:border-primary data-checked:hover:bg-primary-hover data-checked:active:bg-primary-pressed",
        "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:hover:border-primary data-indeterminate:hover:bg-primary-hover data-indeterminate:active:bg-primary-pressed",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-default disabled:hover:bg-transparent data-checked:disabled:hover:bg-primary data-indeterminate:disabled:hover:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3"
      >
        <CheckIcon
          strokeWidth={3}
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="group-data-indeterminate:hidden"
        />
        <MinusIcon
          strokeWidth={3}
          strokeLinecap="square"
          className="hidden group-data-indeterminate:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

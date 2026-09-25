"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"
import { cn } from "cn"

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type SpinnerSize = NonNullable<
  VariantProps<typeof spinnerVariants>["size"]
>

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Screen-reader text announced with the indicator.
   * Defaults to "Loading"; stays visually hidden.
   */
  label?: string
}

/**
 * Eque spinner atom (1.10) — the single canonical pending indicator.
 * Same `LoaderCircle` glyph the Button loading state uses, in
 * `primary` at sm/md/lg (12/16/24px). Exposes `role="status"` with a
 * visually-hidden label so assistive tech announces it; the spin
 * freezes under the global `prefers-reduced-motion` reset.
 */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size, label = "Loading", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="spinner"
        role="status"
        // `status` takes its accessible name from author (aria-label),
        // never from contents — the sr-only text below is the live-region
        // announcement, the label is the name. Both carry `label`.
        aria-label={label}
        className={cn("inline-flex shrink-0 items-center", className)}
        {...props}
      >
        <LoaderCircle
          className={cn(spinnerVariants({ size }))}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </span>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }

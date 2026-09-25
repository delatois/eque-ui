"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "cn"

/**
 * Eque progress primitive (TASKS.md 1.9, DESIGN.md §6.2.5).
 *
 * - Track: 8px (`h-2`, matching the §6.2.5 block width), sharp
 *   (`rounded-none` — no smooth rounded fills), `surface-high`
 *   (`#1A222D`, the §6.2.5 empty-block color) so linear and segmented
 *   share one track language.
 * - Indicator: `primary` fill; width is set inline by Base UI from the
 *   Root value and animates on the §8 default duration.
 * - Label/Value parts use Caption (`font-body text-xs`); numbers render
 *   in the heading (Mono) stack with tabular figures.
 *
 * Every color, radius, font, and motion token comes from
 * `app/globals.css` — no raw hex, no arbitrary values.
 */
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-2 w-full items-center overflow-hidden rounded-none bg-surface-high",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full bg-primary transition-[width] duration-default ease-eque",
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("font-body text-xs text-text-secondary", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto font-heading text-xs text-text-primary tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}

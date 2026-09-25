"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

/**
 * Eque switch primitive (DESIGN.md §7.2) — 36×20 sharp track with a
 * square thumb. Off is `surface` + `border-default` with a tertiary
 * thumb; on fills `primary` with an `on-primary` thumb. Hover, focus
 * halo, pressed, and disabled follow the checkbox/radio ladder.
 */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-none border border-border-default bg-surface px-[3px] outline-none transition-colors duration-micro ease-eque",
        "hover:border-border-strong hover:bg-surface-raised",
        "focus-visible:border-primary focus-visible:shadow-halo",
        "active:bg-surface-high",
        "data-checked:border-primary data-checked:bg-primary data-checked:hover:border-primary data-checked:hover:bg-primary-hover data-checked:active:bg-primary-pressed",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-default disabled:hover:bg-surface data-checked:disabled:hover:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-3 rounded-none bg-text-tertiary transition-transform duration-micro ease-eque data-checked:translate-x-4 data-checked:bg-on-primary"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

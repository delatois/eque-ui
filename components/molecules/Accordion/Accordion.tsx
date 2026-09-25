"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "cn"

/** One collapsible section. */
export interface AccordionItemDef {
  /** Stable value identifying the item. */
  value: string
  /** Trigger row content (usually a short text label). */
  title: React.ReactNode
  /** Panel content revealed on expand. */
  content: React.ReactNode
  /** Disabled items can't be toggled. */
  disabled?: boolean
}

export interface AccordionProps {
  /** Collapsible sections. */
  items: AccordionItemDef[]
  /** Allow several items open at once (default false). */
  multiple?: boolean
  /** Controlled open values. */
  value?: string[]
  /** Uncontrolled initial open values. */
  defaultValue?: string[]
  /** Fires with the new open values on every toggle. */
  onValueChange?: (value: string[]) => void
  /** Extra classes merged onto the root (tailwind-merge wins). */
  className?: string
}

/**
 * Eque accordion molecule (2.10) — sharp hairline-divided sections
 * with an animated expand/collapse. The panel height animates via
 * Base UI's `--accordion-panel-height` (`animate-accordion-down/up`);
 * the global `prefers-reduced-motion` reset collapses the motion to
 * an instant open/close. Single mode keeps one section open at a
 * time; `multiple` allows several.
 */
function Accordion({
  items,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  className,
}: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      className={cn(
        "w-full rounded-none border border-subtle bg-surface",
        className
      )}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          data-slot="accordion-item"
          data-value={item.value}
          className="not-last:border-b not-last:border-subtle"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              className={cn(
                "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
                "font-heading text-sm font-medium text-text-primary",
                "transition-colors duration-micro ease-eque hover:bg-canvas",
                "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                "[&[aria-expanded=true]_svg]:rotate-180"
              )}
            >
              <span className="min-w-0">{item.title}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-text-tertiary transition-transform duration-default ease-eque"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Panel
            data-slot="accordion-panel"
            className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down"
          >
            <div className="h-(--accordion-panel-height) px-4 pt-1 pb-4 font-body text-sm text-text-secondary data-ending-style:h-0 data-starting-style:h-0">
              {item.content}
            </div>
          </AccordionPrimitive.Panel>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

export { Accordion }

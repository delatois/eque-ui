import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"
import { Info } from "lucide-react"
import { Tooltip } from "./Tooltip"

/**
 * Eque Tooltip (TASKS.md 1.8, DESIGN.md §7.8) — `surface-high` popup
 * with a hairline border, `rounded-sm` corners, Caption text, and a
 * 300ms open delay. Opens on hover and on keyboard focus; Escape
 * dismisses. The sharp arrow notch is opt-in via `showArrow`.
 */
const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex w-[480px] max-w-[90vw] items-center justify-center py-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "text",
      description: "Tooltip body",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Popup side",
      table: { defaultValue: { summary: "top" } },
    },
    showArrow: {
      control: "boolean",
      description: "Render the sharp arrow notch",
      table: { defaultValue: { summary: "false" } },
    },
    delay: {
      control: "number",
      description: "Open delay in ms (DESIGN §7.8: 300)",
      table: { defaultValue: { summary: "300" } },
    },
    children: {
      table: { disable: true },
    },
    open: {
      table: { disable: true },
    },
    defaultOpen: {
      table: { disable: true },
    },
    onOpenChange: {
      table: { disable: true },
    },
  },
  args: {
    content: "Auto-compounds every hour.",
    children: "Hover me",
    side: "top",
    showArrow: false,
    delay: 300,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

function TextTriggerButton(
  props: { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { label, className, ...rest } = props
  return (
    <button
      type="button"
      {...rest}
      className={`cursor-pointer border border-border-default bg-transparent px-4 font-heading text-sm text-text-primary transition-colors duration-micro ease-eque hover:border-border-strong ${className ?? ""}`}
      style={{ height: 44 }}
    >
      {label}
    </button>
  )
}

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TextTriggerButton label="Hover or focus me" />
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Hover or focus me" })
    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(screen.getByText("Auto-compounds every hour.")).toBeInTheDocument()
    await userEvent.unhover(trigger)
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    })
  },
}

export const WithArrow: Story = {
  args: {
    showArrow: true,
    content: "Audited by Trail of Bits, March 2026.",
  },
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        aria-label="Audit info"
        className="flex size-11 cursor-pointer items-center justify-center border border-border-default bg-transparent text-text-secondary transition-colors duration-micro ease-eque hover:border-border-strong hover:text-primary"
      >
        <Info className="size-5" strokeWidth={1.5} strokeLinecap="square" aria-hidden="true" />
      </button>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Audit info" })
    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText("Audited by Trail of Bits, March 2026.")
    ).toBeInTheDocument()
  },
}

export const LongContent: Story = {
  args: {
    content:
      "Strategies shift funds between pools when a better risk-adjusted yield appears. Rebalancing is automatic and never needs a signature.",
  },
  render: (args) => (
    <Tooltip {...args}>
      <span className="font-body text-base text-text-secondary">
        How does rebalancing work?
      </span>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByText("How does rebalancing work?")
    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText(/Rebalancing is automatic/)
    ).toBeInTheDocument()
  },
}

export const KeyboardFocus: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TextTriggerButton label="Tab to me" />
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Tab to me" })
    trigger.focus()
    await expect(trigger).toHaveFocus()
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    })
  },
}

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} content={`${side} tooltip`} side={side} delay={0}>
          <TextTriggerButton label={side} />
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const side of ["top", "right", "bottom", "left"]) {
      const trigger = canvas.getByRole("button", { name: side })
      await userEvent.hover(trigger)
      await waitFor(() => {
        expect(screen.getByText(`${side} tooltip`)).toBeInTheDocument()
      })
      await userEvent.unhover(trigger)
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
      })
    }
  },
}

export const ApyBreakdown: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Tooltip
        delay={0}
        content={
          <span className="flex flex-col gap-1 font-heading tabular">
            <span>Base 8.20%</span>
            <span>Reward 3.10%</span>
            <span>Boost 1.10%</span>
          </span>
        }
      >
        <span className="cursor-help font-heading text-sm text-primary underline decoration-border-strong decoration-dotted underline-offset-4">
          12.40% APY
        </span>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByText("12.40% APY")
    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(screen.getByText("Base 8.20%")).toBeInTheDocument()
    await expect(screen.getByText("Boost 1.10%")).toBeInTheDocument()
  },
}

export const Open: Story = {
  render: () => (
    <Tooltip content="Always-on for screenshots." defaultOpen delay={0}>
      <TextTriggerButton label="Pinned open" />
    </Tooltip>
  ),
  play: async () => {
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText("Always-on for screenshots.")
    ).toBeInTheDocument()
  },
}

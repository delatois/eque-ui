import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, userEvent, within } from "storybook/test"
import { Tabs, type TabDef } from "./Tabs"

const vaultTabs: TabDef[] = [
  {
    value: "nvda",
    label: "NVDA",
    content: "NVDA vault — epoch 42, 18.2% APY.",
  },
  {
    value: "aapl",
    label: "AAPL",
    content: "AAPL vault — epoch 42, 12.7% APY.",
  },
  {
    value: "tsla",
    label: "TSLA",
    content: "TSLA vault — epoch 42, 24.9% APY.",
  },
  {
    value: "meta",
    label: "META",
    content: "META vault — epoch 42, 15.3% APY.",
  },
]

/**
 * Eque Tabs (2.9) — underline-active style per DESIGN.md §7.5.
 * Arrow-key navigation via roving tabindex; disabled tabs are
 * skipped.
 */
const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onValueChange: { action: "change" },
  },
  args: {
    tabs: vaultTabs,
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nvda = canvas.getByRole("tab", { name: "NVDA" })
    await expect(nvda).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByText(/NVDA vault/)).toBeVisible()
  },
}

export const ClickToSwitch: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("tab", { name: "TSLA" }))
    await expect(args.onValueChange).toHaveBeenCalledWith("tsla")
    await expect(
      canvas.getByRole("tab", { name: "TSLA" })
    ).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByText(/TSLA vault/)).toBeVisible()
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nvda = canvas.getByRole("tab", { name: "NVDA" })
    nvda.focus()
    // ArrowRight moves to (and activates) the next tab.
    await userEvent.keyboard("{ArrowRight}")
    await expect(
      canvas.getByRole("tab", { name: "AAPL" })
    ).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByText(/AAPL vault/)).toBeVisible()
    // ArrowLeft moves back.
    await userEvent.keyboard("{ArrowLeft}")
    await expect(nvda).toHaveAttribute("aria-selected", "true")
  },
}

export const WithDisabled: Story = {
  args: {
    tabs: vaultTabs.map((t) =>
      t.value === "tsla" ? { ...t, disabled: true } : t
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tsla = canvas.getByRole("tab", { name: "TSLA" })
    await expect(tsla).toBeDisabled()
    await expect(tsla).toHaveAttribute("aria-disabled", "true")
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("aapl")
    return (
      <div className="flex flex-col gap-4">
        <Tabs
          {...args}
          value={value}
          onValueChange={(v) => {
            args.onValueChange?.(v)
            setValue(v)
          }}
        />
        <p className="font-body text-sm text-text-tertiary">
          Active vault: {value.toUpperCase()}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Active vault: AAPL")).toBeVisible()
    await userEvent.click(canvas.getByRole("tab", { name: "META" }))
    await expect(canvas.getByText("Active vault: META")).toBeVisible()
  },
}

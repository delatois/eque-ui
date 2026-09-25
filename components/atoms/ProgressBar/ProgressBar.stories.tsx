import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { ProgressBar } from "./ProgressBar"

/**
 * Eque Progress Bar (TASKS.md 1.9, DESIGN.md §6.2.5) — linear fill bar
 * and segmented blocks (8px blocks, 2px gaps, filled `primary`, empty
 * `surface-high`). Determinate values clamp to [min, max]; the
 * indeterminate state sweeps a sharp block across the track.
 */
const meta = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex w-[480px] max-w-[90vw] flex-col justify-center gap-8 py-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "segmented"],
      description: "Linear fill bar or segmented blocks",
      table: { defaultValue: { summary: "linear" } },
    },
    value: {
      control: "number",
      description: "Current value (clamped to [min, max])",
      table: { defaultValue: { summary: "0" } },
    },
    min: {
      control: "number",
      description: "Minimum value",
      table: { defaultValue: { summary: "0" } },
    },
    max: {
      control: "number",
      description: "Maximum value",
      table: { defaultValue: { summary: "100" } },
    },
    indeterminate: {
      control: "boolean",
      description: "Loading state (sweeps a block across the track)",
      table: { defaultValue: { summary: "false" } },
    },
    segments: {
      control: "number",
      description: "Segmented block count",
      table: { defaultValue: { summary: "20" } },
    },
    label: {
      control: "text",
      description: "Visible caption above the bar",
    },
    showValue: {
      control: "boolean",
      description: "Render the computed percent beside the label",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    variant: "linear",
    value: 62,
    min: 0,
    max: 100,
    indeterminate: false,
    segments: 20,
    showValue: false,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    "aria-label": "Deposit progress",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Deposit progress" })
    await expect(bar).toBeInTheDocument()
    await expect(bar).toHaveAttribute("aria-valuenow", "62")
    await expect(bar).toHaveAttribute("aria-valuemin", "0")
    await expect(bar).toHaveAttribute("aria-valuemax", "100")
  },
}

export const Empty: Story = {
  args: {
    value: 0,
    "aria-label": "Empty progress",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Empty progress" })
    await expect(bar).toHaveAttribute("aria-valuenow", "0")
  },
}

export const Complete: Story = {
  args: {
    value: 100,
    "aria-label": "Complete progress",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Complete progress" })
    await expect(bar).toHaveAttribute("aria-valuenow", "100")
  },
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    "aria-label": "Loading vaults",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Loading vaults" })
    await expect(bar).toBeInTheDocument()
    await expect(bar).not.toHaveAttribute("aria-valuenow")
    await expect(canvas.getByTestId("progress-scan")).toBeInTheDocument()
  },
}

export const Segmented: Story = {
  args: {
    variant: "segmented",
    value: 62,
    segments: 20,
    "aria-label": "Segmented progress",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Segmented progress" })
    await expect(bar).toHaveAttribute("aria-valuenow", "62")
    // 62% of 20 segments rounds to 12 filled blocks.
    const filled = bar.querySelectorAll('[data-filled="true"]')
    await expect(filled.length).toBe(12)
    const all = bar.querySelectorAll('[data-slot="progress-segments"] > span')
    await expect(all.length).toBe(20)
  },
}

export const SegmentedComplete: Story = {
  args: {
    variant: "segmented",
    value: 100,
    segments: 20,
    "aria-label": "Segmented complete",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Segmented complete" })
    const filled = bar.querySelectorAll('[data-filled="true"]')
    await expect(filled.length).toBe(20)
  },
}

export const SegmentedIndeterminate: Story = {
  args: {
    variant: "segmented",
    indeterminate: true,
    segments: 20,
    "aria-label": "Segmented loading",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Segmented loading" })
    await expect(bar).not.toHaveAttribute("aria-valuenow")
    const filled = bar.querySelectorAll('[data-filled="true"]')
    await expect(filled.length).toBe(0)
    await expect(canvas.getByTestId("progress-scan")).toBeInTheDocument()
  },
}

export const WithLabel: Story = {
  args: {
    value: 62,
    label: "Strategy allocation",
    showValue: true,
    "aria-label": "Strategy allocation",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("progressbar", { name: "Strategy allocation" })
    ).toBeInTheDocument()
    await expect(canvas.getByText("Strategy allocation")).toBeInTheDocument()
    await expect(canvas.getByText("62%")).toBeInTheDocument()
  },
}

export const VaultCapacity: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ProgressBar
        aria-label="USDC vault capacity"
        label="USDC vault · 2.4M / 5M"
        showValue
        value={2_400_000}
        max={5_000_000}
      />
      <ProgressBar
        aria-label="ETH vault capacity segments"
        variant="segmented"
        segments={24}
        value={91}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const linear = canvas.getByRole("progressbar", {
      name: "USDC vault capacity",
    })
    await expect(linear).toHaveAttribute("aria-valuenow", "2400000")
    await expect(canvas.getByText("48%")).toBeInTheDocument()
    const segmented = canvas.getByRole("progressbar", {
      name: "ETH vault capacity segments",
    })
    // 91% of 24 segments rounds to 22 filled blocks.
    await expect(
      segmented.querySelectorAll('[data-filled="true"]').length
    ).toBe(22)
  },
}

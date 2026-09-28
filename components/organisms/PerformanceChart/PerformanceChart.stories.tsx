import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, within } from "storybook/test"
import { PerformanceChart } from "./PerformanceChart"
import { mockPerformanceHistory } from "@/lib/mock-data/charts"

/**
 * Performance Chart (5.3, revised 2026-09-28) — area chart with a
 * metric dropdown (TVL / Asset price / APY) and a 7D/30D/90D/All
 * range selector. Switching the metric updates the series, the
 * title, and the value formatting.
 */
const meta = {
  title: "Organisms/PerformanceChart",
  component: PerformanceChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultMetric: {
      control: "radio",
      options: ["tvl", "price", "apy"],
    },
    defaultRange: {
      control: "radio",
      options: ["7D", "30D", "90D", "ALL"],
    },
    loading: { control: "boolean" },
    onMetricChange: { action: "metric-change" },
    onRangeChange: { action: "range-change" },
  },
  args: {
    data: mockPerformanceHistory,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PerformanceChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("TVL history")).toBeVisible()
    // Switch the metric via the dropdown — title and series follow.
    await userEvent.click(canvas.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "APY" }))
    await expect(canvas.getByText("APY history")).toBeVisible()
    await expect(args.onMetricChange).toHaveBeenCalledWith("apy")
    // Back to TVL; range selector still works.
    await userEvent.click(canvas.getByRole("combobox"))
    await userEvent.click(screen.getByRole("option", { name: "TVL" }))
    await expect(canvas.getByText("TVL history")).toBeVisible()
    const all = canvas.getByRole("button", { name: "All" })
    await userEvent.click(all)
    await expect(all).toHaveAttribute("aria-pressed", "true")
    await expect(args.onRangeChange).toHaveBeenCalledWith("ALL")
    await expect(
      canvasElement.querySelectorAll(".recharts-area-curve").length
    ).toBeGreaterThan(0)
  },
}

export const AssetPrice: Story = {
  args: { defaultMetric: "price" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Asset price history")).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText("Loading chart")).toBeVisible()
  },
}

export const Empty: Story = {
  args: { data: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No history yet")).toBeVisible()
  },
}

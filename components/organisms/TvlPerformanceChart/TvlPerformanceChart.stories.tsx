import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, within } from "storybook/test"
import { TvlPerformanceChart } from "./TvlPerformanceChart"
import { mockTvlHistory } from "@/lib/mock-data/charts"

/**
 * TVL/Performance Chart (5.3) — area chart of historical value with a
 * 7D/30D/90D/All range selector and a hover tooltip showing the value
 * at the point.
 */
const meta = {
  title: "Organisms/TvlPerformanceChart",
  component: TvlPerformanceChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultRange: {
      control: "radio",
      options: ["7D", "30D", "90D", "ALL"],
    },
    loading: { control: "boolean" },
    onRangeChange: { action: "range-change" },
  },
  args: {
    data: mockTvlHistory,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TvlPerformanceChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("TVL history")).toBeVisible()
    // Range selector switches the visible window.
    const all = canvas.getByRole("button", { name: "All" })
    await expect(all).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(all)
    await expect(all).toHaveAttribute("aria-pressed", "true")
    await expect(args.onRangeChange).toHaveBeenCalledWith("ALL")
    // Area rendered.
    await expect(
      canvasElement.querySelectorAll(".recharts-area-curve").length
    ).toBeGreaterThan(0)
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

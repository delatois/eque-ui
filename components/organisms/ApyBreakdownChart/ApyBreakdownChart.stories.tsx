import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { ApyBreakdownChart } from "./ApyBreakdownChart"
import { mockApyBreakdown } from "@/lib/mock-data/charts"

/**
 * APY Breakdown Chart (5.1) — stacked bars of base vs. reward vs.
 * boosted APY in the DESIGN.md §7.9 series color order, with
 * `border-subtle` gridlines and a custom hover tooltip.
 */
const meta = {
  title: "Organisms/ApyBreakdownChart",
  component: ApyBreakdownChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    height: { control: "number" },
  },
  args: {
    data: mockApyBreakdown,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApyBreakdownChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("APY breakdown")).toBeVisible()
    // Latest epoch total: 5.2 + 3.1 + 1.7 = 10.00%.
    await expect(canvas.getByText("10.00%")).toBeVisible()
    await expect(canvas.getByText("Base")).toBeVisible()
    await expect(canvas.getByText("Rewards")).toBeVisible()
    await expect(canvas.getByText("Boost")).toBeVisible()
    // Bars rendered.
    await expect(
      canvasElement.querySelectorAll(".recharts-bar-rectangle").length
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
    await expect(canvas.getByText("No APY data yet")).toBeVisible()
  },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { PortfolioSummaryCard } from "./PortfolioSummaryCard"

/**
 * Portfolio Summary Card (5.2) — total deposited, total earned, and
 * daily/monthly yield as a responsive grid of Stat Cards (2.1), with
 * a loading skeleton variant.
 */
const meta = {
  title: "Organisms/PortfolioSummaryCard",
  component: PortfolioSummaryCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
  },
  args: {
    totalDeposited: 48250.75,
    totalEarned: 3120.4,
    dailyYield: 8.62,
    monthlyYield: 258.5,
    depositedTrend: { direction: "up", text: "+4.2% vs last week" },
    earnedTrend: { direction: "up", text: "+12.4% vs last week" },
  },
} satisfies Meta<typeof PortfolioSummaryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Total deposited")).toBeVisible()
    await expect(canvas.getByText("$48,250.75")).toBeVisible()
    await expect(canvas.getByText("Total earned")).toBeVisible()
    await expect(canvas.getByText("$3,120.40")).toBeVisible()
    await expect(canvas.getByText("Daily yield")).toBeVisible()
    await expect(canvas.getByText("$8.62")).toBeVisible()
    await expect(canvas.getByText("Monthly yield")).toBeVisible()
    await expect(canvas.getByText("$258.50")).toBeVisible()
    await expect(
      canvasElement.querySelectorAll('[data-slot="stat-card"]')
    ).toHaveLength(4)
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Labels stay, values become skeletons.
    await expect(canvas.getByText("Total deposited")).toBeVisible()
    await expect(canvas.queryByText("$48,250.75")).not.toBeInTheDocument()
  },
}

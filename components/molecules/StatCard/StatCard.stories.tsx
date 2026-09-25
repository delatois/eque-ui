import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { StatCard } from "./StatCard"

/**
 * Eque Stat Card (2.1) — label + big mono value + optional trend row
 * on the L1 card surface. The trend pairs a square-cap glyph with
 * status-colored text (never color alone); `loading` keeps the label
 * and shows the Skeleton card block.
 */
const meta = {
  title: "Molecules/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] max-w-[90vw]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Card label (Mono 12px, tertiary)",
    },
    value: {
      control: "text",
      description: "Big mono figure (string or MonoNumber node)",
    },
    loading: {
      control: "boolean",
      description: "Pending state — value becomes a skeleton block",
      table: { defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Total value locked",
    value: formatCurrency(4212890.55),
    trend: { direction: "up", text: "+12.4% vs last week" },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "$4,212,890.55" })
    ).toBeInTheDocument()
    await expect(canvas.getByRole("separator")).toBeInTheDocument()
  },
}

export const UpTrend: Story = {
  args: {
    label: "Total value locked",
    value: formatCurrency(4212890.55),
    trend: { direction: "up", text: "+12.4% vs last week" },
  },
  play: async ({ canvas }) => {
    const card = canvas.getByText("Total value locked").closest('[data-slot="stat-card"]')
    await expect(card).toBeInTheDocument()
    const cs = getComputedStyle(card as Element)
    await expect(cs.backgroundColor).toBe("rgb(13, 18, 25)")
    await expect(cs.borderColor).toBe("rgb(31, 255, 195)")
    await expect(cs.borderRadius).toBe("0px")
    await expect(cs.paddingTop).toBe("24px")

    const label = canvas.getByText("Total value locked")
    const labelCs = getComputedStyle(label)
    await expect(labelCs.fontSize).toBe("12px")
    await expect(labelCs.fontFamily.slice(0, 18)).toBe('"Spline Sans Mono"')
    await expect(labelCs.color).toBe("rgb(143, 156, 173)")

    const value = canvas.getByRole("heading", { name: "$4,212,890.55" })
    const valueCs = getComputedStyle(value)
    await expect(valueCs.fontVariantNumeric).toContain("tabular-nums")
    await expect(valueCs.fontFamily.slice(0, 18)).toBe('"Spline Sans Mono"')

    const trend = canvas.getByText("+12.4% vs last week")
    await expect(
      trend.closest('[data-slot="stat-card-trend"]')
    ).toHaveAttribute("data-direction", "up")
    await expect(getComputedStyle(trend).color).toBe("rgb(91, 227, 125)")
    await expect(canvas.getByRole("separator")).toBeInTheDocument()
  },
}

export const NoTrend: Story = {
  args: {
    label: "Net APY",
    value: formatPercentage(18.42),
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "18.42%" })
    ).toBeInTheDocument()
    await expect(
      canvas.queryByRole("separator")
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByText(/vs last|this epoch/)
    ).not.toBeInTheDocument()
  },
}

export const DownTrend: Story = {
  args: {
    label: "Est. gas costs (7d)",
    value: formatCurrency(182.4),
    trend: { direction: "down", text: "-3.1% vs last week" },
  },
  play: async ({ canvas }) => {
    const trend = canvas.getByText("-3.1% vs last week")
    await expect(
      trend.closest('[data-slot="stat-card-trend"]')
    ).toHaveAttribute("data-direction", "down")
    await expect(getComputedStyle(trend).color).toBe("rgb(255, 107, 107)")
  },
}

export const FlatTrend: Story = {
  args: {
    label: "Active vaults",
    value: "8",
    trend: { direction: "flat", text: "No change this epoch" },
  },
  play: async ({ canvas }) => {
    const trend = canvas.getByText("No change this epoch")
    await expect(
      trend.closest('[data-slot="stat-card-trend"]')
    ).toHaveAttribute("data-direction", "flat")
    await expect(getComputedStyle(trend).color).toBe("rgb(143, 156, 173)")
  },
}

export const Loading: Story = {
  args: {
    label: "Total value locked",
    value: formatCurrency(4212890.55),
    trend: { direction: "up", text: "+12.4% vs last week" },
    loading: true,
  },
  play: async ({ canvas }) => {
    // Label stays for context; value + trend collapse to the skeleton block.
    await expect(canvas.getByText("Total value locked")).toBeInTheDocument()
    await expect(
      canvas.getByRole("status", { name: "Loading Total value locked" })
    ).toBeInTheDocument()
    await expect(
      canvas.queryByRole("heading")
    ).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole("separator")
    ).not.toBeInTheDocument()
  },
}

export const PortfolioRow: Story = {
  name: "Portfolio row (composite usage)",
  // Required props must be present for the story type even though the
  // custom render below ignores them (same rule as Select/RadioGroup).
  args: {
    label: "Total deposited",
    value: formatCurrency(12500),
  },
  render: () => (
    <div className="grid w-[720px] max-w-[90vw] gap-6 sm:grid-cols-3">
      <StatCard
        label="Total deposited"
        value={formatCurrency(12500)}
        trend={{ direction: "up", text: "+5.2% this month" }}
      />
      <StatCard
        label="Total earned"
        value={formatCurrency(842.17)}
        trend={{ direction: "up", text: "+$18.40 today" }}
      />
      <StatCard
        label="Net APY"
        value={formatPercentage(18.42)}
        trend={{ direction: "flat", text: "No change this epoch" }}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const cards = canvas.getAllByText(/Total deposited|Total earned|Net APY/)
    await expect(cards).toHaveLength(3)
    await expect(
      canvas.getByRole("heading", { name: "$12,500.00" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", { name: "18.42%" })
    ).toBeInTheDocument()
  },
}

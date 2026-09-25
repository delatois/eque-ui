import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { RiskLevelIndicator } from "./RiskLevelIndicator"

/**
 * Eque Risk Level Indicator (2.7) — status badge pairing a glyph with
 * the tier label (Low / Medium / High), so risk is never color alone.
 */
const meta = {
  title: "Molecules/RiskLevelIndicator",
  component: RiskLevelIndicator,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center py-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: ["low", "medium", "high"],
      description: "Risk tier.",
    },
  },
  args: {
    level: "medium",
  },
} satisfies Meta<typeof RiskLevelIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Low: Story = {
  args: { level: "low" },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="risk-level"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-level", "low")
    await expect(root).toHaveTextContent("Low")
  },
}

export const Medium: Story = {
  args: { level: "medium" },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="risk-level"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-level", "medium")
    await expect(root).toHaveTextContent("Medium")
  },
}

export const High: Story = {
  args: { level: "high" },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="risk-level"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-level", "high")
    await expect(root).toHaveTextContent("High")
  },
}

export const AllLevels: Story = {
  name: "All levels side by side",
  render: () => (
    <div className="flex items-center gap-2">
      <RiskLevelIndicator level="low" />
      <RiskLevelIndicator level="medium" />
      <RiskLevelIndicator level="high" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const level of ["low", "medium", "high"]) {
      await expect(
        canvasElement.querySelector(`[data-level="${level}"]`)
      ).not.toBeNull()
    }
  },
}

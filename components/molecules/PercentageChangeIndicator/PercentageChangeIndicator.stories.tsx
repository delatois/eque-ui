import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { PercentageChangeIndicator } from "./PercentageChangeIndicator"

/**
 * Eque Percentage Change Indicator (2.6) — direction glyph + signed
 * tabular percentage. Up = success, down = error, zero = neutral;
 * the glyph and the `+`/`-` sign pair the color so direction is never
 * color alone.
 */
const meta = {
  title: "Molecules/PercentageChangeIndicator",
  component: PercentageChangeIndicator,
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
    value: {
      control: { type: "number", min: -100, max: 100, step: 0.01 },
      description: "Signed change in percent units.",
    },
    decimals: {
      control: { type: "number", min: 0, max: 4 },
      description: "Fraction digits.",
    },
    showSign: {
      control: "boolean",
      description: "Prefix gains with +.",
    },
  },
  args: {
    value: 2.34,
  },
} satisfies Meta<typeof PercentageChangeIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Up: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="percentage-change"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-direction", "up")
    await expect(root).toHaveTextContent("+2.34%")
  },
}

export const Down: Story = {
  args: { value: -1.02 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="percentage-change"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-direction", "down")
    await expect(root).toHaveTextContent("-1.02%")
  },
}

export const Flat: Story = {
  args: { value: 0 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="percentage-change"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-direction", "flat")
    await expect(root).toHaveTextContent("0.00%")
  },
}

export const RoundsToFlat: Story = {
  name: "Sub-decimal gain reads flat",
  args: { value: 0.001 },
  play: async ({ canvasElement }) => {
    // Direction derives from the rounded value: no phantom up-arrow.
    const root = canvasElement.querySelector(
      '[data-slot="percentage-change"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-direction", "flat")
    await expect(root).toHaveTextContent("0.00%")
  },
}

export const NoSign: Story = {
  args: { value: 12.5, showSign: false },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="percentage-change"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-direction", "up")
    await expect(root).toHaveTextContent("12.50%")
    await expect(root.textContent).not.toContain("+")
  },
}

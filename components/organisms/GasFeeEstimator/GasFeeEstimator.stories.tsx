import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, userEvent, within } from "storybook/test"
import { GasFeeEstimator, type GasSpeed } from "./GasFeeEstimator"

/**
 * Gas Fee Estimator (3.5) — fee in native token + USD with a
 * Slow/Standard/Fast selector; skeleton state while "estimating".
 */
const meta = {
  title: "Organisms/GasFeeEstimator",
  component: GasFeeEstimator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    speed: {
      control: "select",
      options: ["slow", "standard", "fast"],
    },
    onSpeedChange: { action: "speed-change" },
  },
} satisfies Meta<typeof GasFeeEstimator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("ESTIMATED GAS FEE")).toBeVisible()
    const standard = canvas.getByRole("radio", { name: /Standard/ })
    await expect(standard).toBeChecked()
    await expect(canvas.getByText("0.00042 ETH")).toBeVisible()
  },
}

export const SelectSpeed: Story = {
  args: { onSpeedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("radio", { name: /Fast/ }))
    await expect(args.onSpeedChange).toHaveBeenCalledWith("fast")
    await expect(canvas.getByRole("radio", { name: /Fast/ })).toBeChecked()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole("status", { name: /Estimating/ })
    ).toBeVisible()
    await expect(canvas.queryByRole("radio")).not.toBeInTheDocument()
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [speed, setSpeed] = useState<GasSpeed>("slow")
    return (
      <div className="flex flex-col gap-3">
        <GasFeeEstimator
          {...args}
          speed={speed}
          onSpeedChange={(s) => {
            args.onSpeedChange?.(s)
            setSpeed(s)
          }}
        />
        <p className="font-body text-sm text-text-tertiary">
          Selected: {speed}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Selected: slow")).toBeVisible()
    await userEvent.click(canvas.getByRole("radio", { name: /Fast/ }))
    await expect(canvas.getByText("Selected: fast")).toBeVisible()
  },
}

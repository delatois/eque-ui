import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, waitFor } from "storybook/test"
import { EpochCountdownTimer } from "./EpochCountdownTimer"

/**
 * Eque Epoch Countdown Timer (2.8) — `DD:HH:MM:SS` tabular digits with
 * a pulsing status dot while live; the expired state freezes at zeros
 * with a static dot and fires `onExpire` once.
 */
const meta = {
  title: "Molecules/EpochCountdownTimer",
  component: EpochCountdownTimer,
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
    target: {
      control: "date",
      description: "Target time (Date or epoch-ms).",
    },
    onExpire: { action: "expired" },
  },
  args: {
    // ~2d 4h 12m from first render.
    target: Date.now() + (2 * 86400 + 4 * 3600 + 12 * 60) * 1000,
  },
} satisfies Meta<typeof EpochCountdownTimer>

export default meta
type Story = StoryObj<typeof meta>

export const Live: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="epoch-countdown"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-state", "live")
    await expect(root).toHaveAttribute("role", "timer")
    // DD:HH:MM:SS — seconds may tick during the test, so match the shape.
    await expect(root.textContent).toMatch(/^\d{2}:\d{2}:\d{2}:\d{2}$/)
    // Pulsing dot present while live.
    await expect(
      root.querySelector(".animate-ping")
    ).not.toBeNull()
  },
}

export const Expired: Story = {
  args: { target: Date.now() - 60_000 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="epoch-countdown"]'
    ) as HTMLElement
    await expect(root).toHaveAttribute("data-state", "expired")
    await expect(root).toHaveTextContent("00:00:00:00")
    // No pulse once expired.
    await expect(root.querySelector(".animate-ping")).toBeNull()
  },
}

export const FiresOnExpire: Story = {
  name: "onExpire fires once",
  args: { target: Date.now() + 1500, onExpire: fn() },
  play: async ({ args }) => {
    await waitFor(() => expect(args.onExpire).toHaveBeenCalledTimes(1), {
      timeout: 5000,
    })
  },
}

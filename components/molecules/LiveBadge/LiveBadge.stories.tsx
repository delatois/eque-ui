import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { LiveBadge } from "./LiveBadge"

/**
 * Eque Live Badge (bonus molecule) — pulsing status dot + mono
 * label for time-sensitive surfaces like the epoch auction page.
 */
const meta = {
  title: "Molecules/LiveBadge",
  component: LiveBadge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["live", "upcoming", "ended"],
    },
  },
} satisfies Meta<typeof LiveBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Live: Story = {
  args: { state: "live" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const badge = canvas.getByText("Live")
    await expect(badge).toHaveAttribute("data-state", "live")
    await expect(badge.querySelector(".animate-ping")).not.toBeNull()
  },
}

export const Upcoming: Story = {
  args: { state: "upcoming" },
}

export const Ended: Story = {
  args: { state: "ended" },
}

export const CustomLabel: Story = {
  args: { state: "live", label: "Auction live" },
}

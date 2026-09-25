import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { EmptyState } from "./EmptyState"
import { Button } from "@/components/atoms/Button"

/**
 * Eque Empty State (2.14) — icon-less dot-grid illustration (DESIGN.md
 * §6.2), message, optional CTA. For lists, feeds, and panels with
 * nothing to show yet.
 */
const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    title: "No bids yet",
    description:
      "The epoch auction just opened. Be the first market maker to place a bid.",
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No bids yet")).toBeVisible()
    await expect(
      canvas.getByText(/first market maker to place a bid/i)
    ).toBeVisible()
  },
}

export const WithAction: Story = {
  args: {
    title: "No transactions yet",
    description: "Your deposit and compounding history will appear here.",
    action: <Button variant="secondary">Deposit now</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole("button", { name: "Deposit now" })
    ).toBeVisible()
  },
}

export const TitleOnly: Story = {
  args: { title: "Nothing here", description: undefined, action: undefined },
}

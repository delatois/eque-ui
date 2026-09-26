import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { Button } from "@/components/atoms/Button"
import { ActivityFeed } from "./ActivityFeed"
import { mockTransactions } from "@/lib/mock-data/transactions"

/**
 * Activity Feed (3.6) — recent account events from the transactions
 * mock data: type glyph + label, status (glyph + text), amount, token
 * text badge, relative timestamps. Empty list → EmptyState.
 */
const meta = {
  title: "Organisms/ActivityFeed",
  component: ActivityFeed,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onItemClick: { action: "item-click" },
  },
  args: {
    transactions: mockTransactions,
  },
} satisfies Meta<typeof ActivityFeed>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole("list")
    await expect(
      within(list).getAllByRole("listitem")
    ).toHaveLength(mockTransactions.length)
    await expect(canvas.getByText("Deposit")).toBeVisible()
    // Status is glyph + text, never color alone.
    await expect(canvas.getAllByText("Confirmed").length).toBeGreaterThan(0)
  },
}

export const ClickableRows: Story = {
  args: { onItemClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const first = mockTransactions[0]
    const rows = canvas.getAllByRole("button", {
      name: new RegExp(`${first.type}`, "i"),
    })
    await userEvent.click(rows[0])
    await expect(args.onItemClick).toHaveBeenCalledWith(first)
  },
}

export const Empty: Story = {
  args: { transactions: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No activity yet")).toBeVisible()
  },
}

export const EmptyWithAction: Story = {
  args: {
    transactions: [],
    emptyAction: <Button>Make a deposit</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No activity yet")).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Make a deposit" })
    ).toBeVisible()
  },
}

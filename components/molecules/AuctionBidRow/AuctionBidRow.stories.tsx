import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { AuctionBidRow } from "./AuctionBidRow"

/**
 * Eque Auction Bid Row (2.9) — dense tabular row for the live bid
 * feed: bidder chip left, tabular amount right. The leader gets a
 * primary tint + trophy glyph.
 */
const meta = {
  title: "Molecules/AuctionBidRow",
  component: AuctionBidRow,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex w-80 items-center justify-center py-16">
        <div className="w-full">
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    bidder: {
      control: "text",
      description: "Bidder address (0x…).",
    },
    amount: {
      control: { type: "number", min: 0, step: 0.0001 },
      description: "Bid amount in token units.",
    },
    symbol: { control: "text" },
    decimals: {
      control: { type: "number", min: 0, max: 8 },
    },
    isLeader: { control: "boolean" },
  },
  args: {
    bidder: "0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b",
    amount: 0.0234,
    symbol: "mNVDA",
  },
} satisfies Meta<typeof AuctionBidRow>

export default meta
type Story = StoryObj<typeof meta>

export const Leader: Story = {
  args: { isLeader: true },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector(
      '[data-slot="auction-bid-row"]'
    ) as HTMLElement
    await expect(row).toHaveAttribute("data-leader", "true")
    await expect(row).toHaveTextContent("Leading bid")
    await expect(row).toHaveTextContent("0.0234")
    await expect(row).toHaveTextContent("mNVDA")
  },
}

export const Outbid: Story = {
  args: {
    isLeader: false,
    bidder: "0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d",
    amount: 0.0211,
  },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector(
      '[data-slot="auction-bid-row"]'
    ) as HTMLElement
    await expect(row).toHaveAttribute("data-leader", "false")
    await expect(row.textContent).not.toContain("Leading bid")
    await expect(row).toHaveTextContent("0.0211")
  },
}

export const BidFeed: Story = {
  name: "Live bid feed",
  render: () => (
    <div className="flex w-full flex-col border border-subtle">
      <AuctionBidRow
        bidder="0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b"
        amount={0.0234}
        symbol="mNVDA"
        isLeader
      />
      <AuctionBidRow
        bidder="0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d"
        amount={0.0211}
        symbol="mNVDA"
      />
      <AuctionBidRow
        bidder="0xdead10cc5e6f708192a3b4c5d6e7f8091a2b3c4d"
        amount={0.0198}
        symbol="mNVDA"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="auction-bid-row"]')
    await expect(rows).toHaveLength(3)
    await expect(rows[0]).toHaveAttribute("data-leader", "true")
    await expect(rows[1]).toHaveAttribute("data-leader", "false")
    await expect(rows[2]).toHaveAttribute("data-leader", "false")
  },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { LiveEpochPanel } from "./LiveEpochPanel"
import { mockEpochBids, mockPastEpochs } from "@/lib/mock-data/auction"

/**
 * Live Epoch Panel (bonus) — the spectator view of the options
 * auction: live badge + epoch + countdown, strike/spot/premium stats,
 * the live bid feed, and a past-epochs strip.
 */
const meta = {
  title: "Organisms/LiveEpochPanel",
  component: LiveEpochPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    phase: {
      control: "radio",
      options: ["bidding", "settling", "settled"],
    },
    loading: { control: "boolean" },
  },
  args: {
    epoch: 48,
    phase: "bidding",
    strikePrice: 182.5,
    spotPrice: 178.2,
    epochEndsAt: Date.now() + 4 * 60 * 1000 + 23 * 1000,
    tokenSymbol: "mNVDA",
    bids: mockEpochBids,
    pastEpochs: mockPastEpochs,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiveEpochPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Bidding: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Epoch 48")).toBeVisible()
    await expect(canvas.getByText("LIVE")).toBeVisible()
    await expect(canvas.getByText("Strike price")).toBeVisible()
    await expect(canvas.getByText("$182.50")).toBeVisible()
    await expect(canvas.getByText("Spot price")).toBeVisible()
    await expect(canvas.getByText("Call OTM")).toBeVisible()
    await expect(canvas.getByText("Live bids")).toBeVisible()
    await expect(canvas.getByText("5 bids")).toBeVisible()
    await expect(canvas.getByText("E47 · $412.50")).toBeVisible()
  },
}

export const Settled: Story = {
  args: {
    phase: "settled",
    bids: mockEpochBids,
    winningPremium: 428.1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("SETTLED")).toBeVisible()
    await expect(canvas.getByText("Winning premium")).toBeVisible()
    await expect(canvas.getByText("$428.10")).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText("Loading epoch")).toBeVisible()
  },
}

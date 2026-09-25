import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import { truncateAddress } from "@/lib/utils"
import { WalletAddressChip } from "./WalletAddressChip"

/**
 * Eque Wallet Address Chip (2.4) — truncated address in a neutral
 * badge (Mono, tabular), copy-to-clipboard button, optional
 * block-explorer link. Address tooltip reveals the full address;
 * copying swaps the icon to a success check and announces "Copied".
 */
const meta = {
  title: "Molecules/WalletAddressChip",
  component: WalletAddressChip,
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
    address: {
      control: "text",
      description: "Full wallet address (0x…).",
    },
    explorerUrl: {
      control: "text",
      description: "Block-explorer URL. Omitted → no explorer icon.",
    },
    leadingChars: {
      control: { type: "number", min: 2, max: 20 },
      description: "Leading chars kept by truncation, incl. 0x.",
    },
    trailingChars: {
      control: { type: "number", min: 2, max: 10 },
      description: "Trailing chars kept by truncation.",
    },
  },
  args: {
    address: "0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b",
    explorerUrl:
      "https://sepolia.basescan.org/address/0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b",
  },
} satisfies Meta<typeof WalletAddressChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement
    const address = "0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b"
    // Truncated display…
    expect(
      screen.getByText(truncateAddress(address))
    ).toBeInTheDocument()
    // …full address only in the tooltip.
    const shown = canvas.querySelector('[data-slot="wallet-address"]')
    expect(shown).not.toBeNull()
    await userEvent.hover(shown as HTMLElement)
    const tooltip = await screen.findByRole("tooltip")
    expect(tooltip).toHaveTextContent(address)
    await userEvent.unhover(shown as HTMLElement)
  },
}

export const WithoutExplorer: Story = {
  args: { explorerUrl: undefined },
  play: async () => {
    expect(
      screen.queryByLabelText("View address on explorer")
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText("Copy address")).toBeInTheDocument()
  },
}

export const CopyFeedback: Story = {
  args: { copiedDurationMs: 400 },
  play: async () => {
    // Stub the clipboard — headless contexts may deny the real one.
    const writeText = fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    try {
      const copyButton = screen.getByRole("button", { name: "Copy address" })
      await userEvent.click(copyButton)
      expect(writeText).toHaveBeenCalledWith(
        "0x8f3a1c9d2e4b5a6f708192a3b4c5d6e7f8091a2b"
      )
      // Micro-feedback: icon swaps, aria-label flips.
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Copied" })
        ).toBeInTheDocument()
      })
      expect(
        screen.getByRole("button", { name: "Copied" })
      ).toHaveAttribute("data-state", "copied")
      // Feedback clears after the duration.
      await waitFor(
        () => {
          expect(
            screen.getByRole("button", { name: "Copy address" })
          ).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    } finally {
      // Remove the own-property stub so the prototype's clipboard returns.
      delete (navigator as { clipboard?: unknown }).clipboard
    }
  },
}

export const ShortAddress: Story = {
  args: {
    address: "0xdead",
    explorerUrl: undefined,
  },
  play: async () => {
    // Below the truncation threshold → rendered verbatim.
    expect(screen.getByText("0xdead")).toBeInTheDocument()
  },
}

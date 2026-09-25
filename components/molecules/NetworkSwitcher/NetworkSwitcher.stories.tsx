import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import { getMockChains } from "@/lib/mock-data/chains"
import { NetworkSwitcher } from "./NetworkSwitcher"

/**
 * Eque Network Switcher (2.5) — chain picker on the Select atom.
 * Chains render as text (name + muted `#id`), never icons; the
 * current chain is highlighted in the popup (primary tint + check).
 */
const meta = {
  title: "Molecules/NetworkSwitcher",
  component: NetworkSwitcher,
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
    placeholder: { control: "text" },
  },
  args: {
    chains: getMockChains(),
    defaultValue: 8453,
  },
} satisfies Meta<typeof NetworkSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveTextContent("Base")
    await expect(trigger).toHaveTextContent("8453")
  },
}

export const SwitchNetwork: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => {
    const [chainId, setChainId] = React.useState<number | null>(
      args.defaultValue ?? null
    )
    return (
      <NetworkSwitcher
        {...args}
        value={chainId}
        onValueChange={(next) => {
          setChainId(next)
          args.onValueChange?.(next)
        }}
      />
    )
  },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await userEvent.click(trigger)
    // The popup is portaled to the body, outside the story canvas.
    const listbox = await screen.findByRole("listbox")
    await expect(listbox).toBeInTheDocument()
    for (const name of ["Ethereum", "Arbitrum", "Optimism", "Base"]) {
      await expect(
        screen.getByRole("option", { name: new RegExp(name) })
      ).toBeInTheDocument()
    }
    await userEvent.click(screen.getByRole("option", { name: /Arbitrum/ }))
    await waitFor(() => {
      expect(
        canvas.getByRole("combobox", { name: "Network" })
      ).toHaveTextContent("Arbitrum")
    })
    await expect(args.onValueChange).toHaveBeenCalledWith(42161)
  },
}

export const NoSelection: Story = {
  args: {
    defaultValue: null,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("combobox", { name: "Network" })
    ).toHaveTextContent("Select network")
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("combobox", { name: "Network" })
    ).toBeDisabled()
  },
}

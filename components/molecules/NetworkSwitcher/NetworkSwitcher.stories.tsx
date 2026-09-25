import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import type { StaticImageData } from "next/image"
import { getMockChains } from "@/lib/mock-data/chains"
import mockupIcon from "@/assets/example-mockup.png"
import { NetworkSwitcher } from "./NetworkSwitcher"

/**
 * Mock network art: the shared `assets/example-mockup.png` is a
 * Next-image import, not a URL string; normalize to a plain URL and
 * pass via the `iconSrc` prop.
 */
const mockupIconSrc: string =
  typeof (mockupIcon as unknown) === "string"
    ? (mockupIcon as unknown as string)
    : (mockupIcon as StaticImageData).src

/**
 * Eque Network Switcher (2.5) — chain picker on the Select atom.
 * Rows render the `iconSrc` artwork before the chain name text
 * (placeholder art, not an icon system); the current chain is
 * highlighted in the popup (primary tint + check).
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
    iconSrc: {
      control: "text",
      description: "Network icon image URL. Omitted → no artwork.",
    },
  },
  args: {
    chains: getMockChains(),
    defaultValue: 8453,
    iconSrc: mockupIconSrc,
  },
} satisfies Meta<typeof NetworkSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveTextContent("Base")
    // Placeholder art (not an icon system): 20px sharp image,
    // decorative, served from the shared mock asset.
    const art = canvasElement.querySelector(
      '[data-slot="network-art"]'
    ) as HTMLElement
    await expect(art.tagName).toBe("IMG")
    await expect(art).toHaveAttribute("width", "20")
    await expect(art).toHaveAttribute("aria-hidden", "true")
    await expect(art.getAttribute("src") ?? "").toContain("example-mockup")
  },
}

export const WithoutArt: Story = {
  args: { iconSrc: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("combobox", { name: "Network" })
    ).toHaveTextContent("Base")
    await expect(
      canvasElement.querySelector('[data-slot="network-art"]')
    ).toBeNull()
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
      await expect(screen.getByRole("option", { name })).toBeInTheDocument()
    }
    await userEvent.click(screen.getByRole("option", { name: "Arbitrum" }))
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

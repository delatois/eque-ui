import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, userEvent, within } from "storybook/test"
import { Button } from "@/components/atoms/Button"
import { WalletConnectModal } from "./WalletConnectModal"
import type { WalletProvider } from "@/lib/mock-data/wallets"

/**
 * Wallet Connect Modal (3.1) — dialog listing wallet providers as plain
 * labeled rows (no brand icons). Per-row spinner while "connecting",
 * error banner on failed connection. The host drives the mock async
 * flow via `connectingId` / `error`.
 */
const meta = {
  title: "Organisms/WalletConnectModal",
  component: WalletConnectModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onConnect: { action: "connect" },
    onOpenChange: { action: "open-change" },
  },
} satisfies Meta<typeof WalletConnectModal>

export default meta
type Story = StoryObj<typeof meta>

const connectTrigger = <Button>Connect wallet</Button>

export const Default: Story = {
  args: {
    trigger: connectTrigger,
    onConnect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Connect wallet" }))
    const dialog = await canvas.findByRole("dialog")
    await expect(
      within(dialog).getByRole("heading", { name: "Connect wallet" })
    ).toBeVisible()
    for (const name of ["MetaMask", "WalletConnect", "Coinbase Wallet"]) {
      await expect(
        within(dialog).getByRole("button", { name: new RegExp(name) })
      ).toBeVisible()
    }
  },
}

export const Connecting: Story = {
  args: {
    open: true,
    connectingId: "metamask",
    onConnect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dialog = await canvas.findByRole("dialog")
    await expect(
      within(dialog).getByLabelText("Connecting to MetaMask")
    ).toBeVisible()
    // Other rows are disabled while one connects.
    await expect(
      within(dialog).getByRole("button", { name: /WalletConnect/ })
    ).toBeDisabled()
  },
}

export const ConnectionError: Story = {
  args: {
    open: true,
    error: {
      providerId: "metamask",
      message: "No wallet found. Install the MetaMask extension and try again.",
    },
    onConnect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dialog = await canvas.findByRole("dialog")
    await expect(
      within(dialog).getByRole("alert")
    ).toHaveTextContent(/No wallet found/)
  },
}

function SimulatedFlow({ fail = false }: { fail?: boolean }) {
  const [open, setOpen] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [error, setError] = useState<{
    providerId: string
    message: string
  } | null>(null)
  const [connected, setConnected] = useState<WalletProvider | null>(null)

  const handleConnect = (provider: WalletProvider) => {
    setError(null)
    setConnectingId(provider.id)
    window.setTimeout(() => {
      setConnectingId(null)
      if (fail) {
        setError({
          providerId: provider.id,
          message: `Could not reach ${provider.name}. Check the extension is unlocked and try again.`,
        })
      } else {
        setConnected(provider)
        setOpen(false)
      }
    }, 900)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletConnectModal
        open={open}
        onOpenChange={setOpen}
        connectingId={connectingId}
        error={error}
        onConnect={handleConnect}
        trigger={<Button>Connect wallet</Button>}
      />
      <p className="font-body text-sm text-text-secondary">
        {connected ? `Connected: ${connected.name}` : "Not connected"}
      </p>
    </div>
  )
}

export const SimulatedSuccess: Story = {
  render: () => <SimulatedFlow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Connect wallet" }))
    const dialog = await canvas.findByRole("dialog")
    await userEvent.click(
      within(dialog).getByRole("button", { name: /MetaMask/ })
    )
    await expect(
      within(dialog).getByLabelText("Connecting to MetaMask")
    ).toBeVisible()
    await expect(
      await canvas.findByText("Connected: MetaMask", undefined, {
        timeout: 3000,
      })
    ).toBeVisible()
  },
}

export const SimulatedFailure: Story = {
  render: () => <SimulatedFlow fail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Connect wallet" }))
    const dialog = await canvas.findByRole("dialog")
    await userEvent.click(
      within(dialog).getByRole("button", { name: /Coinbase Wallet/ })
    )
    await expect(
      await within(dialog).findByRole("alert", undefined, { timeout: 3000 })
    ).toHaveTextContent(/Could not reach Coinbase Wallet/)
    // Modal stays open so the user can retry with another provider.
    await expect(dialog).toBeVisible()
  },
}

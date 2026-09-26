import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, userEvent, within } from "storybook/test"
import { Button } from "@/components/atoms/Button"
import {
  TransactionStatusModal,
  type TransactionStatus,
} from "./TransactionStatusModal"

const TX_HASH =
  "0x8f3a9c2d1e4b5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f"
const EXPLORER_URL = `https://sepolia.basescan.org/tx/${TX_HASH}`

/**
 * Transaction Status Modal (3.3) — Pending → Confirmed/Failed
 * progression: status glyph + label (never color alone), tx-hash chip,
 * block-explorer link. The host drives `status`; see `SimulatedFlow`.
 */
const meta = {
  title: "Organisms/TransactionStatusModal",
  component: TransactionStatusModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onViewExplorer: { action: "view-explorer" },
    onOpenChange: { action: "open-change" },
  },
  args: {
    title: "Depositing 1,250 USDC",
    txHash: TX_HASH,
    explorerUrl: EXPLORER_URL,
  },
} satisfies Meta<typeof TransactionStatusModal>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: { open: true, status: "pending" },
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement).findByRole("dialog")
    await expect(within(dialog).getByText("Pending")).toBeVisible()
    await expect(
      within(dialog).getByText("Depositing 1,250 USDC")
    ).toBeVisible()
  },
}

export const Success: Story = {
  args: { open: true, status: "success" },
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement).findByRole("dialog")
    await expect(within(dialog).getByText("Confirmed")).toBeVisible()
    await expect(
      within(dialog).getByRole("link", { name: "View on explorer" })
    ).toHaveAttribute("href", EXPLORER_URL)
  },
}

export const Failed: Story = {
  args: {
    open: true,
    status: "failed",
    errorMessage: "Transaction reverted: insufficient allowance.",
  },
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement).findByRole("dialog")
    await expect(within(dialog).getByText("Failed")).toBeVisible()
    await expect(
      within(dialog).getByText(/insufficient allowance/)
    ).toBeVisible()
  },
}

function SimulatedFlow({ fail = false }: { fail?: boolean }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<TransactionStatus>("pending")

  const start = () => {
    setStatus("pending")
    setOpen(true)
    window.setTimeout(() => {
      setStatus(fail ? "failed" : "success")
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={start}>Deposit 1,250 USDC</Button>
      <TransactionStatusModal
        open={open}
        onOpenChange={setOpen}
        status={status}
        title="Depositing 1,250 USDC"
        txHash={TX_HASH}
        explorerUrl={EXPLORER_URL}
        errorMessage={
          fail ? "Transaction reverted: insufficient allowance." : undefined
        }
      />
    </div>
  )
}

export const SimulatedSuccessFlow: Story = {
  args: { status: "pending", title: "Depositing 1,250 USDC" },
  render: () => <SimulatedFlow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Deposit 1,250 USDC" })
    )
    const dialog = await canvas.findByRole("dialog")
    await expect(within(dialog).getByText("Pending")).toBeVisible()
    await expect(
      await within(dialog).findByText("Confirmed", undefined, {
        timeout: 3000,
      })
    ).toBeVisible()
  },
}

export const SimulatedFailedFlow: Story = {
  args: { status: "pending", title: "Depositing 1,250 USDC" },
  render: () => <SimulatedFlow fail />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Deposit 1,250 USDC" })
    )
    const dialog = await canvas.findByRole("dialog")
    await expect(
      await within(dialog).findByText("Failed", undefined, { timeout: 3000 })
    ).toBeVisible()
    await expect(
      within(dialog).getByText(/insufficient allowance/)
    ).toBeVisible()
  },
}

export const Close: Story = {
  args: {
    open: true,
    status: "success",
    onOpenChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const dialog = await within(canvasElement).findByRole("dialog")
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

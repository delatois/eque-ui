import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import { ApproveTokenFlow } from "./ApproveTokenFlow"
import type { ApproveStepStatus } from "./ApproveTokenFlow"

/**
 * Approve Token Flow (3.4) — two-step composite (Approve → Deposit)
 * with numbered step markers, explainer copy, and per-step actions.
 * The host drives step statuses; see `SimulatedFlow`.
 */
const meta = {
  title: "Organisms/ApproveTokenFlow",
  component: ApproveTokenFlow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    approveStatus: {
      control: "select",
      options: ["pending", "active", "loading", "done"],
    },
    depositStatus: {
      control: "select",
      options: ["pending", "active", "loading", "done"],
    },
    onApprove: { action: "approve" },
    onDeposit: { action: "deposit" },
  },
  args: {
    tokenSymbol: "USDC",
  },
} satisfies Meta<typeof ApproveTokenFlow>

export default meta
type Story = StoryObj<typeof meta>

export const ApproveStep: Story = {
  args: {
    approveStatus: "active",
    depositStatus: "pending",
    onApprove: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Approve USDC")).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Approve USDC" })
    )
    await expect(args.onApprove).toHaveBeenCalledTimes(1)
    // Deposit step is inert until approval completes.
    await expect(
      canvas.queryByRole("button", { name: /Deposit/ })
    ).not.toBeInTheDocument()
  },
}

export const ApproveLoading: Story = {
  args: { approveStatus: "loading", depositStatus: "pending" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole("button", { name: /Approve USDC/ })
    await expect(btn).toBeDisabled()
  },
}

export const DepositStep: Story = {
  args: {
    approveStatus: "done",
    depositStatus: "active",
    onDeposit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Approve USDC")).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Deposit USDC" })
    )
    await expect(args.onDeposit).toHaveBeenCalledTimes(1)
  },
}

export const AllDone: Story = {
  args: { approveStatus: "done", depositStatus: "done" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole("button", { name: /Approve|Deposit/ })
    ).not.toBeInTheDocument()
    await expect(canvas.getByText("Deposit")).toBeVisible()
  },
}

function SimulatedFlow() {
  const [approve, setApprove] = useState<ApproveStepStatus>("active")
  const [deposit, setDeposit] = useState<ApproveStepStatus>("pending")

  return (
    <ApproveTokenFlow
      tokenSymbol="USDC"
      approveStatus={approve}
      depositStatus={deposit}
      onApprove={() => {
        setApprove("loading")
        window.setTimeout(() => {
          setApprove("done")
          setDeposit("active")
        }, 1000)
      }}
      onDeposit={() => {
        setDeposit("loading")
        window.setTimeout(() => setDeposit("done"), 1000)
      }}
    />
  )
}

export const SimulatedFullFlow: Story = {
  render: () => <SimulatedFlow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Approve USDC" }))
    await expect(
      await canvas.findByRole("button", { name: "Deposit USDC" }, { timeout: 3000 })
    ).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Deposit USDC" }))
    // Both actions disappear once the flow completes.
    await waitFor(() => {
      expect(
        canvas.queryByRole("button", { name: /Approve USDC|Deposit USDC/ })
      ).not.toBeInTheDocument()
    })
  },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, userEvent, within } from "storybook/test"
import { AlertBanner } from "./AlertBanner"

/**
 * Eque Alert/Banner (2.11) — one variant per status color per
 * DESIGN.md §7.6: tinted bg + tinted border + 2px status rail,
 * status glyph, title, message, optional dismiss.
 */
const meta = {
  title: "Molecules/AlertBanner",
  component: AlertBanner,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    dismissible: { control: "boolean" },
    onDismiss: { action: "dismiss" },
  },
  args: {
    title: "Epoch 42 auction settled",
    message:
      "Winning premium 0.0842 mNVDA has been compounded into the vault.",
  },
} satisfies Meta<typeof AlertBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: { status: "info" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveAttribute("data-status", "info")
    await expect(canvas.getByText("Epoch 42 auction settled")).toBeVisible()
  },
}

export const Success: Story = {
  args: {
    status: "success",
    title: "Deposit confirmed",
    message: "12.5 mNVDA deposited into the vault. Shares will mint next epoch.",
  },
}

export const Warning: Story = {
  args: {
    status: "warning",
    title: "Oracle price is stale",
    message:
      "The price feed hasn't updated in 90 seconds. Settlement may be delayed — no action needed.",
  },
}

export const Error: Story = {
  args: {
    status: "error",
    title: "Transaction failed",
    message:
      "The deposit reverted: insufficient mNVDA balance. Top up and try again.",
  },
}

export const Dismissible: Story = {
  args: { status: "warning", dismissible: true },
  render: (args) => {
    const [open, setOpen] = useState(true)
    if (!open) return <p className="font-body text-sm text-text-tertiary">Dismissed.</p>
    return (
      <AlertBanner
        {...args}
        onDismiss={() => {
          args.onDismiss?.()
          setOpen(false)
        }}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: /dismiss warning alert/i })
    )
    await expect(canvas.getByText("Dismissed.")).toBeVisible()
  },
}

export const TitleOnly: Story = {
  args: { status: "info", title: "New epoch started", message: undefined },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"
import { ConfirmDialog } from "./ConfirmDialog"
import { Button } from "@/components/atoms/Button"

/**
 * Eque Confirmation Dialog (2.15) — title, description,
 * cancel/confirm actions; destructive variant uses the danger
 * button. Works uncontrolled with a trigger child, or controlled.
 */
const meta = {
  title: "Molecules/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    destructive: { control: "boolean" },
    confirmLoading: { control: "boolean" },
    onConfirm: { action: "confirm" },
    onOpenChange: { action: "openChange" },
  },
  args: {
    title: "Withdraw from vault?",
    description:
      "You'll receive mNVDA at the next epoch boundary. Pending premium stays in the vault.",
    confirmLabel: "Withdraw",
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ConfirmDialog {...args}>
      <Button variant="secondary">Open dialog</Button>
    </ConfirmDialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }))
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "Withdraw from vault?" })
      ).toBeVisible()
    )
    await expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeVisible()
    await expect(
      screen.getByRole("button", { name: "Withdraw" })
    ).toBeVisible()
  },
}

export const Destructive: Story = {
  args: {
    destructive: true,
    title: "Close vault position?",
    description:
      "This burns your eNVDA shares and exits the strategy. This can't be undone.",
    confirmLabel: "Close position",
    onConfirm: fn(),
  },
  render: (args) => (
    <ConfirmDialog {...args}>
      <Button variant="danger">Close position</Button>
    </ConfirmDialog>
  ),
  play: async ({ args }) => {
    await userEvent.click(
      within(document.body).getByRole("button", { name: "Close position" })
    )
    const dialog = await screen.findByRole("dialog", {
      name: "Close position?",
    })
    await expect(dialog).toHaveAttribute("data-variant", "destructive")
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Close position" })
    )
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}

export const ConfirmLoading: Story = {
  args: {
    title: "Withdraw from vault?",
    confirmLabel: "Withdraw",
    confirmLoading: true,
  },
  render: (args) => (
    <ConfirmDialog {...args} open>
      <Button variant="secondary">Open dialog</Button>
    </ConfirmDialog>
  ),
}

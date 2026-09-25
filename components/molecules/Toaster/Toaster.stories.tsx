import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"
import { Toaster, notify } from "./Toaster"
import { Button } from "@/components/atoms/Button"

/**
 * Eque Toast Notification (2.12) — bottom-right, 360px, sharp
 * hairline toasts per DESIGN.md §7.6. Success/info/warning
 * auto-dismiss after 5s; errors persist until dismissed.
 */
const meta = {
  title: "Molecules/Toaster",
  component: Toaster,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

function DemoButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => notify.success("Deposit confirmed")}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => notify.info("New epoch started")}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => notify.warning("Oracle price is stale")}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          notify.error("Transaction failed", {
            description: "Insufficient mNVDA balance.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const id = notify.pending("Settling epoch…")
          setTimeout(() => notify.success("Epoch settled", { id }), 1500)
        }}
      >
        Pending → success
      </Button>
    </div>
  )
}

export const Playground: Story = {
  render: () => <DemoButtons />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Success" }))
    await waitFor(() =>
      expect(screen.getByText("Deposit confirmed")).toBeVisible()
    )
    await userEvent.click(screen.getByRole("button", { name: "Error" }))
    await waitFor(() =>
      expect(screen.getByText("Transaction failed")).toBeVisible()
    )
    // Errors persist: still visible after the 5s auto-dismiss window
    // would have cleared a success toast. (Timing asserted by the
    // `duration: Infinity` default in `notify.error`.)
  },
}

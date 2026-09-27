import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { AuditSecurityBadgeRow } from "./AuditSecurityBadgeRow"

/**
 * Audit/Security Badge Row (4.6) — row of trust badges ("Audited by
 * X", "Insured", "Open source") built from Badge + Tooltip, with an
 * unaudited-vault warning variant in the warning status color.
 */
const meta = {
  title: "Molecules/AuditSecurityBadgeRow",
  component: AuditSecurityBadgeRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    badges: [
      {
        label: "Audited by Zellic",
        detail: "Independent audit completed March 2026. Report on GitHub.",
      },
      {
        label: "Audited by ChainSecurity",
        detail: "Independent audit completed January 2026. Report on GitHub.",
      },
      { label: "Open source", detail: "Contracts are verified and open source." },
      {
        label: "Bug bounty live",
        detail: "Up to $100k via Immunefi.",
        tone: "neutral",
      },
    ],
  },
} satisfies Meta<typeof AuditSecurityBadgeRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Audited by Zellic")).toBeVisible()
    await expect(canvas.getByText("Open source")).toBeVisible()
    // Tooltip detail on hover.
    await userEvent.hover(canvas.getByText("Audited by Zellic"))
    await waitFor(() =>
      expect(
        canvas.getByText("Independent audit completed March 2026. Report on GitHub.")
      ).toBeVisible()
    )
  },
}

export const UnauditedWarning: Story = {
  args: {
    ariaLabel: "Trust badges",
    badges: [
      {
        label: "Not yet audited",
        detail:
          "This vault's contracts have not completed a third-party audit. Deposit at your own risk.",
        tone: "warning",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Not yet audited")).toBeVisible()
  },
}

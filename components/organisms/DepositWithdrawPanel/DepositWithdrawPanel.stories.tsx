import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { DepositWithdrawPanel } from "./DepositWithdrawPanel"
import { mockTokens } from "@/lib/mock-data/tokens"
import mockupIcon from "@/assets/example-mockup.png"
import type { StaticImageData } from "next/image"

/**
 * Mock artwork for stories (same pattern as VaultCard /
 * TokenAmountInput / NetworkSwitcher stories): Next image imports
 * resolve to `{ src, … }` while Vite resolves to a URL string;
 * normalize to a plain URL and pass via the `*IconSrc` props.
 * Placeholder art, not an icon system (AGENTS.md §1).
 */
const mockupIconSrc: string =
  typeof (mockupIcon as unknown) === "string"
    ? (mockupIcon as unknown as string)
    : (mockupIcon as StaticImageData).src

const usdc = mockTokens[0]

/**
 * Deposit/Withdraw Panel (4.4) — Deposit/Withdraw tabs, Token Amount
 * Input with balance validation (insufficient balance, below-minimum),
 * fee/slippage info rows with an estimated-receive line, and the
 * approve-token flow as the entry point when approval is needed.
 */
const meta = {
  title: "Organisms/DepositWithdrawPanel",
  component: DepositWithdrawPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultTab: {
      control: "radio",
      options: ["deposit", "withdraw"],
    },
    needsApproval: { control: "boolean" },
    submitting: { control: "boolean" },
    onApprove: { action: "approve" },
    onSubmit: { action: "submit" },
    onTabChange: { action: "tab-change" },
  },
  args: {
    vaultName: "USDC Lending Prime",
    token: usdc,
    tokenIconSrc: mockupIconSrc,
    tokenBalance: 12_500,
    withdrawableBalance: 8_420,
    tokenPriceUsd: 1,
    onApprove: fn(),
    onSubmit: fn(),
    onTabChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DepositWithdrawPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("Amount")
    await userEvent.type(input, "100")
    await expect(canvas.getByText("≈ 99.9 shares")).toBeVisible()
    const cta = canvas.getByRole("button", { name: "Deposit" })
    await expect(cta).toBeEnabled()
    await userEvent.click(cta)
    await expect(args.onSubmit).toHaveBeenCalledWith("deposit", 100)
  },
}

export const WithdrawTab: Story = {
  args: { defaultTab: "withdraw" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("Amount")
    await userEvent.type(input, "50")
    await expect(canvas.getByText("≈ 49.95 USDC")).toBeVisible()
    await userEvent.click(canvas.getByRole("button", { name: "Withdraw" }))
    await expect(args.onSubmit).toHaveBeenCalledWith("withdraw", 50)
  },
}

export const InsufficientBalance: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("Amount"), "999999")
    await expect(canvas.getByText("Insufficient balance")).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Deposit" })
    ).toBeDisabled()
  },
}

export const BelowMinimum: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("Amount"), "5")
    await expect(canvas.getByText("Minimum 10 USDC")).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Deposit" })
    ).toBeDisabled()
  },
}

export const NeedsApproval: Story = {
  args: { needsApproval: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText("Amount"), "100")
    // Entry point: CTA opens the approve flow inline.
    await userEvent.click(
      canvas.getByRole("button", { name: "Approve USDC" })
    )
    await expect(canvas.getByText("Approve USDC")).toBeVisible()
    // Back returns to the form.
    await userEvent.click(canvas.getByRole("button", { name: "Back" }))
    await expect(canvas.getByLabelText("Amount")).toBeVisible()
  },
}

export const Submitting: Story = {
  args: { submitting: true },
}

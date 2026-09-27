import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { VaultCard, type VaultCardData } from "./VaultCard"
import { mockVaults, type Vault } from "@/lib/mock-data/vaults"

/**
 * Vault Card (4.1) — the product's core surface. Token badge(s)
 * (stacked pair for LP vaults), chain label, vault name, strategy
 * line, APY pill, TVL, risk indicator, audit chip, status badge,
 * and a full-width CTA. Hover treatment per DESIGN.md §7.3;
 * `featured` adds corner brackets + the pixel shadow.
 */
const toCardData = (v: Vault): VaultCardData => ({
  id: v.id,
  name: v.name,
  depositToken: v.depositToken.symbol,
  pairToken: v.pairToken?.symbol,
  apyBase: v.apyBase,
  apyReward: v.apyReward,
  apyBoost: v.apyBoost,
  tvl: v.tvl,
  risk: v.risk,
  status: v.status,
  chain: v.chain.name,
  strategy: v.strategy,
  audited: v.audited,
})

const defaultVault = toCardData(
  mockVaults.find((v) => v.id === "vault-usdc-arbitrum")!
)
const featuredVault = toCardData(
  mockVaults.find((v) => v.id === "vault-weth-mainnet")!
)
const lpVault = toCardData(mockVaults.find((v) => v.id === "vault-crv-cvx-lp")!)
const deprecatedVault = toCardData(
  mockVaults.find((v) => v.id === "vault-usdt-optimism")!
)

const meta = {
  title: "Organisms/VaultCard",
  component: VaultCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onSelect: { action: "vault-select" },
    onDeposit: { action: "vault-deposit" },
  },
  args: {
    vault: defaultVault,
    onSelect: fn(),
    onDeposit: fn(),
  },
} satisfies Meta<typeof VaultCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // §7.3 structure: label → H4 → body → action.
    await expect(canvas.getByText("USDC Lending Prime")).toBeVisible()
    await expect(canvas.getByText("Arbitrum")).toBeVisible()
    // APY pill shows the summed total.
    await expect(canvas.getByText("12.77% APY")).toBeVisible()
    await expect(canvas.getByText("$48.25M")).toBeVisible()
    // Status is text + tint, never color alone.
    await expect(canvas.getByText("Active")).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Deposit" })
    ).toBeVisible()
  },
}

export const TitleSelect: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "View USDC Lending Prime" })
    )
    await expect(args.onSelect).toHaveBeenCalledWith(defaultVault)
  },
}

export const DepositAction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Deposit" }))
    await expect(args.onDeposit).toHaveBeenCalledWith(defaultVault)
  },
}

export const Featured: Story = {
  args: {
    vault: featuredVault,
    featured: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvasElement.querySelector('[data-slot="vault-card"]')
    await expect(card?.getAttribute("data-featured")).toBe("true")
    await expect(canvas.getByText("WETH Liquid Staking Max")).toBeVisible()
  },
}

export const LiquidityPair: Story = {
  args: {
    vault: lpVault,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Stacked badge pair for the LP tokens.
    await expect(canvas.getByText("CRV")).toBeVisible()
    await expect(canvas.getByText("CVX")).toBeVisible()
  },
}

export const Deprecated: Story = {
  args: {
    vault: deprecatedVault,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Deprecated")).toBeVisible()
    // No stretched title link and a disabled CTA on deprecated vaults.
    await expect(
      canvas.queryByRole("button", { name: /View / })
    ).not.toBeInTheDocument()
    await expect(
      canvas.getByRole("button", { name: "Deprecated" })
    ).toBeDisabled()
  },
}

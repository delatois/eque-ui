import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { VaultCard, type VaultCardData } from "./VaultCard"
import { mockVaults, type Vault } from "@/lib/mock-data/vaults"
import mockupIcon from "@/assets/example-mockup.png"
import type { StaticImageData } from "next/image"

/**
 * Mock artwork for stories (same pattern as TokenAmountInput /
 * NetworkSwitcher stories): Next image imports resolve to `{ src, … }`
 * while Vite resolves to a URL string; normalize to a plain URL and
 * pass via the `*IconSrc` props. Placeholder art, not an icon system
 * (AGENTS.md §1) — going forward every component that takes icons uses
 * this same mock so Storybook gives a consistent visual reference.
 */
const mockupIconSrc: string =
  typeof (mockupIcon as unknown) === "string"
    ? (mockupIcon as unknown as string)
    : (mockupIcon as StaticImageData).src

/**
 * Vault Card (4.1) — the product's core surface. Asset icon
 * (`iconSrc`; merged pair for LP vaults, chain icon overlaid on its
 * bottom-left corner), vault name, strategy line with ecosystem icon,
 * custom tags stacked top-right, APY pill, TVL, risk indicator, audit
 * chip, and a full-width CTA. Hover treatment per DESIGN.md §7.3;
 * `featured` adds corner brackets + the pixel shadow.
 */
const toCardData = (v: Vault, tags: string[] = []): VaultCardData => ({
  id: v.id,
  name: v.name,
  depositToken: v.depositToken.symbol,
  iconSrc: mockupIconSrc,
  pairToken: v.pairToken?.symbol,
  pairIconSrc: v.pairToken ? mockupIconSrc : undefined,
  apyBase: v.apyBase,
  apyReward: v.apyReward,
  apyBoost: v.apyBoost,
  tvl: v.tvl,
  risk: v.risk,
  status: v.status,
  chain: v.chain.name,
  chainIconSrc: mockupIconSrc,
  strategy: v.strategy,
  strategyIconSrc: mockupIconSrc,
  tags,
  audited: v.audited,
})

const defaultVault = toCardData(
  mockVaults.find((v) => v.id === "vault-usdc-arbitrum")!,
  ["Single Asset"]
)
const featuredVault = toCardData(
  mockVaults.find((v) => v.id === "vault-weth-mainnet")!,
  ["Single Asset"]
)
const lpVault = toCardData(mockVaults.find((v) => v.id === "vault-crv-cvx-lp")!, [
  "Stocks",
  "LP Token",
])
const deprecatedVault = toCardData(
  mockVaults.find((v) => v.id === "vault-usdt-optimism")!,
  ["Single Asset"]
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
    await expect(canvas.getByText("USDC Lending Prime")).toBeVisible()
    // Asset icon image + chain icon overlay (chain name is not rendered).
    await expect(
      canvas.getByRole("img", { name: "USDC on Arbitrum" })
    ).toBeVisible()
    const imgs = canvasElement.querySelectorAll("img")
    // asset + chain overlay + strategy icon
    await expect(imgs.length).toBeGreaterThanOrEqual(3)
    await expect(canvas.queryByText("Arbitrum")).not.toBeInTheDocument()
    // Custom tag replaces the old status badge.
    await expect(canvas.getByText("Single Asset")).toBeVisible()
    await expect(canvas.queryByText("Active")).not.toBeInTheDocument()
    // APY pill shows the summed total.
    await expect(canvas.getByText("12.77% APY")).toBeVisible()
    await expect(canvas.getByText("$48.25M")).toBeVisible()
    await expect(canvas.getByText("Aave V3 supply looping")).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Deposit" })).toBeVisible()
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
    // Merged pair icons: two asset images inside the icon wrapper.
    await expect(
      canvas.getByRole("img", { name: /CRV \/ CVX/ })
    ).toBeVisible()
    const imgs = canvasElement.querySelectorAll("img")
    // pair (2) + chain overlay + strategy icon
    await expect(imgs.length).toBeGreaterThanOrEqual(4)
    // Two custom tags stacked.
    await expect(canvas.getByText("Stocks")).toBeVisible()
    await expect(canvas.getByText("LP Token")).toBeVisible()
  },
}

export const Deprecated: Story = {  args: {
    vault: deprecatedVault,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // No stretched title link and a disabled CTA on deprecated vaults.
    await expect(canvas.queryByRole("button", { name: /View / })).not.toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "Deprecated" })).toBeDisabled()
  },
}

export const NoIcons: Story = {
  args: {
    vault: {
      ...defaultVault,
      iconSrc: undefined,
      chainIconSrc: undefined,
      strategyIconSrc: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Fallback: generic letter tile, no chain overlay, no strategy icon.
    await expect(canvas.getByText("U")).toBeVisible()
    await expect(
      canvas.getByRole("img", { name: "USDC on Arbitrum" })
    ).toBeVisible()
    await expect(canvasElement.querySelectorAll("img")).toHaveLength(0)
  },
}

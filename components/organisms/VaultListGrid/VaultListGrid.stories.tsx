import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { VaultListGrid } from "./VaultListGrid"
import type { VaultCardData } from "@/components/organisms/VaultCard"
import { mockVaults, type Vault } from "@/lib/mock-data/vaults"
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

/**
 * Vault List/Grid (4.3) — Search & Filter Bar (2.8) plus sort control
 * and a grid/table view toggle above a responsive Vault Card grid or
 * a dense Vault Table Row table, with Pagination, loading skeletons,
 * and an empty-results state.
 */
const toCardData = (v: Vault): VaultCardData => ({
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
  tags: v.pairToken ? ["Stocks", "LP Token"] : ["Single Asset"],
  audited: v.audited,
})

const allVaults = mockVaults.map(toCardData)

const meta = {
  title: "Organisms/VaultListGrid",
  component: VaultListGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onSelect: { action: "vault-select" },
    onDeposit: { action: "vault-deposit" },
    defaultView: {
      control: "radio",
      options: ["grid", "table"],
    },
    pageSize: { control: "number" },
    loading: { control: "boolean" },
  },
  args: {
    vaults: allVaults,
    onSelect: fn(),
    onDeposit: fn(),
  },
} satisfies Meta<typeof VaultListGrid>

export default meta
type Story = StoryObj<typeof meta>

const cardCount = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="vault-card"]').length
const rowCount = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="vault-table-row"]').length

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("8 vaults")).toBeVisible()
    // Page 1 of 2 (pageSize 6).
    await expect(cardCount(canvasElement)).toBe(6)
    await userEvent.click(canvas.getByRole("button", { name: "2" }))
    await expect(cardCount(canvasElement)).toBe(2)
  },
}

export const TableView: Story = {
  args: { defaultView: "table" },
  play: async ({ canvasElement }) => {
    await expect(rowCount(canvasElement)).toBe(6)
  },
}

export const ViewToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(cardCount(canvasElement)).toBe(6)
    await userEvent.click(canvas.getByRole("button", { name: "Table view" }))
    await expect(rowCount(canvasElement)).toBe(6)
    await expect(cardCount(canvasElement)).toBe(0)
    await userEvent.click(canvas.getByRole("button", { name: "Grid view" }))
    await expect(cardCount(canvasElement)).toBe(6)
  },
}

export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByPlaceholderText("Search vaults…"),
      "USDC"
    )
    await expect(canvas.getByText("1 vault")).toBeVisible()
    await expect(cardCount(canvasElement)).toBe(1)
    await expect(canvas.getByText("USDC Lending Prime")).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Loading vaults…")).toBeVisible()
    await expect(cardCount(canvasElement)).toBe(0)
  },
}

export const LoadingTable: Story = {
  args: { loading: true, defaultView: "table" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Loading vaults…")).toBeVisible()
    await expect(rowCount(canvasElement)).toBe(0)
  },
}

export const EmptyResults: Story = {
  args: { defaultSearchValue: "zzz-no-match" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText("No vaults match your filters")
    ).toBeVisible()
    // Clearing restores the full list.
    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }))
    await expect(canvas.getByText("8 vaults")).toBeVisible()
    await expect(cardCount(canvasElement)).toBe(6)
  },
}

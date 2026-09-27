import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { VaultTableRow, type VaultTableRowData } from "./VaultTableRow"
import { mockVaults, type Vault } from "@/lib/mock-data/vaults"

/**
 * Vault Table Row (4.2) — the Vault Card's data in dense table form:
 * asset icon (merged pair for LP vaults) + name, APY pill, TVL,
 * risk indicator, and a click-through chevron. Numbers are
 * right-aligned in Spline Sans Mono, tabular (DESIGN.md §7.7).
 */
const toRowData = (v: Vault): VaultTableRowData => ({
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
})

const defaultVault = toRowData(
  mockVaults.find((v) => v.id === "vault-usdc-arbitrum")!
)
const lpVault = toRowData(mockVaults.find((v) => v.id === "vault-crv-cvx-lp")!)
const deprecatedVault = toRowData(
  mockVaults.find((v) => v.id === "vault-usdt-optimism")!
)
const wethVault = toRowData(
  mockVaults.find((v) => v.id === "vault-weth-mainnet")!
)

/** Minimal table shell so the row renders in a realistic context. */
function RowTable({ children }: { children: React.ReactNode }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vault</TableHead>
          <TableHead className="text-right">APY</TableHead>
          <TableHead className="text-right">TVL</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>
            <span className="sr-only">Open</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

const meta = {
  title: "Organisms/VaultTableRow",
  component: VaultTableRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onSelect: { action: "vault-select" },
    selected: { control: "boolean" },
  },
  args: {
    onSelect: fn(),
  },
  render: (args) => (
    <RowTable>
      <VaultTableRow {...args} />
    </RowTable>
  ),
} satisfies Meta<typeof VaultTableRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { vault: defaultVault },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("USDC Lending Prime")).toBeVisible()
    await expect(canvas.getByText("12.77% APY")).toBeVisible()
    await expect(canvas.getByText("$48.25M")).toBeVisible()
    // Row click-through (mouse path).
    const row = canvasElement.querySelector('[data-slot="vault-table-row"]')!
    await userEvent.click(row)
    await expect(args.onSelect).toHaveBeenCalledWith(defaultVault)
  },
}

export const KeyboardSelect: Story = {
  args: { vault: defaultVault },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    // Keyboard path: the vault name is a real button.
    const nameButton = canvas.getByRole("button", {
      name: "USDC Lending Prime",
    })
    nameButton.focus()
    await userEvent.keyboard("{Enter}")
    await expect(args.onSelect).toHaveBeenCalledWith(defaultVault)
  },
}

export const Selected: Story = {
  args: { vault: defaultVault, selected: true },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="vault-table-row"]')!
    await expect(row.getAttribute("data-selected")).toBe("true")
  },
}

export const LiquidityPair: Story = {
  args: { vault: lpVault },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // CRV and CVX both render a "C" tile, merged.
    await expect(canvas.getAllByText("C")).toHaveLength(2)
    await expect(canvas.getByText("CRV/CVX Concentrated LP")).toBeVisible()
  },
}

export const Deprecated: Story = {
  args: { vault: deprecatedVault },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    // Not interactive: name is plain text, no chevron, clicks do nothing.
    // (Also exercises the very-long-name edge case from mock data.)
    await expect(
      canvas.queryByRole("button", { name: /USDT Sunset Pool/ })
    ).not.toBeInTheDocument()
    const row = canvasElement.querySelector('[data-slot="vault-table-row"]')!
    await userEvent.click(row)
    await expect(args.onSelect).not.toHaveBeenCalled()
  },
}

export const VaultTable: Story = {
  args: { vault: defaultVault, onSelect: fn() },
  render: (args) => (
    <RowTable>
      <VaultTableRow vault={defaultVault} onSelect={args.onSelect} />
      <VaultTableRow vault={wethVault} onSelect={args.onSelect} selected />
      <VaultTableRow vault={lpVault} onSelect={args.onSelect} />
      <VaultTableRow vault={deprecatedVault} onSelect={args.onSelect} />
    </RowTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rows = canvasElement.querySelectorAll('[data-slot="vault-table-row"]')
    await expect(rows).toHaveLength(4)
    await expect(canvas.getByText("USDC Lending Prime")).toBeVisible()
    await expect(canvas.getByText("WETH Liquid Staking Max")).toBeVisible()
  },
}

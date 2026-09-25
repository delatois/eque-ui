import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import { getMockChains } from "@/lib/mock-data/chains"
import {
  SearchFilterBar,
  type FilterDef,
} from "./SearchFilterBar"

const filters: FilterDef[] = [
  {
    id: "chain",
    label: "Chain",
    options: getMockChains().map((c) => ({
      value: String(c.id),
      label: c.name,
    })),
  },
  {
    id: "risk",
    label: "Risk",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
  {
    id: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "settling", label: "Settling" },
      { value: "settled", label: "Settled" },
    ],
  },
]

/**
 * Eque Search & Filter Bar (2.8) — search field plus chain/risk/status
 * dropdowns with active-filter chips. Each chip clears its own
 * filter; "Clear all" resets everything.
 */
const meta = {
  title: "Molecules/SearchFilterBar",
  component: SearchFilterBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    searchPlaceholder: { control: "text" },
    onSearchChange: { action: "search" },
    onFilterChange: { action: "filter" },
    onClearAll: { action: "clear-all" },
  },
  args: {
    filters,
    searchPlaceholder: "Search vaults…",
  },
} satisfies Meta<typeof SearchFilterBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultActiveFilters: { chain: "8453", risk: "low" },
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="search-filter-bar"]'
    ) as HTMLElement
    await expect(
      root.querySelector('[data-filter="chain"]')
    ).toHaveTextContent("Chain: Base")
    await expect(
      root.querySelector('[data-filter="risk"]')
    ).toHaveTextContent("Risk: Low")
    await expect(root.querySelector('[data-filter="status"]')).toBeNull()
  },
}

export const SearchTyping: Story = {
  args: { onSearchChange: fn() },
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByRole("searchbox", { name: "Search" }),
      "nvda"
    )
    await waitFor(() =>
      expect(args.onSearchChange).toHaveBeenLastCalledWith("nvda")
    )
  },
}

export const ClearOneChip: Story = {
  args: {
    defaultActiveFilters: { chain: "8453", risk: "low" },
    onFilterChange: fn(),
  },
  play: async ({ canvas, canvasElement, args }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Clear Chain filter" })
    )
    await waitFor(() =>
      expect(args.onFilterChange).toHaveBeenCalledWith("chain", null)
    )
    await expect(
      canvasElement.querySelector('[data-filter="chain"]')
    ).toBeNull()
    // The other chip survives.
    await expect(
      canvasElement.querySelector('[data-filter="risk"]')
    ).not.toBeNull()
  },
}

export const ClearAll: Story = {
  args: {
    defaultActiveFilters: { chain: "8453", risk: "low", status: "active" },
    onClearAll: fn(),
  },
  play: async ({ canvas, canvasElement, args }) => {
    // 3 chips + the Clear all button.
    await expect(
      canvasElement.querySelectorAll('[data-slot="active-filter-chip"]')
    ).toHaveLength(3)
    await userEvent.click(canvas.getByRole("button", { name: "Clear all" }))
    await waitFor(() => expect(args.onClearAll).toHaveBeenCalledTimes(1))
    await expect(
      canvasElement.querySelector('[data-slot="active-filter-chip"]')
    ).toBeNull()
  },
}

export const NoActiveFilters: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="active-filter-chip"]')
    ).toBeNull()
    // The chips row (and Clear all) only renders when something is active.
    await expect(
      screen.queryByRole("button", { name: "Clear all" })
    ).toBeNull()
  },
}

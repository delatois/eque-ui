import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Skeleton } from "./Skeleton"

/**
 * Eque Skeleton Loader (1.11) — sharp `surface-high` pulse blocks for
 * pending content. `text` is a single 16px line, `card` a 96px block,
 * `row` a vault-table-style row (ticker square + lines + figure). All
 * blocks are `aria-hidden`; the wrapper is `role="status"` with an
 * author label. The pulse freezes under `prefers-reduced-motion`.
 */
const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] max-w-[90vw]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "card", "row"],
      description: "Placeholder shape",
      table: { defaultValue: { summary: "text" } },
    },
    label: {
      control: "text",
      description: "Screen-reader text for the placeholder",
      table: { defaultValue: { summary: "Loading content" } },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status", { name: "Loading content" })
    await expect(status).toBeInTheDocument()
    await expect(status).toHaveAttribute("data-variant", "text")
    const block = status.querySelector('[data-slot="skeleton"]')
    await expect(block).toHaveAttribute("aria-hidden", "true")
    await expect(getComputedStyle(block as HTMLElement).height).toBe("16px")
  },
}

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton label="Loading title" />
      <Skeleton label="Loading subtitle" className="w-3/4" />
      <Skeleton label="Loading detail" className="w-1/2" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("status", { name: "Loading title" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("status", { name: "Loading subtitle" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("status", { name: "Loading detail" })
    ).toBeInTheDocument()
  },
}

export const CardBlock: Story = {
  args: { variant: "card", label: "Loading vault card" },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status", { name: "Loading vault card" })
    const block = status.querySelector('[data-slot="skeleton"]')
    await expect(getComputedStyle(block as HTMLElement).height).toBe("96px")
  },
}

export const TableRow: Story = {
  args: { variant: "row", label: "Loading vault row" },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status", { name: "Loading vault row" })
    await expect(status).toHaveAttribute("data-variant", "row")
    // Ticker square is a 40px sharp block.
    const square = status.querySelector("span > span > span") as HTMLElement
    await expect(getComputedStyle(square).width).toBe("40px")
    await expect(getComputedStyle(square).height).toBe("40px")
  },
}

export const VaultCardLoading: Story = {
  name: "Vault card loading (composite usage)",
  render: () => (
    <div className="flex flex-col gap-3 border border-border-default bg-surface p-4">
      <Skeleton label="Loading vault name" className="w-2/3" />
      <Skeleton variant="card" label="Loading vault chart" className="h-16" />
      <div className="flex gap-3">
        <Skeleton label="Loading TVL" className="flex-1" />
        <Skeleton label="Loading APY" className="flex-1" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("status", { name: "Loading vault name" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("status", { name: "Loading vault chart" })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole("status", { name: "Loading TVL" })
    ).toBeInTheDocument()
  },
}

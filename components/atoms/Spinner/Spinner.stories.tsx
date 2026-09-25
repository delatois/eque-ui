import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Spinner } from "./Spinner"

/**
 * Eque Spinner (1.10) — the single canonical pending indicator, shared
 * by buttons, panels, and estimating states. `LoaderCircle` in
 * `primary` at sm/md/lg (12/16/24px) with `role="status"` and a
 * visually-hidden label; motion freezes under `prefers-reduced-motion`.
 */
const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Indicator size (12 / 16 / 24px)",
      table: { defaultValue: { summary: "md" } },
    },
    label: {
      control: "text",
      description: "Screen-reader text announced with the indicator",
      table: { defaultValue: { summary: "Loading" } },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status", { name: "Loading" })
    await expect(status).toBeInTheDocument()
    await expect(status.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" label="Small loading" />
      <Spinner size="md" label="Medium loading" />
      <Spinner size="lg" label="Large loading" />
    </div>
  ),
  play: async ({ canvas }) => {
    // NOTE: measured via computed style, not bounding rect — the rect of
    // a spinning glyph oscillates with the rotation angle.
    const boxes: Record<string, string> = { sm: "12px", md: "16px", lg: "24px" }
    for (const [size, px] of Object.entries(boxes)) {
      const svg = canvas
        .getByRole("status", {
          name: `${size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"} loading`,
        })
        .querySelector("svg") as SVGElement
      const cs = getComputedStyle(svg)
      await expect(cs.width).toBe(px)
      await expect(cs.height).toBe(px)
    }
  },
}

export const WithLabel: Story = {
  args: { label: "Estimating gas fees" },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("status", { name: "Estimating gas fees" })
    ).toBeInTheDocument()
  },
}

export const LoadingPanel: Story = {
  name: "Loading panel (composite usage)",
  render: () => (
    <div className="flex w-[320px] max-w-[90vw] items-center gap-3 border border-border-default bg-surface p-4">
      <Spinner label="Estimating gas fees" />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-xs text-text-primary">
          Estimating gas fees…
        </span>
        <span className="font-body text-xs text-text-secondary">
          Fetching the latest network prices.
        </span>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("status", { name: "Estimating gas fees" })
    ).toBeInTheDocument()
    await expect(canvas.getByText("Estimating gas fees…")).toBeInTheDocument()
  },
}

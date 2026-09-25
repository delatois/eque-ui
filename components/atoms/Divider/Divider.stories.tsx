import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Divider } from "./Divider"

/**
 * Eque Divider (1.12) — the 1px `border-subtle` hairline for section
 * breaks (horizontal) and column splits (vertical, stretches to the
 * flex-row height). Non-interactive; semantics come from Base UI
 * (`role="separator"` + `aria-orientation`).
 */
const meta = {
  title: "Atoms/Divider",
  component: Divider,
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
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Section break or column divider",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator")
    await expect(separator).toBeInTheDocument()
    const cs = getComputedStyle(separator)
    await expect(cs.height).toBe("1px")
    await expect(cs.backgroundColor).toBe("rgb(26, 34, 45)")
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-16 items-stretch gap-4">
      <span className="font-body text-sm text-text-secondary">Deposits</span>
      <Divider {...args} />
      <span className="font-body text-sm text-text-secondary">Withdrawals</span>
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator")
    await expect(separator).toHaveAttribute("aria-orientation", "vertical")
    const cs = getComputedStyle(separator)
    await expect(cs.width).toBe("1px")
    // Stretches to the flex-row height (64px container).
    await expect(Math.round(separator.getBoundingClientRect().height)).toBe(64)
  },
}

export const SectionBreak: Story = {
  name: "Section break (composite usage)",
  render: () => (
    <div className="flex flex-col gap-4">
      <h2 className="type-h2">Vault performance</h2>
      <Divider />
      <p className="type-body-m">
        Net APY across all active vaults, updated every block.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toBeInTheDocument()
    await expect(
      canvas.getByRole("heading", { name: "Vault performance" })
    ).toBeInTheDocument()
  },
}

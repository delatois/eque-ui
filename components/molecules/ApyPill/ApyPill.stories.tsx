import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"
import { formatPercentage } from "@/lib/utils"
import { getMockVaults } from "@/lib/mock-data/vaults"
import { ApyPill } from "./ApyPill"

/**
 * Eque APY Pill (2.2) — total APY (base + reward + boost) in a brand
 * badge; hover or keyboard focus opens the Tooltip breakdown
 * (Base / Reward / Boost rows in tabular Mono). The badge trigger is
 * focusable so keyboard users can open the breakdown; Escape
 * dismisses it.
 */
const meta = {
  title: "Molecules/ApyPill",
  component: ApyPill,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center py-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    apyBase: {
      control: "number",
      description: "Base APY component, in percent units",
    },
    apyReward: {
      control: "number",
      description: "Reward APY component, in percent units",
    },
    apyBoost: {
      control: "number",
      description: "Boost APY component, in percent units",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Tooltip placement",
      table: { defaultValue: { summary: "top" } },
    },
  },
} satisfies Meta<typeof ApyPill>

export default meta
type Story = StoryObj<typeof meta>

const BASE = 8.42
const REWARD = 3.15
const BOOST = 1.2
const TOTAL = formatPercentage(BASE + REWARD + BOOST)

export const Default: Story = {
  args: {
    apyBase: BASE,
    apyReward: REWARD,
    apyBoost: BOOST,
  },
  play: async ({ canvas }) => {
    // Totals are computed with the same formatter the component uses,
    // so binary floating-point sums can't drift the expectation.
    const pill = canvas.getByText(`${TOTAL} APY`)
    await expect(pill.closest('[data-slot="apy-pill"]')).toBeInTheDocument()
    await expect(getComputedStyle(pill).color).toBe("rgb(31, 255, 195)")
    // Low boost: no sparkle.
    await expect(
      pill
        .closest('[data-slot="apy-pill"]')
        ?.querySelector('[data-slot="apy-pill-sparkle"]')
    ).not.toBeInTheDocument()

    await userEvent.hover(pill)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText(`Base ${formatPercentage(BASE)}`)
    ).toBeInTheDocument()
    await expect(
      screen.getByText(`Reward ${formatPercentage(REWARD)}`)
    ).toBeInTheDocument()
    await expect(
      screen.getByText(`Boost ${formatPercentage(BOOST)}`)
    ).toBeInTheDocument()
    await userEvent.unhover(pill)
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    })
  },
}

export const KeyboardFocus: Story = {
  name: "Keyboard focus opens breakdown",
  args: {
    apyBase: BASE,
    apyReward: REWARD,
    apyBoost: BOOST,
  },
  play: async ({ canvas }) => {
    // The text node is the inner MonoNumber span — focus must land on
    // the focusable badge trigger that carries `tabIndex={0}`.
    const pill = canvas
      .getByText(`${TOTAL} APY`)
      .closest('[data-slot="apy-pill"]') as HTMLElement
    await expect(pill).toHaveAttribute("tabindex", "0")
    pill.focus()
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText(`Boost ${formatPercentage(BOOST)}`)
    ).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    })
  },
}

export const ZeroApy: Story = {
  name: "Zero APY (edge case)",
  args: {
    apyBase: 0,
    apyReward: 0,
    apyBoost: 0,
  },
  play: async ({ canvas }) => {
    const pill = canvas.getByText("0.00% APY")
    await expect(pill.closest('[data-slot="apy-pill"]')).toBeInTheDocument()
    await userEvent.hover(pill)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(screen.getByText("Base 0.00%")).toBeInTheDocument()
  },
}

export const BoostedSparkle: Story = {
  name: "High boost shows sparkle",
  args: {
    apyBase: 0.42,
    apyReward: 1.15,
    apyBoost: 8.2,
  },
  play: async ({ canvas }) => {
    const total = formatPercentage(0.42 + 1.15 + 8.2)
    const pillText = canvas.getByText(`${total} APY`)
    const pill = pillText.closest('[data-slot="apy-pill"]')
    const sparkle = pill?.querySelector('[data-slot="apy-pill-sparkle"]')
    await expect(sparkle).toBeInTheDocument()
    await expect(sparkle).toHaveAttribute("aria-hidden", "true")
    // Sparkle inherits the badge's brand teal.
    await expect(getComputedStyle(sparkle as Element).color).toBe(
      "rgb(31, 255, 195)"
    )
    await userEvent.hover(pillText)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText(`Boost ${formatPercentage(8.2)}`)
    ).toBeInTheDocument()
  },
}

export const NoBoost: Story = {
  name: "No boost component",
  args: {
    apyBase: 4.18,
    apyReward: 2.02,
    apyBoost: 0,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(`${formatPercentage(4.18 + 2.02)} APY`)
    ).toBeInTheDocument()
  },
}

export const NegativeApy: Story = {
  name: "Negative total turns red",
  args: {
    apyBase: -8.2,
    apyReward: 1.5,
    apyBoost: 0.2,
  },
  play: async ({ canvas }) => {
    const total = formatPercentage(-8.2 + 1.5 + 0.2)
    const pillText = canvas.getByText(`${total} APY`)
    const pill = pillText.closest('[data-slot="apy-pill"]')
    await expect(pill).toHaveAttribute("data-negative", "true")
    // Error red pairs with the minus sign (never color alone, §9).
    await expect(getComputedStyle(pillText).color).toBe("rgb(255, 107, 107)")
    await userEvent.hover(pillText)
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument()
    })
    await expect(
      screen.getByText(`Base ${formatPercentage(-8.2)}`)
    ).toBeInTheDocument()
  },
}

const [firstVault, secondVault, thirdVault] = getMockVaults()

export const VaultApyRow: Story = {
  name: "Vault APY row (composite usage)",
  // Required props must be present for the story type even though the
  // custom render below ignores them (same rule as Select/RadioGroup).
  args: {
    apyBase: BASE,
    apyReward: REWARD,
    apyBoost: BOOST,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ApyPill
        apyBase={firstVault.apyBase}
        apyReward={firstVault.apyReward}
        apyBoost={firstVault.apyBoost}
      />
      <ApyPill
        apyBase={secondVault.apyBase}
        apyReward={secondVault.apyReward}
        apyBoost={secondVault.apyBoost}
      />
      <ApyPill
        apyBase={thirdVault.apyBase}
        apyReward={thirdVault.apyReward}
        apyBoost={thirdVault.apyBoost}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const pills = canvas.getAllByText(/% APY/)
    await expect(pills).toHaveLength(3)
    await expect(
      canvas.getByText(
        `${formatPercentage(firstVault.apyBase + firstVault.apyReward + firstVault.apyBoost)} APY`
      )
    ).toBeInTheDocument()
  },
}

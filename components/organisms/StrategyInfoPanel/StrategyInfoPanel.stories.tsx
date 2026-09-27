import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"
import { StrategyInfoPanel } from "./StrategyInfoPanel"

/**
 * Strategy Info Panel (4.5) — strategy description with underlying
 * protocols as text badges, a "how compounding works" explainer, risk
 * factors as a bulleted list, and audit/security links.
 */
const meta = {
  title: "Organisms/StrategyInfoPanel",
  component: StrategyInfoPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    strategyName: { control: "text" },
    description: { control: "text" },
  },
  args: {
    strategyName: "Options Premium",
    description:
      "Sells short-dated covered calls against the vault's stock holdings each epoch. Premium collected at auction is auto-compounded back into the underlying, so yield scales with volatility instead of fighting it.",
    protocols: ["Eque Options AMM", "Morpho", "Uniswap V3"],
    compoundingSteps: [
      "The vault sells covered calls at the start of each epoch.",
      "Market makers bid for the options in an onchain auction.",
      "Winning premium is swapped back into the underlying asset.",
      "New shares are minted from the premium, compounding every epoch.",
    ],
    riskFactors: [
      "Upside is capped at the strike price while options are outstanding.",
      "Premium income drops in low-volatility markets.",
      "Smart-contract risk across the vault and auction contracts.",
    ],
    links: [
      { label: "Audit report — Zellic", href: "#" },
      { label: "Audit report — ChainSecurity", href: "#" },
      { label: "Bug bounty — Immunefi", href: "#" },
      { label: "Source code — GitHub", href: "#" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StrategyInfoPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Options Premium")).toBeVisible()
    await expect(canvas.getByText("Morpho")).toBeVisible()
    await expect(canvas.getByText("How compounding works")).toBeVisible()
    await expect(canvas.getByText("Risk factors")).toBeVisible()
    await expect(canvas.getByText("Audits & security")).toBeVisible()
    const audit = canvas.getByText("Audit report — Zellic")
    await expect(audit.closest("a")).toHaveAttribute("href", "#")
  },
}

export const Minimal: Story = {
  args: {
    strategyName: "Lending Loop",
    description: "Supplies the underlying to Morpho markets and loops the borrow.",
    protocols: ["Morpho"],
    compoundingSteps: [],
    riskFactors: [],
    links: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Lending Loop")).toBeVisible()
    // Empty sections render nothing.
    await expect(
      canvas.queryByText("How compounding works")
    ).not.toBeInTheDocument()
    await expect(canvas.queryByText("Risk factors")).not.toBeInTheDocument()
    await expect(
      canvas.queryByText("Audits & security")
    ).not.toBeInTheDocument()
  },
}

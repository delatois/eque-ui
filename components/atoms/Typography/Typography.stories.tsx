import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Heading, MonoNumber, Text } from "./Typography"

/**
 * Eque Typography (1.13) — `Heading` (display/h1–h5, Spline Sans Mono,
 * fluid clamp sizes), `Text` (lead/body-l/m/s/caption, Google Sans),
 * and `MonoNumber` (tabular figures for APY/amounts). Exact
 * family/weight/size/leading/tracking per DESIGN.md §3.2, default
 * colors per §3.3.
 */
const meta = {
  title: "Atoms/Typography",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[640px] max-w-[90vw]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

const headingRanges: Record<string, [number, number]> = {
  display: [44, 80],
  h1: [36, 56],
  h2: [28, 40],
  h3: [24, 32],
  h4: [20, 24],
  h5: [18, 20],
}

export const HeadingLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level="display">Maximize yield on autopilot</Heading>
      <Heading level="h1">Vaults overview</Heading>
      <Heading level="h2">Top performing vaults</Heading>
      <Heading level="h3">Strategy allocation</Heading>
      <Heading level="h4">Risk assessment</Heading>
      <Heading level="h5">Deposit panel</Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const [level, [min, max]] of Object.entries(headingRanges)) {
      const el = canvasElement.querySelector(
        `[data-slot="heading"][data-level="${level}"]`
      ) as HTMLElement
      await expect(el).toBeInTheDocument()
      const cs = getComputedStyle(el)
      await expect(cs.fontFamily).toContain("Spline Sans Mono")
      const px = parseFloat(cs.fontSize)
      await expect(px).toBeGreaterThanOrEqual(min)
      await expect(px).toBeLessThanOrEqual(max)
    }
    // display → h1, levels map to their own element.
    await expect(
      canvasElement.querySelector('[data-level="display"]')?.tagName
    ).toBe("H1")
    await expect(
      canvasElement.querySelector('[data-level="h4"]')?.tagName
    ).toBe("H4")
  },
}

export const HeadingWeights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level="h1">Bold page title</Heading>
      <Heading level="h2">SemiBold section title</Heading>
      <Heading level="h5">Medium panel title</Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const weight = (level: string) =>
      getComputedStyle(
        canvasElement.querySelector(
          `[data-slot="heading"][data-level="${level}"]`
        ) as HTMLElement
      ).fontWeight
    await expect(weight("h1")).toBe("700")
    await expect(weight("h2")).toBe("600")
    await expect(weight("h5")).toBe("500")
  },
}

export const TextVariants: Story = {
  render: () => (
    <div className="flex max-w-prose flex-col gap-3">
      <Text variant="lead">Put your assets to work across every pool.</Text>
      <Text variant="body-l">
        Strategies auto-compound farming rewards back into your deposit.
      </Text>
      <Text variant="body-m">
        Deposit into a vault and the strategy handles the rest.
      </Text>
      <Text variant="body-s">TVL updates every block. Figures in USD.</Text>
      <Text variant="caption">Updated 12 seconds ago · Base network</Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const variant of ["lead", "body-l", "body-m", "body-s", "caption"]) {
      const el = canvasElement.querySelector(
        `[data-slot="text"][data-variant="${variant}"]`
      ) as HTMLElement
      await expect(el).toBeInTheDocument()
      await expect(getComputedStyle(el).fontFamily).toContain("Google Sans")
    }
    const sizes: Record<string, string> = {
      "body-m": "16px",
      "body-s": "14px",
      caption: "12px",
    }
    for (const [variant, px] of Object.entries(sizes)) {
      const el = canvasElement.querySelector(
        `[data-slot="text"][data-variant="${variant}"]`
      ) as HTMLElement
      await expect(getComputedStyle(el).fontSize).toBe(px)
    }
    // Caption renders tertiary meta text (#8F9CAD).
    const caption = canvasElement.querySelector(
      '[data-slot="text"][data-variant="caption"]'
    ) as HTMLElement
    await expect(getComputedStyle(caption).color).toBe("rgb(143, 156, 173)")
  },
}

export const Numbers: Story = {
  render: () => (
    <div className="flex items-baseline gap-6">
      <MonoNumber>12.34%</MonoNumber>
      <MonoNumber>$1,234,567.89</MonoNumber>
      <MonoNumber>0x4F3a…9c21</MonoNumber>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const numbers = canvasElement.querySelectorAll('[data-slot="mono-number"]')
    await expect(numbers.length).toBe(3)
    for (const el of numbers) {
      const cs = getComputedStyle(el as HTMLElement)
      await expect(cs.fontFamily).toContain("Spline Sans Mono")
      await expect(cs.fontVariantNumeric).toContain("tabular-nums")
    }
  },
}

export const VaultHeader: Story = {
  name: "Vault header (composite usage)",
  render: () => (
    <div className="flex max-w-prose flex-col gap-2">
      <Heading level="h2">USDC Base Vault</Heading>
      <Text variant="body-m">
        Auto-compounds Aerodrome farming rewards back into USDC. Deposits
        stay liquid — withdraw anytime.
      </Text>
      <div className="flex items-baseline gap-4">
        <MonoNumber className="text-lg">8.42%</MonoNumber>
        <Text variant="caption" as="span">
          net APY · $2.4M TVL
        </Text>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: "USDC Base Vault" })
    ).toBeInTheDocument()
    await expect(canvas.getByText(/Auto-compounds Aerodrome/)).toBeInTheDocument()
    await expect(canvas.getByText("8.42%")).toBeInTheDocument()
  },
}

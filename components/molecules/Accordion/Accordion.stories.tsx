import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import { Accordion, type AccordionItemDef } from "./Accordion"

const items: AccordionItemDef[] = [
  {
    value: "what",
    title: "What is Eque?",
    content:
      "Eque Protocol is JEPQ rebuilt onchain — single-asset vaults that sell covered calls every epoch and compound the premium.",
  },
  {
    value: "how",
    title: "How do epochs work?",
    content:
      "Each epoch auctions a covered-call option to market makers. Premium flows back into the vault and compounds depositor shares.",
  },
  {
    value: "risk",
    title: "What are the risks?",
    content:
      "Smart-contract risk, oracle risk, and options-market risk. This is experimental software — never deposit more than you can lose.",
  },
]

/**
 * Eque Accordion (2.10) — sharp hairline-divided sections with an
 * animated expand/collapse that collapses to instant under
 * `prefers-reduced-motion`. Single mode keeps one section open;
 * `multiple` allows several.
 */
const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    onValueChange: { action: "toggle" },
  },
  args: {
    items,
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: { defaultValue: ["what"] },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="accordion"]'
    ) as HTMLElement
    const first = root.querySelector(
      '[data-value="what"] [data-slot="accordion-panel"]'
    ) as HTMLElement
    const secondTrigger = screen.getByRole("button", {
      name: "How do epochs work?",
    })
    // First section open by default…
    await expect(first).toHaveAttribute("data-open")
    // …opening the second closes it (single mode).
    await userEvent.click(secondTrigger)
    await waitFor(() =>
      expect(
        root.querySelector(
          '[data-value="how"] [data-slot="accordion-panel"]'
        )
      ).toHaveAttribute("data-open")
    )
    await expect(first).toHaveAttribute("data-closed")
  },
}

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["what", "how"] },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="accordion"]'
    ) as HTMLElement
    await expect(
      root.querySelector('[data-value="what"] [data-slot="accordion-panel"]')
    ).toHaveAttribute("data-open")
    await expect(
      root.querySelector('[data-value="how"] [data-slot="accordion-panel"]')
    ).toHaveAttribute("data-open")
    await expect(
      root.querySelector('[data-value="risk"] [data-slot="accordion-panel"]')
    ).toHaveAttribute("data-closed")
  },
}

export const Collapsed: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="accordion"]'
    ) as HTMLElement
    for (const v of ["what", "how", "risk"]) {
      await expect(
        root.querySelector(`[data-value="${v}"] [data-slot="accordion-panel"]`)
      ).toHaveAttribute("data-closed")
    }
  },
}

export const DisabledItem: Story = {
  args: {
    items: items.map((item) =>
      item.value === "risk" ? { ...item, disabled: true } : item
    ),
    onValueChange: fn(),
  },
  play: async ({ args }) => {
    const trigger = screen.getByRole("button", {
      name: "What are the risks?",
    })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

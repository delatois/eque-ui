import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { Checkbox } from "./Checkbox"

/**
 * Eque Checkbox (TASKS.md 1.4, DESIGN.md §7.2) — 16px sharp square.
 * Checked and indeterminate fill `primary` with an `on-primary` glyph
 * (check vs dash); the inline label toggles via `htmlFor`.
 */
const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px] max-w-[90vw]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled ticked state",
    },
    defaultChecked: {
      control: "boolean",
      description: "Uncontrolled initial ticked state",
      table: { defaultValue: { summary: "false" } },
    },
    indeterminate: {
      control: "boolean",
      description: "Mixed state — dash glyph + aria-checked mixed (controlled-only)",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: { defaultValue: { summary: "false" } },
    },
    label: {
      control: "text",
      description: "Inline label beside the box",
    },
    description: {
      control: "text",
      description: "Caption below the label",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible name when no visible label is rendered",
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Fires with the next state on toggle",
      table: { disable: true },
    },
  },
  args: {
    onCheckedChange: undefined,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Auto-compound rewards",
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Auto-compound rewards" })
    await expect(box).toHaveAttribute("aria-checked", "false")
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "true")
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "false")
  },
}

export const Checked: Story = {
  args: {
    label: "Auto-compound rewards",
    defaultChecked: true,
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Auto-compound rewards" })
    await expect(box).toHaveAttribute("aria-checked", "true")
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "false")
  },
}

export const Indeterminate: Story = {
  args: {
    label: "Select all vaults",
    indeterminate: true,
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Select all vaults" })
    await expect(box).toHaveAttribute("aria-checked", "mixed")
    // Controlled without a handler — clicking keeps the dash state.
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "mixed")
  },
}

export const KeyboardToggle: Story = {
  args: {
    label: "Confirm deposit",
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Confirm deposit" })
    box.focus()
    await expect(box).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(box).toHaveAttribute("aria-checked", "true")
  },
}

export const Disabled: Story = {
  args: {
    label: "Auto-compound rewards",
    disabled: true,
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Auto-compound rewards" })
    // Base UI renders a span with aria-disabled (no native disabled attr).
    await expect(box).toHaveAttribute("aria-disabled", "true")
    await expect(box).toHaveAttribute("data-disabled")
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "false")
  },
}

export const DisabledChecked: Story = {
  args: {
    label: "Locked vault",
    defaultChecked: true,
    disabled: true,
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Locked vault" })
    await expect(box).toHaveAttribute("aria-checked", "true")
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "true")
  },
}

export const WithDescription: Story = {
  args: {
    label: "Auto-compound rewards",
    description: "Harvested rewards are restaked automatically every hour.",
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Auto-compound rewards" })
    await expect(
      canvas.getByText("Harvested rewards are restaked automatically every hour.")
    ).toBeInTheDocument()
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "true")
  },
}

export const BoxOnly: Story = {
  args: {
    ariaLabel: "Accept terms",
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Accept terms" })
    await box.click()
    await expect(box).toHaveAttribute("aria-checked", "true")
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" defaultChecked disabled />
      <Checkbox
        label="With description"
        description="Helper caption in tertiary text."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getAllByRole("checkbox")).toHaveLength(6)
    })
    await expect(
      canvas.getByRole("checkbox", { name: "Indeterminate" })
    ).toHaveAttribute("aria-checked", "mixed")
  },
}

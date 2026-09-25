import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { RadioGroup, type RadioOption } from "./RadioGroup"

/**
 * Eque Radio Group (TASKS.md 1.5, DESIGN.md §7.2) — single-select.
 * 16px circles (the permitted round exception, so single-select reads
 * differently from the square checkbox); selected fills `primary` with
 * an `on-primary` dot. Rows reuse the checkbox geometry.
 */
const meta = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
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
    value: {
      control: "text",
      description: "Controlled selection (option value)",
    },
    defaultValue: {
      control: "text",
      description: "Uncontrolled initial selection",
    },
    disabled: {
      control: "boolean",
      description: "Disables the whole group",
      table: { defaultValue: { summary: "false" } },
    },
    label: {
      control: "text",
      description: "Group label above the options",
    },
    options: {
      description: "Options ({ value, label, description?, disabled? })",
      table: { disable: true },
    },
    onValueChange: {
      action: "value changed",
      description: "Fires with the next value on select",
      table: { disable: true },
    },
  },
  args: {
    onValueChange: undefined,
    options: [
      { value: "auto", label: "Auto-compound" },
      { value: "manual", label: "Manual harvest" },
    ],
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const harvestOptions: RadioOption[] = [
  { value: "auto", label: "Auto-compound" },
  { value: "manual", label: "Manual harvest" },
  { value: "disabled-opt", label: "Disabled option", disabled: true },
]

export const Default: Story = {
  args: {
    label: "Reward strategy",
    options: harvestOptions,
  },
  play: async ({ canvas }) => {
    const auto = canvas.getByRole("radio", { name: "Auto-compound" })
    const manual = canvas.getByRole("radio", { name: "Manual harvest" })
    await expect(auto).toHaveAttribute("aria-checked", "false")
    await manual.click()
    await expect(manual).toHaveAttribute("aria-checked", "true")
    await expect(auto).toHaveAttribute("aria-checked", "false")
  },
}

export const Preselected: Story = {
  args: {
    label: "Reward strategy",
    options: harvestOptions,
    defaultValue: "manual",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("radio", { name: "Manual harvest" })
    ).toHaveAttribute("aria-checked", "true")
  },
}

export const KeyboardArrows: Story = {
  args: {
    label: "Reward strategy",
    options: harvestOptions.slice(0, 2),
  },
  play: async ({ canvas }) => {
    const auto = canvas.getByRole("radio", { name: "Auto-compound" })
    auto.focus()
    await expect(auto).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    const manual = canvas.getByRole("radio", { name: "Manual harvest" })
    await expect(manual).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard("{ArrowUp}")
    await expect(auto).toHaveAttribute("aria-checked", "true")
  },
}

export const WithDisabledOption: Story = {
  args: {
    label: "Reward strategy",
    options: harvestOptions,
  },
  play: async ({ canvas }) => {
    const blocked = canvas.getByRole("radio", { name: "Disabled option" })
    await expect(blocked).toHaveAttribute("aria-disabled", "true")
    await blocked.click()
    await expect(blocked).toHaveAttribute("aria-checked", "false")
  },
}

export const DisabledGroup: Story = {
  args: {
    label: "Reward strategy",
    options: harvestOptions.slice(0, 2),
    defaultValue: "auto",
    disabled: true,
  },
  play: async ({ canvas }) => {
    const auto = canvas.getByRole("radio", { name: "Auto-compound" })
    const manual = canvas.getByRole("radio", { name: "Manual harvest" })
    await expect(auto).toHaveAttribute("aria-checked", "true")
    await manual.click()
    await expect(manual).toHaveAttribute("aria-checked", "false")
    await expect(auto).toHaveAttribute("aria-checked", "true")
  },
}

export const WithDescriptions: Story = {
  args: {
    label: "Reward strategy",
    options: [
      {
        value: "auto",
        label: "Auto-compound",
        description: "Restaked automatically every hour.",
      },
      {
        value: "manual",
        label: "Manual harvest",
        description: "Claim rewards yourself, pay gas per claim.",
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Restaked automatically every hour.")
    ).toBeInTheDocument()
    const manual = canvas.getByRole("radio", { name: "Manual harvest" })
    await manual.click()
    await expect(manual).toHaveAttribute("aria-checked", "true")
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup
        label="Unselected"
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
      <RadioGroup
        label="Selected"
        defaultValue="a"
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
      <RadioGroup
        label="Disabled"
        disabled
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getAllByRole("radio")).toHaveLength(6)
    })
    const groups = canvas.getAllByRole("radiogroup")
    await expect(groups).toHaveLength(3)
  },
}

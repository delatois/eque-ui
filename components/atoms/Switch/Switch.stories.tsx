import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { Switch } from "./Switch"

/**
 * Eque Switch (TASKS.md 1.6, DESIGN.md §7.2) — 36×20 sharp track with
 * a square thumb. Settings-row layout: label left, control right.
 */
const meta = {
  title: "Atoms/Switch",
  component: Switch,
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
      description: "Controlled state",
    },
    defaultChecked: {
      control: "boolean",
      description: "Uncontrolled initial state",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: { defaultValue: { summary: "false" } },
    },
    label: {
      control: "text",
      description: "Label left of the control",
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
    label: "Auto-compound rewards",
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Auto-compound rewards" })
    await expect(control).toHaveAttribute("aria-checked", "false")
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "true")
  },
}

export const On: Story = {
  args: {
    defaultChecked: true,
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Auto-compound rewards" })
    await expect(control).toHaveAttribute("aria-checked", "true")
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "false")
  },
}

export const KeyboardToggle: Story = {
  args: {
    label: "Confirm deposit",
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Confirm deposit" })
    control.focus()
    await expect(control).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(control).toHaveAttribute("aria-checked", "true")
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Auto-compound rewards" })
    await expect(control).toHaveAttribute("aria-disabled", "true")
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "false")
  },
}

export const DisabledOn: Story = {
  args: {
    label: "Locked vault",
    defaultChecked: true,
    disabled: true,
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Locked vault" })
    await expect(control).toHaveAttribute("aria-checked", "true")
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "true")
  },
}

export const WithDescription: Story = {
  args: {
    description: "Harvested rewards are restaked automatically every hour.",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Harvested rewards are restaked automatically every hour.")
    ).toBeInTheDocument()
    const control = canvas.getByRole("switch", { name: "Auto-compound rewards" })
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "true")
  },
}

export const ControlOnly: Story = {
  args: {
    label: undefined,
    ariaLabel: "Enable notifications",
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Enable notifications" })
    await control.click()
    await expect(control).toHaveAttribute("aria-checked", "true")
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled on" defaultChecked disabled />
      <Switch
        label="With description"
        description="Helper caption in tertiary text."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getAllByRole("switch")).toHaveLength(5)
    })
  },
}

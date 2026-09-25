import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowUpRight, Plus } from "lucide-react"
import { expect, fn, userEvent } from "storybook/test"
import { Button } from "./Button"

/**
 * Eque Button (TASKS.md 1.1, DESIGN.md §7.1) — the single clickable action
 * element for the whole kit. Labels are verbs in Spline Sans Mono; one
 * `primary` button per section. `danger` must be paired with a confirmation
 * step, and `icon` buttons must always carry an `aria-label`.
 */
const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "danger", "icon"],
      description: "Visual style variant",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Button height: sm 32px · md 44px · lg 56px",
      table: { defaultValue: { summary: "md" } },
    },
    loading: {
      control: "boolean",
      description: "Pending state: spinner + disabled + aria-busy",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: { defaultValue: { summary: "false" } },
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
      table: { disable: true },
    },
  },
  args: {
    children: "Deposit",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole("button", { name: "Deposit" })
    await expect(button).toBeEnabled()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Approve",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Approve" })
    ).toBeEnabled()
  },
}

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Cancel",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeEnabled()
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Revoke access",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Destructive actions always require a confirmation step (e.g. Confirmation Dialog 2.15) before firing — never wire this directly to the action.",
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Revoke access" })
    ).toBeEnabled()
  },
}

export const IconOnly: Story = {
  args: {
    variant: "icon",
    "aria-label": "Add vault",
    children: <Plus />,
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole("button", { name: "Add vault" })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Deposit</Button>
      <Button size="md">Deposit</Button>
      <Button size="lg">Deposit</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button", { name: "Deposit" })).toHaveLength(3)
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: "Depositing…",
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Depositing…" })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute("aria-busy", "true")
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Deposit" })).toBeDisabled()
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary">
        <Plus />
        New vault
      </Button>
      <Button>
        View strategy
        <ArrowUpRight />
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "New vault" })
    ).toBeEnabled()
    await expect(
      canvas.getByRole("button", { name: "View strategy" })
    ).toBeEnabled()
  },
}

/** Realistic usage: an approve → deposit action row with a tertiary escape hatch. */
export const ActionsRow: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary">Approve</Button>
      <Button onClick={args.onClick}>Deposit</Button>
      <Button variant="tertiary">Cancel</Button>
    </div>
  ),
  args: {
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Deposit" }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
    await expect(canvas.getByRole("button", { name: "Approve" })).toBeEnabled()
    await expect(canvas.getByRole("button", { name: "Cancel" })).toBeEnabled()
  },
}

/** Full variant × size matrix for visual QA (5 variants × 3 sizes). */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["primary", "secondary", "tertiary", "danger"] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            <Button variant={variant} size="sm">
              {variant}
            </Button>
            <Button variant={variant} size="md">
              {variant}
            </Button>
            <Button variant={variant} size="lg">
              {variant}
            </Button>
          </div>
        )
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="icon" size="sm" aria-label="Add vault small">
          <Plus />
        </Button>
        <Button variant="icon" size="md" aria-label="Add vault medium">
          <Plus />
        </Button>
        <Button variant="icon" size="lg" aria-label="Add vault large">
          <Plus />
        </Button>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button")).toHaveLength(15)
  },
}

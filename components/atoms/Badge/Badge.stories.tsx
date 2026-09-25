import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { Badge } from "./Badge"

/**
 * Eque Badge/Tag (TASKS.md 1.7, DESIGN.md §7.5) — 24px sharp chip in
 * Mono 11px uppercase. Neutral and brand cover metadata; status
 * variants (success/warning/info/error/danger) use the §2.6 tint bg +
 * tint border + 300 text. Removable badges render a close button and
 * the parent owns removal.
 */
const meta = {
  title: "Atoms/Badge",
  component: Badge,
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
    variant: {
      control: "select",
      options: [
        "neutral",
        "brand",
        "success",
        "warning",
        "info",
        "error",
        "danger",
      ],
      description: "Visual variant",
      table: { defaultValue: { summary: "neutral" } },
    },
    children: {
      control: "text",
      description: "Badge text (uppercased by CSS)",
    },
    removeLabel: {
      control: "text",
      description: "Accessible name for the close button",
      table: { defaultValue: { summary: "Remove" } },
    },
    onRemove: {
      action: "removed",
      description:
        "When provided, a close button renders; the parent owns removal",
      table: { disable: true },
    },
  },
  args: {
    onRemove: undefined,
    children: "Arbitrum",
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Arbitrum")).toBeInTheDocument()
  },
}

export const Brand: Story = {
  args: {
    variant: "brand",
    children: "Boosted",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Boosted")).toBeInTheDocument()
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="brand">Brand</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const label of [
      "Neutral",
      "Brand",
      "Success",
      "Warning",
      "Info",
      "Error",
      "Danger",
    ]) {
      await expect(canvas.getByText(label)).toBeInTheDocument()
    }
  },
}

export const StatusSet: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Audited</Badge>
      <Badge variant="warning">Expiring</Badge>
      <Badge variant="info">New</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="danger">Deprecated</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Deprecated")).toBeInTheDocument()
  },
}

function RemovableDemo({ onRemove }: { onRemove?: () => void }) {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return <p className="font-body text-sm text-text-tertiary">Removed</p>
  return (
    <Badge
      variant="brand"
      onRemove={() => {
        setVisible(false)
        onRemove?.()
      }}
    >
      Arbitrum
    </Badge>
  )
}

export const Removable: Story = {
  render: (args) => <RemovableDemo onRemove={args.onRemove} />,
  play: async ({ canvas, userEvent: userEventFromContext }) => {
    const user = userEventFromContext ?? userEvent
    const close = canvas.getByRole("button", { name: "Remove Arbitrum" })
    await close.click()
    await waitFor(() => {
      expect(canvas.getByText("Removed")).toBeInTheDocument()
    })
    await expect(user).toBeDefined()
  },
}

export const RemovableKeyboard: Story = {
  render: () => <RemovableDemo />,
  play: async ({ canvas }) => {
    const close = canvas.getByRole("button", { name: "Remove Arbitrum" })
    close.focus()
    await expect(close).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => {
      expect(canvas.getByText("Removed")).toBeInTheDocument()
    })
  },
}

export const FilterChips: Story = {
  render: function FilterChipsRender() {
    const [filters, setFilters] = React.useState([
      "Arbitrum",
      "Low risk",
      "Active",
    ])
    if (filters.length === 0) {
      return (
        <p className="font-body text-sm text-text-tertiary">
          No filters — vault list is unfiltered.
        </p>
      )
    }
    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge
            key={filter}
            variant="neutral"
            onRemove={() =>
              setFilters((prev) => prev.filter((f) => f !== filter))
            }
          >
            {filter}
          </Badge>
        ))}
      </div>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Low risk")).toBeInTheDocument()
    await canvas.getByRole("button", { name: "Remove Low risk" }).click()
    await waitFor(() => {
      expect(canvas.queryByText("Low risk")).not.toBeInTheDocument()
    })
    await expect(canvas.getByText("Arbitrum")).toBeInTheDocument()
  },
}

export const VaultBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="brand">12.40% APY</Badge>
        <Badge variant="success">Audited</Badge>
        <Badge variant="warning">Medium risk</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">USDC</Badge>
        <Badge variant="danger">Deprecated</Badge>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("12.40% APY")).toBeInTheDocument()
    await expect(canvas.getByText("Deprecated")).toBeInTheDocument()
  },
}

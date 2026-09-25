import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { expect, fn, screen, userEvent, within } from "storybook/test"
import { Pagination } from "./Pagination"

/**
 * Eque Pagination (2.16) — controlled page numbers with prev/next,
 * ellipsis, disabled edge states, and a compact mobile variant.
 */
const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    pageCount: { control: { type: "number", min: 1 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    compact: { control: "boolean" },
    onPageChange: { action: "pageChange" },
  },
  args: {
    page: 5,
    pageCount: 12,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function Interactive(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.page)
  return (
    <Pagination
      {...args}
      page={page}
      onPageChange={(p) => {
        args.onPageChange?.(p)
        setPage(p)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <Interactive {...args} />,
  play: async ({ args }) => {
    // Current page carries aria-current; ellipsis collapses the range.
    await expect(
      screen.getByRole("link", { current: "page" })
    ).toHaveTextContent("5")
    await expect(screen.getAllByText("More pages").length).toBeGreaterThan(0)
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const GoToPage: Story = {
  render: (args) => <Interactive {...args} />,
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole("link", { name: "7" }))
    await expect(args.onPageChange).toHaveBeenCalledWith(7)
    await expect(screen.getByRole("link", { current: "page" })).toHaveTextContent(
      "7"
    )
  },
}

export const FirstPageEdge: Story = {
  args: { page: 1, pageCount: 8 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const prev = canvas.getByRole("link", { name: "Go to previous page" })
    await expect(prev).toHaveAttribute("aria-disabled", "true")
    // Window touches page 1: pages 1, 2, then one trailing ellipsis.
    await expect(canvas.getByRole("link", { name: "2" })).toBeVisible()
    await expect(canvas.getAllByText("More pages")).toHaveLength(1)
  },
}

export const LastPageEdge: Story = {
  args: { page: 8, pageCount: 8 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole("link", { name: "Go to next page" })
    await expect(next).toHaveAttribute("aria-disabled", "true")
  },
}

export const Compact: Story = {
  args: { page: 3, pageCount: 12, compact: true, onPageChange: fn() },
  render: (args) => <Interactive {...args} />,
  play: async ({ args }) => {
    await expect(screen.getByText("Page 3 of 12")).toBeVisible()
    await userEvent.click(screen.getByRole("button", { name: "Go to next page" }))
    await expect(args.onPageChange).toHaveBeenCalledWith(4)
  },
}

export const CompactFirstPage: Story = {
  args: { page: 1, pageCount: 4, compact: true },
  play: async () => {
    await expect(
      screen.getByRole("button", { name: "Go to previous page" })
    ).toBeDisabled()
  },
}

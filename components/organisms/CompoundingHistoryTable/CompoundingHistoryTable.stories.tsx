import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, within } from "storybook/test"
import { CompoundingHistoryTable } from "./CompoundingHistoryTable"
import { mockCompoundEvents } from "@/lib/mock-data/history"

/**
 * Compounding History Table (5.4) — auto-compound events with date,
 * amount compounded, resulting balance, and a tx hash chip; paginates
 * when the list exceeds `pageSize`.
 */
const meta = {
  title: "Organisms/CompoundingHistoryTable",
  component: CompoundingHistoryTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number" },
    loading: { control: "boolean" },
  },
  args: {
    events: mockCompoundEvents,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompoundingHistoryTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Compounding history")).toBeVisible()
    await expect(canvas.getByText("Amount compounded")).toBeVisible()
    // 12 events at pageSize 8 → compact pagination shows.
    await expect(canvas.getByText("Page 1 of 2")).toBeVisible()
    const next = canvas.getByRole("button", { name: /next/i })
    await userEvent.click(next)
    await expect(canvas.getByText("Page 2 of 2")).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText("Loading history")).toBeVisible()
  },
}

export const Empty: Story = {
  args: { events: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("No compounding events yet")).toBeVisible()
  },
}

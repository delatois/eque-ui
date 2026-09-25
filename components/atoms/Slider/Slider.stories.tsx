import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { Slider } from "./Slider"

/**
 * Eque Slider (1.14) — single, range, and multi-thumb selection for
 * DeFi controls (allocation %, slippage, leverage, rebalance bands).
 * Sharp square thumbs (12/16/20px) with a 2px `primary` border on the
 * track language shared with the progress bar. Keyboard operates the
 * nested native range inputs (arrows/Home/End); every thumb has its
 * own accessible name.
 */
const meta = {
  title: "Atoms/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex w-[480px] max-w-[90vw] flex-col justify-center py-16">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Thumb size (12 / 16 / 20px squares)",
      table: { defaultValue: { summary: "md" } },
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Slider orientation",
      table: { defaultValue: { summary: "horizontal" } },
    },
    min: {
      control: "number",
      description: "Minimum value",
      table: { defaultValue: { summary: "0" } },
    },
    max: {
      control: "number",
      description: "Maximum value",
      table: { defaultValue: { summary: "100" } },
    },
    step: {
      control: "number",
      description: "Keyboard/pointer step increment",
      table: { defaultValue: { summary: "1" } },
    },
    disabled: {
      control: "boolean",
      description: "Ignore all interaction",
      table: { defaultValue: { summary: "false" } },
    },
    label: {
      control: "text",
      description: "Visible caption above the slider",
    },
    showValue: {
      control: "boolean",
      description: "Render the current value(s) beside the label",
      table: { defaultValue: { summary: "false" } },
    },
    value: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
    thumbLabels: {
      table: { disable: true },
    },
    formatValue: {
      table: { disable: true },
    },
    onValueChange: {
      table: { disable: true },
    },
  },
  args: {
    size: "md",
    orientation: "horizontal",
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showValue: false,
    defaultValue: [50],
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Value" })
    await expect(thumb).toHaveAttribute("aria-valuenow", "50")
    thumb.focus()
    await expect(thumb).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => {
      expect(thumb).toHaveAttribute("aria-valuenow", "51")
    })
    await userEvent.keyboard("{Home}")
    await waitFor(() => {
      expect(thumb).toHaveAttribute("aria-valuenow", "0")
    })
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [allocation, setAllocation] = React.useState([65])
    return (
      <Slider
        {...args}
        aria-label="USDC allocation"
        label="USDC allocation"
        showValue
        formatValue={(v) => `${v}%`}
        value={allocation}
        onValueChange={(v) => setAllocation(Array.isArray(v) ? [...v] : [v])}
      />
    )
  },
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Value" })
    await expect(canvas.getByText("65%")).toBeInTheDocument()
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => {
      expect(canvas.getByText("66%")).toBeInTheDocument()
    })
    await expect(thumb).toHaveAttribute("aria-valuenow", "66")
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    thumbLabels: ["Minimum", "Maximum"],
    label: "Rebalance band",
    showValue: true,
    formatValue: (v) => `${v}%`,
  },
  play: async ({ canvas }) => {
    const min = canvas.getByRole("slider", { name: "Minimum" })
    const max = canvas.getByRole("slider", { name: "Maximum" })
    await expect(min).toHaveAttribute("aria-valuenow", "25")
    await expect(max).toHaveAttribute("aria-valuenow", "75")
    await expect(canvas.getByText("25% – 75%")).toBeInTheDocument()
    max.focus()
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => {
      expect(max).toHaveAttribute("aria-valuenow", "74")
    })
  },
}

export const MultiThumb: Story = {
  args: {
    defaultValue: [20, 50, 80],
    label: "Strategy bands",
    showValue: true,
    formatValue: (v) => `${v}%`,
  },
  play: async ({ canvas }) => {
    const thumbs = canvas.getAllByRole("slider")
    await expect(thumbs.length).toBe(3)
    await expect(thumbs[0]).toHaveAccessibleName("Value 1")
    await expect(thumbs[1]).toHaveAttribute("aria-valuenow", "50")
    await expect(thumbs[2]).toHaveAccessibleName("Value 3")
  },
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultValue: [30],
    label: "Lock weight",
    showValue: true,
    formatValue: (v) => `${v}%`,
  },
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Value" })
    await expect(thumb).toHaveAttribute("aria-orientation", "vertical")
    await expect(thumb).toHaveAttribute("aria-valuenow", "30")
    thumb.focus()
    await userEvent.keyboard("{ArrowUp}")
    await waitFor(() => {
      expect(thumb).toHaveAttribute("aria-valuenow", "31")
    })
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Slider aria-label="Small slider" size="sm" defaultValue={[40]} thumbLabels={["Small"]} />
      <Slider aria-label="Medium slider" size="md" defaultValue={[40]} thumbLabels={["Medium"]} />
      <Slider aria-label="Large slider" size="lg" defaultValue={[40]} thumbLabels={["Large"]} />
    </div>
  ),
  play: async ({ canvas }) => {
    const sm = canvas
      .getByRole("slider", { name: "Small" })
      .closest('[data-slot="slider-thumb"]') as HTMLElement
    const md = canvas
      .getByRole("slider", { name: "Medium" })
      .closest('[data-slot="slider-thumb"]') as HTMLElement
    const lg = canvas
      .getByRole("slider", { name: "Large" })
      .closest('[data-slot="slider-thumb"]') as HTMLElement
    await expect(sm.getBoundingClientRect().width).toBe(12)
    await expect(md.getBoundingClientRect().width).toBe(16)
    await expect(lg.getBoundingClientRect().width).toBe(20)
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: [40],
    label: "Locked allocation",
    showValue: true,
    formatValue: (v) => `${v}%`,
  },
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Value" })
    await expect(thumb).toBeDisabled()
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(thumb).toHaveAttribute("aria-valuenow", "40")
  },
}

export const SlippageTolerance: Story = {
  render: () => {
    const presets = [0.1, 0.5, 1.0]
    const [slippage, setSlippage] = React.useState([0.5])
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSlippage([preset])}
              aria-pressed={slippage[0] === preset}
              className="cursor-pointer border border-border-default bg-transparent px-3 font-heading text-xs text-text-secondary transition-colors duration-micro ease-eque hover:border-border-strong hover:text-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary focus-visible:outline-offset-2 aria-pressed:border-primary-a32 aria-pressed:bg-primary-a08 aria-pressed:text-primary"
              style={{ height: 32 }}
            >
              {preset.toFixed(1)}%
            </button>
          ))}
        </div>
        <Slider
          aria-label="Slippage tolerance"
          label="Slippage tolerance"
          showValue
          formatValue={(v) => `${v.toFixed(1)}%`}
          min={0}
          max={5}
          step={0.1}
          value={slippage}
          onValueChange={(v) => setSlippage(Array.isArray(v) ? [...v] : [v])}
        />
      </div>
    )
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("0.5%", { selector: "span" })
    ).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "1.0%" }))
    await waitFor(() => {
      expect(canvas.getByText("1.0%", { selector: "span" })).toBeInTheDocument()
    })
    const thumb = canvas.getByRole("slider", { name: "Value" })
    await expect(thumb).toHaveAttribute("aria-valuenow", "1")
  },
}

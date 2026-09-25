import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"
import { Input } from "./Input"
import { Button } from "../Button/Button"

/**
 * Eque Input (TASKS.md 1.2, DESIGN.md §7.2) — text and decimal-amount entry.
 * 44px height, `rounded-sm`, surface bg with hairline border; labels sit
 * above the field, messages below. The `number` variant strips non-numeric
 * input and caps fraction digits via `decimals` (no native spinners).
 */
const meta = {
  title: "Atoms/Input",
  component: Input,
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
    variant: {
      control: "select",
      options: ["text", "number"],
      description: "Text entry or decimal amount entry with sanitization",
      table: { defaultValue: { summary: "text" } },
    },
    decimals: {
      control: { type: "number", min: 0, max: 18, step: 1 },
      description: "Max fraction digits (number variant only)",
      table: { defaultValue: { summary: "unlimited" } },
    },
    label: {
      control: "text",
      description: "Label rendered above the field",
    },
    helperText: {
      control: "text",
      description: "Helper caption (hidden when a message is shown)",
    },
    error: {
      control: "text",
      description: "Error message; puts the field in the error state",
    },
    success: {
      control: "boolean",
      description: "Success state; show only after validation",
      table: { defaultValue: { summary: "false" } },
    },
    successMessage: {
      control: "text",
      description: "Success caption (requires success)",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
      table: { defaultValue: { summary: "false" } },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    onChange: {
      action: "changed",
      description: "Change handler (receives sanitized value for number)",
      table: { disable: true },
    },
  },
  args: {
    placeholder: "0.00",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Amount",
    onChange: fn(),
  },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole("textbox", { name: "Amount" })
    await userEvent.click(input)
    await userEvent.type(input, "hello")
    await expect(input).toHaveValue("hello")
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const NumberAmount: Story = {
  args: {
    variant: "number",
    decimals: 2,
    label: "Deposit amount",
    placeholder: "0.00",
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Amount entry: letters are stripped, only one decimal point survives, and the fraction is capped at `decimals` (2 here, e.g. USDC). Typing `12.3456abc` lands on `12.34`.",
      },
    },
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Deposit amount" })
    await userEvent.click(input)
    await userEvent.type(input, "12.3456abc")
    await expect(input).toHaveValue("12.34")
  },
}

export const LabelAndHelper: Story = {
  args: {
    label: "Slippage tolerance",
    helperText: "Maximum price movement you accept, in percent.",
    placeholder: "0.5",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: "Slippage tolerance" })
    ).toBeEnabled()
    await expect(
      canvas.getByText("Maximum price movement you accept, in percent.")
    ).toBeInTheDocument()
  },
}

export const Error: Story = {
  args: {
    label: "Amount",
    defaultValue: "999999",
    error: "Insufficient balance — you have 1,250.00 USDC available.",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Amount" })
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(
      canvas.getByRole("alert")
    ).toHaveTextContent("Insufficient balance")
  },
}

export const Success: Story = {
  args: {
    label: "Amount",
    defaultValue: "250.00",
    success: true,
    successMessage: "Amount is within your available balance.",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Amount is within your available balance.")
    ).toBeInTheDocument()
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: {
    label: "Amount",
    defaultValue: "100.00",
    disabled: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Amount" })
    await expect(input).toBeDisabled()
    await userEvent.type(input, "999")
    await expect(input).toHaveValue("100.00")
  },
}

export const FocusState: Story = {
  args: {
    label: "Amount",
    placeholder: "Click to focus",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus treatment per DESIGN §7.2: border flips to `primary` with the halo shadow (replacing the global focus outline, so no doubled ring).",
      },
    },
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Amount" })
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    // Border/background transition on a 120ms micro token — let it settle
    // before reading the computed end state.
    await new Promise((r) => setTimeout(r, 250))
    const cs = getComputedStyle(input)
    await expect(cs.borderColor).toBe("rgb(31, 255, 195)")
    await expect(cs.boxShadow).toContain("rgba(31, 255, 195, 0.16)")
  },
}

/** Realistic usage: a controlled deposit-amount field with validation. */
export const ValidationForm: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    const [error, setError] = React.useState<string | undefined>(undefined)
    const [success, setSuccess] = React.useState(false)

    const submit = () => {
      const amount = Number(value)
      if (value.trim() === "") {
        setError("Enter an amount to continue.")
        setSuccess(false)
      } else if (!Number.isFinite(amount) || amount <= 0) {
        setError("Amount must be greater than zero.")
        setSuccess(false)
      } else {
        setError(undefined)
        setSuccess(true)
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <Input
          label="Deposit amount"
          variant="number"
          decimals={6}
          placeholder="0.00"
          helperText="Available: 1,250.00 USDC"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(undefined)
            setSuccess(false)
          }}
          error={error}
          success={success}
          successMessage="Ready to deposit."
        />
        <Button onClick={submit}>Review deposit</Button>
      </div>
    )
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Deposit amount" })
    await userEvent.click(canvas.getByRole("button", { name: "Review deposit" }))
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Enter an amount to continue."
    )
    await userEvent.type(input, "25abc")
    await expect(input).toHaveValue("25")
    await userEvent.click(canvas.getByRole("button", { name: "Review deposit" }))
    await expect(canvas.getByText("Ready to deposit.")).toBeInTheDocument()
  },
}

/** All field states side by side for visual QA. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input label="Default" placeholder="0.00" />
      <Input label="Filled" defaultValue="1,250.00" />
      <Input label="Disabled" defaultValue="100.00" disabled />
      <Input label="Error" defaultValue="999999" error="Insufficient balance." />
      <Input
        label="Success"
        defaultValue="250.00"
        success
        successMessage="Ready to deposit."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("textbox")).toHaveLength(5)
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Insufficient balance."
    )
  },
}

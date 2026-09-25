import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"
import { Select, type SelectOption } from "./Select"
import { getMockChains } from "@/lib/mock-data/chains"
import mockupIcon from "@/assets/example-mockup.png"
import type { StaticImageData } from "next/image"

/**
 * Mock network/token/avatar placeholder (user-supplied
 * `assets/example-mockup.png`). Next image imports resolve to
 * `{ src, … }` while Vite resolves to a URL string — normalize to a
 * plain URL for the `<img>`.
 */
const mockupIconSrc: string =
  typeof (mockupIcon as unknown) === "string"
    ? (mockupIcon as unknown as string)
    : (mockupIcon as StaticImageData).src

/**
 * Eque Select (TASKS.md 1.3, DESIGN.md §7.2) — single-select dropdown.
 * The trigger shares the input atom's 44px / `rounded-sm` / surface
 * treatment; the popup floats on deep-teal `primary-dark` with a neon
 * `primary` outline, pixel shadow, Mono item type, `hover-overlay` row
 * highlight, and a tinted + checked selected row.
 */
const meta = {
  title: "Atoms/Select",
  component: Select,
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
    placeholder: {
      control: "text",
      description: "Placeholder shown before a value is chosen",
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
      description: "Error message; puts the trigger in the error state",
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
    options: {
      description: "Popup rows ({ value, label, disabled })",
      table: { disable: true },
    },
    onValueChange: {
      action: "value changed",
      description: "Fires with the selected option value",
      table: { disable: true },
    },
  },
  args: {
    onValueChange: undefined,
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Network options from mock chains, each with the mock network icon. */
const networkOptions: SelectOption[] = getMockChains().map((chain) => ({
  value: String(chain.id),
  label: (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- local mock placeholder, not a production asset */}
      <img
        src={mockupIconSrc}
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        className="size-5 shrink-0"
      />
      {chain.name}
    </span>
  ),
}))

export const Default: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
    helperText: "Where your deposit will land.",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toHaveTextContent("Select network")
  },
}

export const PreselectedValue: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    defaultValue: "42161",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveTextContent("Arbitrum")
  },
}

export const FocusState: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    // Border/background transition on the 120ms micro token — let it settle
    // before reading the computed end state.
    await new Promise((r) => setTimeout(r, 250))
    const cs = getComputedStyle(trigger)
    await expect(cs.borderColor).toBe("rgb(31, 255, 195)")
    await expect(cs.boxShadow).toContain("rgba(31, 255, 195, 0.16)")
  },
}

export const Open: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await userEvent.click(trigger)
    // Presence, not visibility: the popup opens with a 200ms fade/zoom, and
    // opacity-0 during the animation reads as "not visible".
    const listbox = await screen.findByRole("listbox")
    await expect(listbox).toBeInTheDocument()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    for (const name of ["Ethereum", "Arbitrum", "Optimism", "Base"]) {
      await expect(
        screen.getByRole("option", { name })
      ).toBeInTheDocument()
    }
  },
}

export const SelectsOption: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("option", { name: "Base" }))
    // The popup unmounts after a 200ms close animation — wait it out.
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Base")
  },
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      ...networkOptions.slice(0, 3),
      { value: "99999", label: "Deprecated Chain", disabled: true },
    ],
    label: "Network",
    placeholder: "Select network",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await userEvent.click(trigger)
    const disabledOption = await screen.findByRole("option", {
      name: "Deprecated Chain",
    })
    await expect(disabledOption).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(disabledOption)
    // Disabled rows ignore selection: popup stays open, value stays empty.
    await expect(await screen.findByRole("listbox")).toBeInTheDocument()
    await expect(trigger).toHaveTextContent("Select network")
  },
}

export const Error: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
    error: "Select a network to continue.",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(
      canvas.getByText("Select a network to continue.")
    ).toBeInTheDocument()
    await expect(getComputedStyle(trigger).borderColor).toBe(
      "rgb(255, 107, 107)"
    )
  },
}

export const Success: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    defaultValue: "8453",
    success: true,
    successMessage: "Base supports instant deposits.",
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toHaveTextContent("Base")
    await expect(
      canvas.getByText("Base supports instant deposits.")
    ).toBeInTheDocument()
    await expect(getComputedStyle(trigger).borderColor).toBe(
      "rgb(91, 227, 125)"
    )
  },
}

export const Disabled: Story = {
  args: {
    options: networkOptions,
    label: "Network",
    placeholder: "Select network",
    disabled: true,
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Network" })
    await expect(trigger).toBeDisabled()
  },
}

export const AllStates: Story = {
  args: {
    options: networkOptions,
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <Select
        options={networkOptions}
        label="Default"
        placeholder="Select network"
      />
      <Select
        options={networkOptions}
        label="Filled"
        defaultValue="10"
        placeholder="Select network"
      />
      <Select
        options={networkOptions}
        label="Error"
        placeholder="Select network"
        error="Select a network to continue."
      />
      <Select
        options={networkOptions}
        label="Success"
        defaultValue="8453"
        success
        successMessage="Base supports instant deposits."
      />
      <Select
        options={networkOptions}
        label="Disabled"
        placeholder="Select network"
        disabled
      />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const name of ["Default", "Filled", "Error", "Success", "Disabled"]) {
      await expect(
        canvas.getByRole("combobox", { name })
      ).toBeInTheDocument()
    }
  },
}

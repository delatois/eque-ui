import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"
import { getMockTokens } from "@/lib/mock-data/tokens"
import { TokenAmountInput, TOKEN_ICON_SRC } from "./TokenAmountInput"

const [usdc, , , weth] = getMockTokens()
const superlong = getMockTokens().find((t) => t.symbol === "SUPERLONG")!

/**
 * Eque Token Amount Input (2.3) — amount field (`Input` number
 * variant) beside a token dropdown (`Select` atom whose trigger shows
 * the mock token art + ticker, popup lists the token column),
 * tertiary Max button, available-balance line, USD estimate, and a
 * percentage-of-balance slider two-way synced with the field.
 * Uncontrolled by default; `value`/`onChange` take over when
 * provided. Token selection stays with the parent via
 * `tokens`/`onTokenChange`; validation via `error`. The mock artwork
 * (`assets/example-mockup.png`) is placeholder art, not an icon
 * system — Token Icon stays out of scope (AGENTS.md §1).
 */
const meta = {
  title: "Molecules/TokenAmountInput",
  component: TokenAmountInput,
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
    label: {
      control: "text",
      description: "Field label",
    },
    error: {
      control: "text",
      description: "External validation message",
    },
    disabled: {
      control: "boolean",
      description: "Disables the field, dropdown, Max, and slider",
      table: { defaultValue: { summary: "false" } },
    },
    token: { table: { disable: true } },
    tokens: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onTokenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof TokenAmountInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    token: usdc,
    balance: 1250,
    tokenPriceUsd: 1,
    onChange: fn(),
  },
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByText("Amount")).toBeInTheDocument()
    await expect(
      canvas.getByText("Available 1,250.00 USDC")
    ).toBeInTheDocument()
    // Token dropdown trigger shows the mock art + ticker (Base UI
    // resolves the selected label a beat after mount).
    await expect(
      await canvas.findByRole("combobox", { name: "Token" })
    ).toHaveTextContent("USDC")
    const art = canvasElement.querySelector(
      '[data-slot="token-art"]'
    ) as HTMLElement
    await expect(art.tagName).toBe("IMG")
    await expect(art).toHaveAttribute("aria-hidden", "true")
    await expect(art.getAttribute("src") ?? "").toContain("example-mockup")
    await expect(
      canvas.getByRole("button", { name: "Use max USDC balance" })
    ).toBeInTheDocument()
    await expect(canvas.getByText("≈ $0.00")).toBeInTheDocument()
    // Empty field → slider sits at 0%.
    await expect(canvas.getByText("0%")).toBeInTheDocument()
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}

export const TypeToEstimate: Story = {
  name: "Typing updates the estimate and slider (sanitized)",
  args: {
    token: usdc,
    balance: 1250,
    tokenPriceUsd: 1,
  },
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText("Amount")
    // Letters are stripped and fraction is capped at 6 (USDC) mid-typing.
    await userEvent.type(field, "1.123456789xyz")
    await expect(field).toHaveValue("1.123456")
    await expect(canvas.getByText("≈ $1.12")).toBeInTheDocument()
    // 1.12 of 1,250 rounds to 0% — the slider tracks the field.
    await expect(canvas.getByText("0%")).toBeInTheDocument()
  },
}

export const MaxFillsBalance: Story = {
  name: "Max fills the balance",
  args: {
    token: weth,
    balance: 2.5,
    tokenPriceUsd: 2500,
    onChange: fn(),
  },
  play: async ({ canvas, args }) => {
    // Portaled/conditional nodes can attach a beat after mount under
    // the shared-runner page, so wait instead of asserting synchronously.
    await waitFor(() => {
      expect(
        canvas.getByRole("button", { name: "Use max WETH balance" })
      ).toBeInTheDocument()
    })
    await userEvent.click(
      canvas.getByRole("button", { name: "Use max WETH balance" })
    )
    await expect(canvas.getByLabelText("Amount")).toHaveValue("2.5")
    await expect(canvas.getByText("≈ $6,250.00")).toBeInTheDocument()
    await expect(canvas.getByText("100%")).toBeInTheDocument()
    await expect(args.onChange).toHaveBeenCalledWith("2.5")
  },
}

export const InsufficientBalance: Story = {
  name: "External error state",
  args: {
    token: usdc,
    balance: 1250,
    tokenPriceUsd: 1,
    defaultValue: "2000",
    error: "Insufficient balance",
  },
  play: async ({ canvas }) => {
    // Same assertion shape as the Input atom's own stories: the
    // `name` option doesn't resolve on `role="alert"` in this runner.
    await waitFor(() => {
      expect(canvas.getByRole("alert")).toBeInTheDocument()
    })
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Insufficient balance"
    )
    await expect(canvas.getByLabelText("Amount")).toHaveValue("2000")
  },
}

export const TokenArt: Story = {
  name: "Mock token art in the dropdown trigger",
  args: {
    token: superlong,
    balance: 42,
    tokenPriceUsd: 0.5,
  },
  play: async ({ canvas, canvasElement }) => {
    // Placeholder art (not an icon system): 20px sharp image,
    // decorative, served from the shared mock asset.
    const art = canvasElement.querySelector(
      '[data-slot="token-art"]'
    ) as HTMLElement
    await expect(art.tagName).toBe("IMG")
    await expect(art).toHaveAttribute("width", "20")
    await expect(art).toHaveAttribute("aria-hidden", "true")
    await expect(art.getAttribute("src") ?? "").toContain("example-mockup")
    await expect(TOKEN_ICON_SRC).toContain("example-mockup")
    // Long tickers render in full inside the trigger — no truncation.
    await expect(
      canvas.getByRole("combobox", { name: "Token" })
    ).toHaveTextContent("SUPERLONG")
  },
}

const switcherBalances: Record<string, { balance: number; price: number }> = {
  USDC: { balance: 1250, price: 1 },
  WETH: { balance: 2.5, price: 2500 },
}

export const TokenSwitcher: Story = {
  name: "Token dropdown swaps the column",
  args: {
    token: usdc,
    tokens: [usdc, weth],
    balance: 1250,
    tokenPriceUsd: 1,
    onTokenChange: fn(),
  },
  render: (args) => {
    const [symbol, setSymbol] = React.useState(args.token.symbol)
    const current =
      args.tokens?.find((t) => t.symbol === symbol) ?? args.token
    const { balance, price } = switcherBalances[current.symbol]
    return (
      <TokenAmountInput
        {...args}
        token={current}
        balance={balance}
        tokenPriceUsd={price}
        onTokenChange={(t) => {
          setSymbol(t.symbol)
          args.onTokenChange?.(t)
        }}
      />
    )
  },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole("combobox", { name: "Token" })
    await expect(trigger).toHaveTextContent("USDC")
    await userEvent.click(trigger)
    // The popup is portaled to the body, outside the story canvas.
    const listbox = await screen.findByRole("listbox")
    await expect(listbox).toBeInTheDocument()
    for (const name of ["USDC", "WETH"]) {
      await expect(screen.getByRole("option", { name })).toBeInTheDocument()
    }
    await userEvent.click(screen.getByRole("option", { name: "WETH" }))
    await waitFor(() => {
      expect(
        canvas.getByRole("combobox", { name: "Token" })
      ).toHaveTextContent("WETH")
    })
    await expect(
      canvas.getByText("Available 2.50 WETH")
    ).toBeInTheDocument()
    await expect(args.onTokenChange).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: "WETH" })
    )
  },
}

export const SliderSetsAmount: Story = {
  name: "Percentage slider fills the field",
  args: {
    token: usdc,
    balance: 1250,
    tokenPriceUsd: 1,
    onChange: fn(),
  },
  play: async ({ canvas, args }) => {
    const thumb = canvas.getByRole("slider", { name: "Amount percentage" })
    // Focus first: the Base slider forwards focus before key handling.
    await userEvent.click(thumb)
    await userEvent.keyboard("{End}")
    await expect(canvas.getByLabelText("Amount")).toHaveValue("1250")
    await expect(canvas.getByText("≈ $1,250.00")).toBeInTheDocument()
    await expect(canvas.getByText("100%")).toBeInTheDocument()
    await expect(args.onChange).toHaveBeenCalledWith("1250")
    await userEvent.keyboard("{Home}")
    await expect(canvas.getByLabelText("Amount")).toHaveValue("0")
    await expect(canvas.getByText("0%")).toBeInTheDocument()
  },
}

export const ZeroBalance: Story = {
  name: "Zero balance edge case",
  args: {
    token: usdc,
    balance: 0,
    tokenPriceUsd: 1,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Available 0.00 USDC")).toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole("button", { name: "Use max USDC balance" })
    )
    await expect(canvas.getByLabelText("Amount")).toHaveValue("0")
    // No balance to take a percentage of — the slider is inert.
    await expect(
      canvas.getByRole("slider", { name: "Amount percentage" })
    ).toBeDisabled()
  },
}

export const Disabled: Story = {
  args: {
    token: usdc,
    balance: 1250,
    tokenPriceUsd: 1,
    disabled: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Amount")).toBeDisabled()
    await expect(
      canvas.getByRole("button", { name: "Use max USDC balance" })
    ).toBeDisabled()
    await expect(
      canvas.getByRole("combobox", { name: "Token" })
    ).toBeDisabled()
    await expect(
      canvas.getByRole("slider", { name: "Amount percentage" })
    ).toBeDisabled()
  },
}

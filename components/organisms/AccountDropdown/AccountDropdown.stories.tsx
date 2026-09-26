import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { AccountDropdown } from "./AccountDropdown"

const ADDRESS = "0x4F3a8b2C9d1E5f60718293A4b5C6D7E8F90a1B2c3"

/**
 * Account Dropdown (3.2) — dropdown triggered from a wallet-address
 * chip: truncated address + copy, mock balance, network switcher entry,
 * disconnect. Network shown as a text badge (exclusion rule).
 */
const meta = {
  title: "Organisms/AccountDropdown",
  component: AccountDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSwitchNetwork: { action: "switch-network" },
    onDisconnect: { action: "disconnect" },
  },
  args: {
    address: ADDRESS,
    balance: "12.5842 ETH",
    networkName: "Base Sepolia",
  },
} satisfies Meta<typeof AccountDropdown>

export default meta
type Story = StoryObj<typeof meta>

async function openMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.click(
    canvas.getByRole("button", { name: /Account menu/ })
  )
  return within(await canvas.findByRole("menu"))
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement)
    await expect(menu.getByText("Connected account")).toBeVisible()
    await expect(menu.getByText("12.5842 ETH")).toBeVisible()
    await expect(menu.getByText("Base Sepolia")).toBeVisible()
    await expect(
      menu.getByRole("menuitem", { name: /Switch network/ })
    ).toBeVisible()
    await expect(
      menu.getByRole("menuitem", { name: /Disconnect/ })
    ).toBeVisible()
  },
}

export const SwitchNetwork: Story = {
  args: { onSwitchNetwork: fn() },
  play: async ({ args, canvasElement }) => {
    const menu = await openMenu(canvasElement)
    await userEvent.click(menu.getByRole("menuitem", { name: /Switch network/ }))
    await expect(args.onSwitchNetwork).toHaveBeenCalledTimes(1)
  },
}

export const Disconnect: Story = {
  args: { onDisconnect: fn() },
  play: async ({ args, canvasElement }) => {
    const menu = await openMenu(canvasElement)
    await userEvent.click(menu.getByRole("menuitem", { name: /Disconnect/ }))
    await expect(args.onDisconnect).toHaveBeenCalledTimes(1)
  },
}

export const CopyAddress: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement)
    await userEvent.click(menu.getByRole("button", { name: "Copy full address" }))
    await expect(
      menu.getByRole("button", { name: "Address copied" })
    ).toBeVisible()
  },
}

export const NoBalance: Story = {
  args: { balance: undefined },
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement)
    await expect(menu.queryByText(/Balance/)).not.toBeInTheDocument()
    await expect(
      menu.getByRole("menuitem", { name: /Disconnect/ })
    ).toBeVisible()
  },
}

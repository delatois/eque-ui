"use client"

import * as React from "react"
import { Loader2, Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertBanner } from "@/components/molecules/AlertBanner"
import {
  mockWalletProviders,
  type WalletProvider,
} from "@/lib/mock-data/wallets"
import { cn } from "cn"

export interface WalletConnectModalProps {
  /** Controlled open state. */
  open?: boolean
  /** Fires when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Wallet providers to list. Defaults to mock providers. */
  providers?: WalletProvider[]
  /** Id of the provider currently "connecting" (per-row spinner). */
  connectingId?: string | null
  /** Failed connection — rendered as an error banner. */
  error?: { providerId: string; message: string } | null
  /** Fires when a provider row is clicked. */
  onConnect?: (provider: WalletProvider) => void
  /** Optional trigger element (e.g. a connect button). */
  trigger?: React.ReactNode
  /** Extra classes merged onto the dialog content. */
  className?: string
}

/**
 * Wallet Connect Modal (3.1) — dialog listing wallet providers as plain
 * labeled rows (generic glyph; no provider brand icons per the exclusion
 * rule). Per-row loading spinner while "connecting" and an error banner
 * for a failed mock connection. Presentational: the host drives the
 * async simulation via `connectingId` / `error`.
 */
function WalletConnectModal({
  open,
  onOpenChange,
  providers = mockWalletProviders,
  connectingId = null,
  error = null,
  onConnect,
  trigger,
  className,
}: WalletConnectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {React.isValidElement(trigger) ? (
        <DialogTrigger render={trigger} />
      ) : null}
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>Connect wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Eque. This is a UI demo — no real
            connection is made.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2" role="list">
          {providers.map((provider) => {
            const isConnecting = connectingId === provider.id
            return (
              <button
                key={provider.id}
                type="button"
                role="listitem"
                disabled={connectingId !== null}
                onClick={() => onConnect?.(provider)}
                className={cn(
                  "press-feedback flex w-full cursor-pointer items-center gap-3 rounded-none border border-subtle bg-surface-raised px-4 py-3 text-left transition-colors duration-micro ease-eque outline-none hover:border-border-strong hover:bg-primary-a08 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary disabled:cursor-wait"
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center border border-subtle bg-surface text-text-secondary"
                >
                  <Wallet className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-sm font-medium text-text-primary">
                    {provider.name}
                  </span>
                  <span className="block truncate font-body text-xs text-text-tertiary">
                    {provider.description}
                  </span>
                </span>
                {isConnecting ? (
                  <Loader2
                    aria-label={`Connecting to ${provider.name}`}
                    className="size-4 shrink-0 animate-spin text-primary"
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        {error ? (
          <AlertBanner
            status="error"
            title="Connection failed"
            message={error.message}
          />
        ) : null}

        <p className="font-body text-xs text-text-tertiary">
          By connecting, you agree to the Terms of Use. Eque never has access
          to your private keys.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export { WalletConnectModal }
export type { WalletProvider }

"use client"

import * as React from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/molecules/EmptyState"
import {
  mockTransactions,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from "@/lib/mock-data/transactions"
import { cn } from "cn"

export interface ActivityFeedProps {
  /** Transactions to list. Defaults to mock data. */
  transactions?: Transaction[]
  /** Fires when a row is clicked. Rows become buttons when set. */
  onItemClick?: (tx: Transaction) => void
  /** Empty-state title override. */
  emptyTitle?: string
  /** Empty-state action node (e.g. a "Make a deposit" button). */
  emptyAction?: React.ReactNode
  /** Extra classes merged onto the root. */
  className?: string
}

const TYPE_META: Record<TransactionType, { label: string; glyph: React.ReactNode }> = {
  deposit: {
    label: "Deposit",
    glyph: <ArrowDownToLine aria-hidden="true" className="size-4 text-success" />,
  },
  withdraw: {
    label: "Withdraw",
    glyph: <ArrowUpFromLine aria-hidden="true" className="size-4 text-info" />,
  },
  compound: {
    label: "Compound",
    glyph: <RefreshCw aria-hidden="true" className="size-4 text-primary" />,
  },
  approve: {
    label: "Approve",
    glyph: <ShieldCheck aria-hidden="true" className="size-4 text-text-secondary" />,
  },
}

const STATUS_GLYPH: Record<TransactionStatus, React.ReactNode> = {
  pending: (
    <Loader2 aria-hidden="true" className="size-3.5 animate-spin text-warning" />
  ),
  success: <CheckCircle2 aria-hidden="true" className="size-3.5 text-success" />,
  failed: <XCircle aria-hidden="true" className="size-3.5 text-error" />,
}

const STATUS_LABEL: Record<TransactionStatus, string> = {
  pending: "Pending",
  success: "Confirmed",
  failed: "Failed",
}

function timeAgo(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * Activity Feed (3.6) — list of recent account events from the
 * transactions mock data: type glyph + label, status (glyph + text,
 * never color alone), amount, token text badge, relative timestamp.
 * Empty list renders the EmptyState molecule.
 */
function ActivityFeed({
  transactions = mockTransactions,
  onItemClick,
  emptyTitle = "No activity yet",
  emptyAction,
  className,
}: ActivityFeedProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description="Your deposits, withdrawals, and compounds will show up here."
        action={emptyAction}
        className={className}
      />
    )
  }

  return (
    <ul className={cn("flex flex-col", className)}>
      {transactions.map((tx) => {
        const typeMeta = TYPE_META[tx.type]
        const row = (
          <React.Fragment>
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center border border-subtle bg-surface-raised"
            >
              {typeMeta.glyph}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-2">
                <span className="font-heading text-sm font-medium text-text-primary">
                  {typeMeta.label}
                </span>
                <Badge variant="neutral" className="font-heading">
                  {tx.token.symbol}
                </Badge>
              </span>
              <span className="flex items-center gap-1 font-body text-xs text-text-tertiary">
                {STATUS_GLYPH[tx.status]}
                {STATUS_LABEL[tx.status]} · {timeAgo(tx.timestamp)}
              </span>
            </span>
            <span
              className={cn(
                "shrink-0 font-heading text-sm tabular-nums",
                tx.type === "withdraw" ? "text-text-primary" : "text-primary"
              )}
            >
              {tx.type === "withdraw" ? "−" : "+"}
              {tx.amount.toLocaleString("en-US", {
                maximumFractionDigits: 4,
              })}
            </span>
          </React.Fragment>
        )

        return (
          <li key={tx.id} className="border-b border-subtle last:border-b-0">
            {onItemClick ? (
              <button
                type="button"
                onClick={() => onItemClick(tx)}
                aria-label={`${typeMeta.label} ${tx.amount} ${tx.token.symbol}, ${STATUS_LABEL[tx.status]}`}
                className="press-feedback flex w-full cursor-pointer items-center gap-3 px-2 py-3 text-left outline-none transition-colors duration-micro ease-eque hover:bg-primary-a08 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
              >
                {row}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-2 py-3">{row}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { ActivityFeed }
export type { Transaction }

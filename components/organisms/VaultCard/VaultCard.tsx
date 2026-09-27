"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { Heading, Text } from "@/components/atoms/Typography";
import { ApyPill } from "@/components/molecules/ApyPill";
import { RiskLevelIndicator } from "@/components/molecules/RiskLevelIndicator";

/**
 * Minimal vault shape the card renders. Structural on purpose: mock-data
 * `Vault` objects map onto it 1:1 in stories, but the component never
 * imports mock data itself (registry self-containment).
 */
export interface VaultCardData {
  /** Stable id, used for keys and callbacks. */
  id: string;
  /** Display name, e.g. "USDC Lending Prime". */
  name: string;
  /** Primary deposit token symbol, e.g. "USDC". */
  depositToken: string;
  /** Set for LP vaults — renders as merged pair icons. */
  pairToken?: string;
  /** APY components in percent units (base + reward + boost = total). */
  apyBase: number;
  apyReward: number;
  apyBoost: number;
  /** Total value locked, USD. */
  tvl: number;
  risk: "low" | "medium" | "high";
  /** Drives interactivity only — no status badge is rendered. */
  status: "active" | "deprecated";
  /** Chain display name, e.g. "Arbitrum" (aria-labels; not rendered). */
  chain: string;
  /**
   * Chain glyph rendered as a small dot overlaid on the asset icon's
   * corner — e.g. the letter "A" or a lucide icon.
   */
  chainIcon?: React.ReactNode;
  /** One-line strategy description. */
  strategy: string;
  /** Small glyph rendered next to the strategy line. */
  strategyIcon?: React.ReactNode;
  /** Custom tags, e.g. ["Stocks", "LP Token"] — stacked top-right. */
  tags?: string[];
  audited: boolean;
}

export interface VaultCardProps {
  vault: VaultCardData;
  /**
   * Featured treatment (DESIGN.md §7.3): 32px padding, corner brackets,
   * and the pixel shadow. Reserve for one hero vault per list.
   */
  featured?: boolean;
  /**
   * Makes the card interactive: the vault name becomes a stretched-link
   * button covering the whole card (hover border/bg shift per §7.3).
   * Omit for a static card — only the CTA stays clickable.
   */
  onSelect?: (vault: VaultCardData) => void;
  /** Primary CTA handler. */
  onDeposit?: (vault: VaultCardData) => void;
  /** CTA label for active vaults. */
  depositLabel?: string;
  /** Extra classes merged onto the card (tailwind-merge wins). */
  className?: string;
}

/** Compact USD formatter: 48_250_000 -> "$48.25M". */
function formatTvl(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}

const corner = "pointer-events-none absolute h-5 w-5 border-primary" as const;

/**
 * Square letter tile standing in for a token glyph (token artwork is
 * out of scope for the kit — generic glyphs only).
 */
function AssetTile({ symbol }: { symbol: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center border border-primary-a32 bg-surface-raised font-mono text-sm font-bold text-primary"
    >
      {symbol.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Eque vault card organism (TASKS.md 4.1, DESIGN.md §7.3) — asset
 * icon (merged pair for LP vaults, chain dot overlaid), vault name,
 * strategy line with ecosystem glyph, custom tags, APY pill, TVL,
 * risk indicator, audit chip, and a full-width CTA.
 */
function VaultCard({
  vault,
  featured = false,
  onSelect,
  onDeposit,
  depositLabel = "Deposit",
  className,
}: VaultCardProps) {
  const interactive = typeof onSelect === "function";
  const deprecated = vault.status === "deprecated";

  return (
    <article
      data-slot="vault-card"
      data-featured={featured || undefined}
      className={cn(
        "relative flex flex-col border border-border-subtle bg-surface",
        featured ? "p-8 shadow-pixel" : "p-6",
        interactive &&
          !deprecated &&
          "transition-colors duration-150 hover:border-primary-a40 hover:bg-surface-raised focus-within:border-primary-a40",
        className
      )}
    >
      {featured ? (
        <span aria-hidden="true">
          <span className={cn(corner, "top-0 left-0 border-t-2 border-l-2")} />
          <span className={cn(corner, "top-0 right-0 border-t-2 border-r-2")} />
          <span
            className={cn(corner, "bottom-0 left-0 border-b-2 border-l-2")}
          />
          <span
            className={cn(corner, "right-0 bottom-0 border-b-2 border-r-2")}
          />
        </span>
      ) : null}

      {/* Custom tags, stacked top-right */}
      {vault.tags && vault.tags.length > 0 ? (
        <div className="mb-4 flex flex-col items-end gap-1.5">
          {vault.tags.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* Asset icon + name; chain dot layered on the icon */}
      <div className="flex items-center gap-3">
        <span
          role="img"
          aria-label={
            vault.pairToken
              ? `${vault.depositToken} / ${vault.pairToken} on ${vault.chain}`
              : `${vault.depositToken} on ${vault.chain}`
          }
          className="relative flex shrink-0"
        >
          <AssetTile symbol={vault.depositToken} />
          {vault.pairToken ? (
            <span className="-ml-3">
              <AssetTile symbol={vault.pairToken} />
            </span>
          ) : null}
          {vault.chainIcon ? (
            <span
              aria-hidden="true"
              className="absolute -right-1.5 -bottom-1.5 flex size-4 items-center justify-center border border-surface bg-primary font-mono text-[9px] font-bold text-black"
            >
              {vault.chainIcon}
            </span>
          ) : null}
        </span>
        <Heading as="h4" className="text-xl">
          {interactive && !deprecated ? (
            <button
              type="button"
              onClick={() => onSelect(vault)}
              aria-label={`View ${vault.name}`}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {vault.name}
            </button>
          ) : (
            vault.name
          )}
        </Heading>
      </div>

      {/* Strategy line with ecosystem glyph */}
      <div className="mt-2.5 flex items-center gap-2">
        {vault.strategyIcon ? (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 text-text-tertiary [&_svg]:size-3.5"
          >
            {vault.strategyIcon}
          </span>
        ) : null}
        <Text variant="body-s" className="text-text-secondary">
          {vault.strategy}
        </Text>
      </div>

      {/* APY hero + TVL */}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.08em] text-text-tertiary uppercase">
            APY
          </p>
          <ApyPill
            apyBase={vault.apyBase}
            apyReward={vault.apyReward}
            apyBoost={vault.apyBoost}
            className="mt-1.5"
          />
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] font-medium tracking-[0.08em] text-text-tertiary uppercase">
            TVL
          </p>
          <p className="mt-1.5 font-mono text-xl text-text-primary tabular-nums">
            {formatTvl(vault.tvl)}
          </p>
        </div>
      </div>

      {/* Risk + audit */}
      <div className="mt-4 flex items-center gap-3">
        <RiskLevelIndicator level={vault.risk} />
        {vault.audited ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Audited
          </span>
        ) : null}
      </div>

      <Divider className="my-5" />

      {/* CTA sits above the stretched title link */}
      <div className="relative mt-auto">
        <Button
          variant="primary"
          className="w-full"
          disabled={deprecated}
          onClick={() => onDeposit?.(vault)}
        >
          {deprecated ? "Deprecated" : depositLabel}
        </Button>
      </div>
    </article>
  );
}

export { VaultCard, formatTvl };

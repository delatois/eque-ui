"use client";

import * as React from "react";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { cn } from "cn";
import { Badge, type BadgeVariant } from "@/components/atoms/Badge";
import { Tooltip } from "@/components/atoms/Tooltip";

export type AuditBadgeTone = "positive" | "warning" | "neutral";

export interface AuditBadge {
  /** Badge text, e.g. "Audited by Zellic". */
  label: string;
  /** Tooltip copy explaining the badge; no tooltip when omitted. */
  detail?: string;
  /** Visual tone (default "positive"). */
  tone?: AuditBadgeTone;
}

export interface AuditSecurityBadgeRowProps {
  /** Badges to render in the row. Renders nothing when empty. */
  badges: AuditBadge[];
  /** Accessible label for the row (default "Trust badges"). */
  ariaLabel?: string;
  /** Extra classes merged onto the root (tailwind-merge wins). */
  className?: string;
}

const toneConfig: Record<
  AuditBadgeTone,
  { variant: BadgeVariant; Icon: typeof ShieldCheck }
> = {
  positive: { variant: "success", Icon: ShieldCheck },
  warning: { variant: "warning", Icon: ShieldAlert },
  neutral: { variant: "neutral", Icon: Shield },
};

/**
 * Eque audit/security badge row (TASKS.md 4.6) — a row of trust
 * badges ("Audited by X", "Insured", "Open source") built from the
 * Badge and Tooltip atoms, each with a leading shield glyph and an
 * optional detail tooltip. The unaudited-vault warning variant uses
 * the warning status color.
 */
function AuditSecurityBadgeRow({
  badges,
  ariaLabel = "Trust badges",
  className,
}: AuditSecurityBadgeRowProps) {
  if (badges.length === 0) return null;

  return (
    <div
      data-slot="audit-security-badge-row"
      role="list"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {badges.map((badge) => {
        const { variant, Icon } = toneConfig[badge.tone ?? "positive"];
        const content = (
          <Badge variant={variant} className="gap-1.5">
            <Icon aria-hidden="true" className="size-3.5" />
            {badge.label}
          </Badge>
        );
        return (
          <span key={badge.label} role="listitem">
            {badge.detail ? (
              <Tooltip content={badge.detail}>{content}</Tooltip>
            ) : (
              content
            )}
          </span>
        );
      })}
    </div>
  );
}

export { AuditSecurityBadgeRow };

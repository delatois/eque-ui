# TASKS.md — Eque UI Kit Build Plan

Work through phases in order. Within a phase, tasks may be done in the listed order (later atoms/molecules are often dependencies of earlier organisms). Every task follows the workflow and Definition of Done in `AGENTS.md`. Do not check a box without a matching recap entry in `docs/PROGRESS.md`.

**Excluded from this project entirely:** Token Icon, Network/Chain Icon, Avatar, Dashboard/Portfolio page. See `AGENTS.md` §1 for the required text-based substitution pattern.

---

## Phase 0 — Foundation & Setup

- [x] **0.1 Audit scaffold.** Confirm the existing Next.js + Storybook install works (`dev` and Storybook both start cleanly). Note the exact versions of Next, Tailwind, Storybook, and shadcn in the first `PROGRESS.md` entry.
- [x] **0.2 Tailwind theme tokens.** Extend `tailwind.config.ts` with every token from `DESIGN.md` §12: colors (brand, surfaces, borders, text, status, tint/border variants), `borderRadius` (`none: 0px`, `sm: 0.25rem` — and set the default `DEFAULT` radius to `0px`), `fontFamily` (`heading`, `body`), spacing scale (§4.2), `boxShadow` (pixel-shadow, neon-glow, focus-halo per §5.2), and motion `transitionDuration`/`transitionTimingFunction` (§8).
- [x] **0.3 Fonts.** Load Spline Sans Mono and Google Sans (with the fallback stacks from `DESIGN.md` §3.1) via `next/font` where possible; otherwise via `@font-face`/Google Fonts link in `globals.css`. Wire the resulting CSS variables into `fontFamily.heading` / `fontFamily.body`.
- [x] **0.4 shadcn baseline.** Initialize/verify `components.json`. Set the base radius to `0` in the shadcn theme config so newly added primitives inherit the sharp aesthetic by default, rather than restyling radius on every single component after the fact.
- [x] **0.5 Global styles.** Add the `:root` CSS custom properties from `DESIGN.md` §12 to `globals.css`, plus the `prefers-reduced-motion` reset block and a base `focus-visible` reset.
- [x] **0.6 Storybook global config.** In `.storybook/preview.ts`: force dark canvas background `#070A0F`, load both fonts, register/configure the `a11y` addon, add a 375px mobile viewport to the viewport addon, enable `autodocs` tag globally.
- [x] **0.7 Folder structure.** Create `components/{atoms,molecules,organisms,templates}/`, `lib/mock-data/`, `lib/utils.ts`, `docs/PROGRESS.md` (using the template in `AGENTS.md` §13), and copy `DESIGN.md` into `docs/` if it isn't already there.
- [x] **0.8 Utilities.** Implement `cn()` (clsx + tailwind-merge) and shared formatters in `lib/utils.ts`: currency (`$1,234.56`), percentage (`12.34%`), wallet-address truncation (`0x1234...aBcD`), and tabular number formatting for APY/amount displays.
- [x] **0.9 Mock data module.** Create typed mock data in `lib/mock-data/`:
  - `tokens.ts` — `Token { symbol, name, decimals }`, 8–10 sample tokens including at least one with a long symbol
  - `chains.ts` — `Chain { id, name }`, 3–4 sample chains
  - `vaults.ts` — `Vault { id, name, depositToken, apyBase, apyReward, apyBoost, tvl, risk: 'low'|'medium'|'high', chain, strategy, status: 'active'|'deprecated', audited: boolean }`, at least 8 vaults covering: highest/lowest APY, zero APY, deprecated, unaudited, very long name, very large/very small TVL
  - `transactions.ts` — `Transaction { id, type: 'deposit'|'withdraw'|'compound'|'approve', status: 'pending'|'success'|'failed', amount, token, timestamp, txHash }`, include at least one pending and one failed
- [x] **0.10 Charting dependency.** Add `recharts` (or confirm it's already available via shadcn `chart` block) for use in Phase 5.
- [x] **0.11 Verification.** Run `lint`, `build`, and start Storybook; confirm zero errors before moving to Phase 1. Write the Phase 0 `PROGRESS.md` entry.

---

## Phase 1 — Atoms

Base building blocks. Every atom must expose its variants/sizes/states via Storybook controls.

| # | Component | shadcn base | Variants | States required |
|---|---|---|---|---|
| 1.1 | **Button** | `button` | primary, secondary, tertiary, danger, icon-only; sizes sm/md/lg | default, hover, active, focus-visible, disabled, loading |
| 1.2 | **Input** | `input` | text, number (amount input with decimal handling) | default, hover, focus, disabled, error, success |
| 1.3 | **Select** | `select` | single-select | default, open, disabled, error |
| 1.4 | **Checkbox** | `checkbox` | — | unchecked, checked, indeterminate, disabled |
| 1.5 | **Radio Group** | `radio-group` | — | unselected, selected, disabled |
| 1.6 | **Toggle/Switch** | `switch` | — | off, on, disabled |
| 1.7 | **Badge/Tag** | `badge` | neutral, brand, and one per status color (success/warning/info/error/danger) | default, removable (with close icon) |
| 1.8 | **Tooltip** | `tooltip` | — | default, with arrow, long content |
| 1.9 | **Progress Bar** | `progress` | linear, **segmented** (restyled to blocks per `DESIGN.md` §6.2.5) | 0%, partial, complete, indeterminate |
| 1.10 | **Spinner** | — (custom) | sm/md/lg | — |
| 1.11 | **Skeleton Loader** | `skeleton` | text line, card block, table row | — |
| 1.12 | **Divider** | `separator` | horizontal, vertical | — |
| 1.13 | **Typography** | — (custom) | `Heading` (levels display/h1–h5), `Text` (lead/body-l/m/s/caption), `MonoNumber` (tabular figures for APY/amounts) | — |
| 1.14 | **Slider** | `slider` | sm/md/lg, horizontal/vertical | default, controlled, range (2 thumbs), multi-thumb, disabled |

**Acceptance for every atom:** matches the corresponding spec in `DESIGN.md` §3 (type) and §7.1–7.2 (component specs), uses only tokens from Phase 0.2, implements the press-feedback pattern from `AGENTS.md` §7 where the element is clickable.

---

## Phase 2 — Molecules

Depends on Phase 1. Each row lists its main atom dependencies.

| # | Component | Built from | Key requirements |
|---|---|---|---|
| 2.1 | **Stat Card** | Typography, Divider | Label + big mono value + optional trend row; loading skeleton variant |
| 2.2 | **APY Pill** | Badge, Tooltip, MonoNumber | Shows total APY; tooltip breaks down base/reward/boost (use mock vault APY fields) |
| 2.3 | **Token Amount Input** | Input, Button | Amount field + available balance line + "Max" button + USD estimate; token shown as **text badge placeholder** (see `AGENTS.md` §1), not an icon |
| 2.4 | **Wallet Address Chip** | Badge, Tooltip | Truncated address (`lib/utils.ts` formatter), copy-to-clipboard button with a "Copied" micro-feedback state, explorer link icon |
| 2.5 | **Network Switcher** | Select/Dropdown-menu | Chain name shown as **text/badge**, not an icon; current chain highlighted |
| 2.6 | **Percentage Change Indicator** | MonoNumber | Up/down arrow glyph + color (success/error) + magnitude; zero-change neutral state |
| 2.7 | **Risk Level Indicator** | Badge | Low/Medium/High, status-color mapped, icon + label (never color alone) |
| 2.8 | **Search & Filter Bar** | Input, Select, Badge | Search field + filter dropdowns (chain, risk, status) + active-filter chips with clear |
| 2.9 | **Tabs** | `tabs` | Underline-active style per `DESIGN.md` §7.5; keyboard arrow navigation |
| 2.10 | **Accordion** | `accordion` | Single and multi-open modes; animated expand/collapse respecting reduced motion |
| 2.11 | **Alert/Banner** | `alert` | One variant per status color; dismissible variant |
| 2.12 | **Toast Notification** | `sonner`/`toast` | Success/error/info/pending variants; auto-dismiss timing per `DESIGN.md` §7.6 (errors persist) |
| 2.13 | **Countdown Timer** | MonoNumber | Live-updating D/H/M/S display for lock periods/epochs; "ended" state |
| 2.14 | **Empty State** | Typography, Button | Icon-less illustration area (use pixel dot-grid/box-drawing motif per `DESIGN.md` §6.2), message, optional CTA |
| 2.15 | **Confirmation Dialog** | `dialog`, Button | Title, description, confirm/cancel actions; destructive variant using danger button |
| 2.16 | **Pagination** | `pagination` | Page numbers, prev/next, disabled edge states, compact mobile variant |

---

## Phase 3 — Organisms: Wallet & Transactions

Depends on Phases 1–2.

- [ ] **3.1 Wallet Connect Modal** — Dialog listing mock wallet providers (MetaMask, WalletConnect, Coinbase Wallet, etc. as plain labeled rows — no provider icons per the exclusion rule); loading state per provider row while "connecting"; error state for a failed mock connection.
- [ ] **3.2 Account Dropdown** — Dropdown-menu triggered from a wallet-address chip; shows truncated address, mock balance, network switcher entry point, disconnect action.
- [ ] **3.3 Transaction Status Modal/Toast** — Pending → Success/Failed progression (drive with mock state in the story, e.g. a `Simulate` control or auto-timeout), link out to a mock block-explorer URL, tx hash chip.
- [ ] **3.4 Approve Token Flow** — Two-step composite (Approve → Deposit) built from Button + Progress/Stepper indicator; clearly shows which step is active/complete/pending; explains in copy why approval is needed.
- [ ] **3.5 Gas Fee Estimator** — Estimated fee in native token + USD, speed selector (slow/standard/fast) if relevant, loading/skeleton state while "estimating."
- [ ] **3.6 Notification/Activity Feed** — List of recent account events (deposit, withdraw, compound, approve) using `transactions.ts` mock data; empty state; relative timestamps.

---

## Phase 4 — Organisms: Vaults

Depends on Phases 1–2. This is the core of the product — give it the most design care.

- [ ] **4.1 Vault Card** — Deposit-token text badge(s) (stacked pair for LP vaults), vault name, APY Pill, TVL stat, Risk Level Indicator, status badge (active/deprecated), primary CTA. Hover state per `DESIGN.md` §7.3 (border shift, optional pixel-shadow on a "featured" variant).
- [ ] **4.2 Vault Table Row** — Same data as the Vault Card in dense table form (`table` primitive), right-aligned tabular numbers, hover row highlight, click-through affordance.
- [ ] **4.3 Vault List/Grid + Filters** — Composes Search & Filter Bar (2.8) + a grid/table view toggle + Vault Card/Row + Pagination or infinite-scroll-style loading skeletons; empty-results state.
- [ ] **4.4 Deposit/Withdraw Panel** — Tabs (Deposit/Withdraw) + Token Amount Input + fee/slippage info row + Approve Token Flow entry point + primary action button with loading state; validation error state (insufficient balance, amount below minimum).
- [ ] **4.5 Strategy Info Panel** — Strategy description, underlying protocol(s) listed as text badges, audit/security links, risk factors as a bulleted list, "how compounding works" explainer copy.
- [ ] **4.6 Audit/Security Badge Row** — Row of trust badges ("Audited by X", "Insured", "Open source") built from Badge/Tooltip; unaudited-vault warning variant using the warning status color.

---

## Phase 5 — Organisms: Portfolio & Data Visualization

Depends on Phases 1–2, and Recharts (0.10).

- [ ] **5.1 APY Breakdown Chart** — Stacked bar or area chart: base vs. reward vs. boosted APY, using the chart color order from `DESIGN.md` §7.9 (`#1FFFC3 → #3BE3B6 → #57C7A9 → #73AB9C`), square markers, gridlines in `border-subtle`.
- [ ] **5.2 Portfolio Summary Card** — Total deposited, total earned, daily/monthly yield, using Stat Card (2.1) internally; loading skeleton variant.
- [ ] **5.3 TVL/Performance Chart** — Line/area historical chart with a time-range selector (7D/30D/90D/All); tooltip on hover showing value at point; empty/loading states.
- [ ] **5.4 Compounding History Table** — Table (`table` primitive) of auto-compound events: date, amount compounded, resulting balance, tx hash chip; pagination if long.

---

## Phase 6 — Templates

Full-page Storybook compositions assembled from the organisms above. **Dashboard/Portfolio page is excluded** — do not build it.

- [ ] **6.1 Vaults Listing Template** — Page shell (nav placeholder + Vault List/Grid + Filters, 4.3) shown at desktop and mobile viewports.
- [ ] **6.2 Vault Detail Template** — Page shell composing Deposit/Withdraw Panel (4.4), Strategy Info Panel (4.5), Audit/Security Badge Row (4.6), APY Breakdown Chart (5.1), and TVL/Performance Chart (5.3).
- [ ] **6.3 Connect Wallet (Empty State) Template** — Full-page state shown before a wallet is connected, using Empty State (2.14) and triggering Wallet Connect Modal (3.1).
- [ ] **6.4 Transaction History Template** — Page shell composing Notification/Activity Feed (3.6) and/or Compounding History Table (5.4) with Search & Filter Bar (2.8) and Pagination (2.16).

---

## Phase 7 — Final QA & Wrap-up

- [ ] **7.1** Full `build-storybook` pass with zero errors/warnings across every story.
- [ ] **7.2** Full Storybook `a11y` addon sweep — resolve any remaining critical/serious violations across all components.
- [ ] **7.3** Consistency pass: confirm no component uses a raw hex value, a radius outside `0`/`0.25rem`, a font outside the two brand families, or a transition outside the `DESIGN.md` §8 tokens (grep the codebase for stray hex codes and arbitrary Tailwind values as a check).
- [ ] **7.4** Write a top-level `docs/PROGRESS.md` summary: full component inventory with status, known gaps, and suggested next steps for whoever wires this UI kit to real Web3 data.
- [ ] **7.5** Write/update a short `README.md` for the ui-kit covering: how to run Storybook, folder structure, and where `DESIGN.md`/`AGENTS.md`/`TASKS.md` live.

---

## Progress Tracking

Keep a running count at the top of `docs/PROGRESS.md`, e.g.:

```
Phase 0: 11/11
Phase 1: 14/14
Phase 2: 6/16
Phase 3: 0/6
Phase 4: 0/6
Phase 5: 0/4
Phase 6: 0/4
Phase 7: 0/5
```

# AGENTS.md — Eque UI Kit

This file governs how an AI coding agent works on this repository. Read this file fully before starting any task, and re-read the relevant sections before starting each new phase in `TASKS.md`.

---

## 1. Project Context

**Eque** is a decentralized yield optimizer. Users deposit crypto into **Vaults**; smart-contract-driven **Strategies** auto-compound farming rewards back into the user's deposited asset, maximizing APY across liquidity pools, AMMs, and other DeFi opportunities.

**This repository is a UI kit only.** There is no wallet connection logic, no smart contract calls, and no real blockchain data. Every component is built and demonstrated with **mock data**. The goal is a complete, production-quality, documented component library in Storybook that a product engineering team can later wire up to real Web3 logic.

### Explicitly out of scope for this repository

Do not build these, even if a component you are working on would normally reference them:

- **Token Icon** component
- **Network/Chain Icon** component
- **Avatar** component
- **Dashboard/Portfolio page** template

Where another component would normally display a token icon, network icon, or avatar (e.g. inside Vault Card, Token Amount Input, Network Switcher, Account Dropdown), substitute a **text-based placeholder**: a small square/rectangular badge (radius `0`) showing the ticker or initials (e.g. `ETH`, `USDC`, `0x4F`) in Spline Sans Mono. Do not import or build an icon/avatar system to fill the gap. Note this substitution explicitly in the recap (see §13).

---

## 2. Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router), already scaffolded |
| Styling | Tailwind CSS |
| Component primitives | shadcn/ui |
| Documentation/dev environment | Storybook |
| Charts | Recharts (add as a dependency in Phase 0) |
| Language | TypeScript, strict mode |

Do not introduce a different UI primitive library, CSS-in-JS system, or state manager unless a task explicitly requires it. Keep the dependency footprint minimal.

---

## 3. Design System

All visual decisions are governed by **`DESIGN.md`** (the Eque design system), which must be treated as the source of truth. Read it in full before Phase 0, and re-check the relevant section every time you build a component. Do not invent colors, spacing, radii, or type styles that aren't in `DESIGN.md`.

Non-negotiable constraints, restated for quick reference:

- **Border radius:** `0px` by default, `0.25rem` only for inputs, tooltips, small chips. Never anything larger. No pills.
- **Color:** background `#070A0F`, surfaces `#0D1219` → `#1A222D`, primary `#1FFFC3` used on ≤10% of any screen. Full palette, tonal ladders, and status colors are in `DESIGN.md` §2.
- **Typography:** headings/labels/buttons/numbers in **Spline Sans Mono**; paragraphs in **Google Sans** (fallback `Inter, system-ui`). Full scale in `DESIGN.md` §3.
- **Spacing:** 4px base unit, section padding limits in `DESIGN.md` §4.3.
- **Elevation:** tonal layers + hairline borders, not drop shadows. `DESIGN.md` §5.
- **Pixel decoration:** stepped corners, corner brackets, dot grid, box-drawing glyphs — max 1–2 motifs per component/viewport, ≤5% visual weight. `DESIGN.md` §6.2.
- **Motion:** durations/easing tokens in `DESIGN.md` §8. Respect `prefers-reduced-motion`.

If a task seems to require deviating from `DESIGN.md` (e.g. a component type it doesn't cover), extend it consistently with its existing tokens and note the addition in the recap — do not silently invent an unrelated style.

---

## 4. Project Structure

```
src/
  app/                          # Minimal Next.js shell (not the focus of this project)
  components/
    ui/                         # shadcn primitives, generated via CLI, restyled to match tokens
    atoms/
      Button/
        Button.tsx
        Button.stories.tsx
    molecules/
      StatCard/
        StatCard.tsx
        StatCard.stories.tsx
    organisms/
      VaultCard/
        VaultCard.tsx
        VaultCard.stories.tsx
    templates/
      VaultsListing/
        VaultsListing.tsx
        VaultsListing.stories.tsx
  lib/
    utils.ts                    # cn(), formatters
    mock-data/
      tokens.ts
      vaults.ts
      transactions.ts
      chains.ts
  styles/
    globals.css                 # CSS variables from DESIGN.md §12, font-face/imports
docs/
  DESIGN.md
  PROGRESS.md                   # Recap log (see §13)
AGENTS.md
TASKS.md
```

- One component per folder, co-located with its story file (and test file, if tests are added later).
- Every component is exported from a local `index.ts` inside its folder, and re-exported from the nearest barrel (`components/atoms/index.ts`, etc.) so imports stay short.
- Do not put business/mock data directly inside component files — pull it from `lib/mock-data/` so components stay presentational.

---

## 5. Component Development Rules

- **TypeScript only.** Every component has an explicit, exported `Props` interface. No `any`.
- **Forward refs** on every component that renders a single interactive DOM element (buttons, inputs, etc.), so it composes correctly with shadcn primitives and Radix.
- **Variants via `cva` (class-variance-authority)** — already a shadcn dependency — for variant/size/state props. Don't hand-roll conditional class strings for anything with more than two variants.
- **Compose on top of shadcn primitives** wherever a shadcn component exists for the pattern (see the mapping table in §9). Restyle them to match `DESIGN.md`; do not ship shadcn's default rounded/shadow look.
- **Presentational components stay presentational.** Organisms accept data via props (typed against shapes in `lib/mock-data/`) and callbacks (`onDeposit`, `onConnect`, etc.) — they do not fetch data or hold business logic. Mock handlers in stories can simulate async behavior with `setTimeout`.
- **Accessibility is part of "done,"** not a follow-up pass: semantic HTML, labelled form fields, visible focus rings, keyboard operability, `aria-*` only where semantics need help, decorative glyphs marked `aria-hidden`.
- **Responsive by default:** every component must work down to a 375px viewport without horizontal scroll (except explicitly scrollable regions like tables), per `DESIGN.md` §10.

---

## 6. Styling Rules

- Map every token in `DESIGN.md` §12 into `tailwind.config.ts` (`theme.extend.colors`, `borderRadius`, `fontFamily`, `spacing`, `boxShadow`, `keyframes`/`animation`). Reference Tailwind tokens (`bg-surface`, `text-text-secondary`, `rounded-sm`) in components — **never hardcode a hex value or an arbitrary Tailwind value** (`bg-[#0D1219]`) once the token exists in the config.
- Load **Spline Sans Mono** and **Google Sans** via `next/font` where possible (fall back to a Google Fonts `<link>` / `@font-face` in `globals.css` if `next/font` can't resolve Google Sans), with the fallback stacks specified in `DESIGN.md` §3.1. Verify both font-family CSS variables are wired into `tailwind.config.ts` (`font-heading`, `font-body`).
- `globals.css` should declare the CSS custom properties from `DESIGN.md` §12 at `:root`, plus the `prefers-reduced-motion` reset block.
- Never use `outline: none` without providing a replacement focus style.

---

## 7. Interactivity & Motion Rules

Every interactive component must be visibly, tastefully alive — this is a hard requirement, not a nice-to-have:

- **Hover:** implement the hover treatment defined for that component in `DESIGN.md` (§7.x). If none is specified, default to a border/background shift using the component's existing tokens — never a generic opacity fade alone.
- **Focus-visible:** 2px solid `primary` outline, 2–3px offset, on every focusable element (`DESIGN.md` §9).
- **Active/pressed:** a distinct state from hover (see Button spec in `DESIGN.md` §7.1 — darker fill + 1px translate).
- **Loading states:** buttons, panels, and data cards that can be in a pending state must implement a loading variant (spinner, skeleton, or disabled+spinner per component), not just a disabled state with no feedback.
- **Ripple/press feedback:** where a "ripple" affordance is appropriate (primary buttons, vault cards, list rows), implement it as a **sharp, rectangular sweep or flash** confined to the element's own bounds — not a circular Material-style ripple. A circular ripple conflicts with the `0px`-radius, angular language of this system. A reference implementation:

  ```css
  .press-feedback {
    position: relative;
    overflow: hidden;
  }
  .press-feedback::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(31, 255, 195, 0.16);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--dur-micro) var(--ease);
    pointer-events: none;
  }
  .press-feedback:active::after {
    transform: scaleX(1);
  }
  ```

- Use the duration/easing tokens from `DESIGN.md` §8 (`--dur-micro`, `--dur-default`, `--dur-large`, `--ease`) for every transition — don't invent ad hoc durations.
- Respect `prefers-reduced-motion: reduce` globally (already handled in `globals.css` per §6) — components must not re-introduce motion that ignores it.

---

## 8. Shadcn Usage Rules

- Add primitives with the CLI (`npx shadcn@latest add <component>`) rather than hand-writing Radix wrappers from scratch.
- Immediately after adding a primitive, restyle it in `components/ui/` to match `DESIGN.md`: strip default radius/shadow classes, swap in the token-based classes, and remove any color that isn't in the Eque palette.
- Do not let two different components implement the same interaction pattern differently (e.g. two different dropdown implementations) — always check `components/ui/` first before adding a new primitive.

### Suggested shadcn → Eque component mapping

| Eque component | shadcn base |
|---|---|
| Button | `button` |
| Input, Token Amount Input | `input` |
| Select, Network Switcher | `select` or `dropdown-menu` |
| Checkbox | `checkbox` |
| Radio Group | `radio-group` |
| Toggle/Switch | `switch` |
| Badge/Tag, Risk Level Indicator | `badge` |
| Tooltip | `tooltip` |
| Progress Bar | `progress` (restyled to segmented blocks) |
| Skeleton Loader | `skeleton` |
| Divider | `separator` |
| Tabs | `tabs` |
| Accordion | `accordion` |
| Alert/Banner | `alert` |
| Toast Notification | `sonner` (or `toast`) |
| Confirmation Dialog, Wallet Connect Modal | `dialog` |
| Account Dropdown | `dropdown-menu` |
| Pagination | `pagination` |
| Vault Table Row, Compounding History Table | `table` |
| Search & Filter Bar | `input` + `command` (optional) |

---

## 9. Storybook Conventions

- **Format:** CSF3 (`export const Default: Story = {...}`), with `Meta` typed via `satisfies Meta<typeof Component>`.
- **File location:** co-located, `ComponentName.stories.tsx` next to `ComponentName.tsx`.
- **Titles** follow the atomic folder structure: `Atoms/Button`, `Molecules/StatCard`, `Organisms/VaultCard`, `Templates/VaultsListing`.
- **Autodocs:** enable `tags: ['autodocs']` on every component meta, and write a one-paragraph component description in the meta (what it's for, when to use it).
- **Controls:** every prop that has a meaningful set of values must be exposed via `argTypes` (variant, size, state, etc.), not just hardcoded across separate stories.
- **Required stories per component**, at minimum:
  - `Default`
  - One story per variant (or an `AllVariants` composite story if variant count is high)
  - One story per meaningful state (hover is not scriptable in static stories — cover loading, disabled, error, empty, filled instead)
  - A composite usage story showing the component in a realistic context (e.g. Vault Card inside a grid, Deposit Panel with a filled form)
- **Global preview config** (`.storybook/preview.ts`): force the dark canvas background (`#070A0F`), load both fonts, register the `a11y` addon, and set a default viewport list including a 375px mobile size.
- **Accessibility:** every story must pass the Storybook `a11y` addon with no critical/serious violations before a task is marked done.

---

## 10. Mock Data Conventions

- All mock data lives in `lib/mock-data/` as typed, exported constants/functions (`getMockVaults()`, `mockTransactions`, etc.). Components and stories both import from here — never duplicate fixture data inline in multiple stories.
- Token representation (since Token Icon is out of scope): a `Token` type with at least `symbol`, `name`, `decimals` — rendered as the text-badge placeholder described in §1.
- Chain representation (since Network Icon is out of scope): a `Chain` type with `name`, `id` — rendered as a text label/badge, no icon.
- Include enough variety in mock data to exercise edge cases: a vault with a very long name, a zero-APY vault, a deprecated/high-risk vault, an empty transaction list, a failed transaction, a very large and a very small token amount (for number formatting).

---

## 11. Tooling & MCP Usage

You are expected to actively use whatever tools, skills, plugins, or MCP servers are available in your environment rather than relying only on memory:

- Before using an unfamiliar or fast-moving API (shadcn CLI flags, Storybook 8/9 config shape, Tailwind version-specific syntax, Recharts API), **look up current documentation** (via an MCP doc server if one is connected, or a web search) instead of assuming — these libraries change quickly and training knowledge may be stale.
- Use the **shadcn CLI** (via terminal/tool access) to scaffold primitives rather than hand-authoring Radix wrappers.
- If a **browser preview / screenshot tool** is available, use it to visually check a component against `DESIGN.md` before marking a task done — a visual check catches spacing/color drift that reading code doesn't.
- If a **Figma or design-token MCP** is connected, you may use it to cross-check values against `DESIGN.md`, but `DESIGN.md` is always the final authority if there's a conflict.
- Run the project's own tooling after each task: `lint`, `build`, and `build-storybook` (or the dev server) to catch errors before marking a task complete — don't assume code compiles.

---

## 12. Git Restrictions — read carefully

- **Never run `git init`.**
- **Never run `git add`, `git commit`, `git push`, `git tag`, or any command that changes repository/version-control state.**
- You may run **read-only** git commands if genuinely needed for context (e.g. `git status`, `git diff`, `git log`) only if a `.git` directory already exists and the user asks for it — do not do this proactively.
- The user manages all commits and version control themselves. Your job ends at working code on disk plus the documentation recap described below.

---

## 13. Documentation & Recap Requirement

**A task is not complete until its recap entry exists.** After finishing each task in `TASKS.md` (i.e. each checkbox item, or each phase if the task list groups multiple small items):

1. Open `docs/PROGRESS.md` (create it in Phase 0 if it doesn't exist yet, using the template below).
2. Append a new dated entry — do not rewrite or delete previous entries.
3. Only then check the corresponding box in `TASKS.md`.

### `docs/PROGRESS.md` entry template

```md
## [Phase X.Y] Component/Task Name — YYYY-MM-DD

**Files added/changed:**
- `path/to/Component.tsx`
- `path/to/Component.stories.tsx`

**Implemented:**
- Variants: ...
- Sizes/states: ...
- Stories added: Default, ..., ...

**Design system references:** DESIGN.md §X.X, §Y.Y

**Deviations from DESIGN.md (if any) and why:**
- ...

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- ...

**Known gaps / follow-ups:**
- ...

**Verification performed:**
- [ ] `lint` passes
- [ ] `build` passes
- [ ] Storybook renders with no console errors
- [ ] a11y addon: no critical/serious violations
```

At the end of each **phase**, add a short phase-level summary at the top of that phase's entries in `PROGRESS.md` (what shipped, what's left, any structural decisions future phases should know about).

---

## 14. Workflow

1. Read `TASKS.md`, find the next unchecked task in phase order (don't skip ahead into a later phase unless the current phase is fully checked off).
2. Re-read the relevant `DESIGN.md` sections and the shadcn mapping for that component.
3. Implement the component per the Definition of Done (§15).
4. Verify it in Storybook (and visually, if a preview tool is available).
5. Run lint/build/build-storybook.
6. Write the `docs/PROGRESS.md` recap entry.
7. Check the box in `TASKS.md`.
8. Move to the next task.

Work **one component (or one clearly-scoped task) at a time**. Do not batch multiple unrelated components into a single pass without recapping each — the recap is per-task, not per-session.

---

## 15. Definition of Done (applies to every component)

- [ ] TypeScript, typed and exported `Props` interface, no `any`
- [ ] Built on the correct shadcn primitive where one exists (§9), restyled to tokens
- [ ] Uses only Tailwind tokens mapped from `DESIGN.md` — no raw hex, no arbitrary values outside the config
- [ ] Radius is `0` or `0.25rem` only, per `DESIGN.md` §6.1
- [ ] Spline Sans Mono for headings/labels/buttons/numbers, Google Sans for body text
- [ ] Full state coverage: default, hover, focus-visible, active/pressed, disabled, loading (where applicable), error/empty (where applicable)
- [ ] Motion uses `DESIGN.md` §8 duration/easing tokens; reduced-motion respected
- [ ] Keyboard operable, visible focus ring, correct semantics/ARIA
- [ ] Responsive down to 375px width, no unintended horizontal scroll
- [ ] Storybook stories: `Default` + all variants + all states + one realistic composite usage, with `argTypes` controls and `autodocs`
- [ ] No console errors/warnings in Storybook
- [ ] Storybook `a11y` addon: no critical/serious violations
- [ ] `docs/PROGRESS.md` recap entry written
- [ ] `TASKS.md` checkbox updated

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

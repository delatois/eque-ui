# PROGRESS.md — Eque UI Kit

```
Phase 0: 11/11
Phase 1: 14/14
Phase 2: 3/16
Phase 3: 0/6
Phase 4: 0/6
Phase 5: 0/4
Phase 6: 0/4
Phase 7: 0/5
```

---

## Phase 0 summary — Foundation & Setup — 2026-09-22

**What shipped:** full design-token theme (Tailwind v4 CSS-first), brand fonts,
shadcn radius baseline, global styles, Storybook global config, atomic folder
structure with barrels, `cn()` + formatters, typed mock data (tokens, chains,
vaults, transactions), recharts 3.10.1. `lint`, `build`, and `build-storybook`
all pass with zero errors.

**Structural decisions future phases must know:**
- Tailwind v4 has no `tailwind.config.ts` — all tokens live in `@theme` /
  `:root` in `app/globals.css`. Never hardcode hex or arbitrary values.
- Project uses root-level `app/`, `components/`, `lib/` (no `src/`).
- Co-located `components/**/*.stories.tsx` are picked up by Storybook
  (`.storybook/main.ts` glob extended).
- `lib/utils.ts` re-exports `cn` from the `cn` package (this stack's
  clsx+tailwind-merge replacement), plus hand-written formatters.
- Google Sans is proprietary — Inter is the loaded fallback; the font stack
  keeps Google Sans first so a licensed copy still wins.

---

## [Phase 0.1–0.11] Foundation & Setup — 2026-09-22

**Files added/changed:**
- `app/globals.css` (rewritten: Eque `@theme` tokens, `:root` vars, base layer, utilities)
- `app/layout.tsx` (Spline Sans Mono + Inter via `next/font`, Eque metadata, dark class)
- `.storybook/preview.tsx` (dark canvas, backgrounds, 375px viewport, autodocs, a11y)
- `.storybook/preview-head.html` (new: Google Fonts links + dark canvas base style)
- `.storybook/main.ts` (stories glob extended to `components/**`)
- `eslint.config.mjs` (ignore `storybook-static/**` build output)
- `components/{atoms,molecules,organisms,templates}/index.ts` (new barrels)
- `lib/utils.ts` (kept `cn` re-export, added 4 formatters)
- `lib/mock-data/tokens.ts`, `chains.ts`, `vaults.ts`, `transactions.ts` (new)
- `docs/DESIGN.md` (new: copy of root `DESIGN.md`)
- `stories/Page.tsx` (escaped quotes — lint fix only)
- `package.json` / `package-lock.json` (added `recharts@3.10.1`)

**Implemented:**
- Tokens: every `DESIGN.md` §12 token — brand, surfaces, borders, text,
  status (+tint bg/border), primary opacity ladder, chart series order,
  `font-heading`/`font-body`, radius (`none: 0px`, `sm: 0.25rem`, larger steps
  pinned to `0px`), pixel/neon/halo shadows, `ease-eque` + micro/default/large
  durations. Spacing uses Tailwind v4's default 4px-base dynamic scale.
- Fonts: Spline Sans Mono 400–700 + Inter via `next/font` (display swap);
  Storybook loads the same families via Google Fonts link.
- shadcn: verified `components.json` (style `base-mira`, cssVariables); the
  schema has no radius field, so the radius-0 baseline is enforced via
  `--radius: 0px` + the pinned `@theme` scale instead.
- Global styles: full `:root` vars, `focus-visible` 2px primary ring,
  `prefers-reduced-motion` reset, `.press-feedback` (rectangular sweep),
  `.pixel-notch`, `.bracket`, `.dot-grid`, `.tabular`.
- Mock data: 10 tokens (incl. `SUPERLONG` long symbol), 4 chains, 8 vaults
  (highest/lowest APY, zero APY, deprecated, unaudited ×2, very long name, LP
  pair, $412M + $12.47 TVL extremes), 5 transactions (pending + failed, dust +
  whale amounts).
- Scaffold audit versions: Next 16.3.6, React 19.2.8, Tailwind 4.3.3,
  Storybook 10.6.0, shadcn 4.21.0, cva 0.7.1, lucide-react 1.47.0.

**Design system references:** DESIGN.md §2 (all), §3.1–3.3, §4.2, §5.2, §6.1–6.2, §8, §9, §12

**Deviations from DESIGN.md (if any) and why:**
- Tokens implemented in `app/globals.css` `@theme` instead of
  `tailwind.config.ts`: Tailwind v4 is CSS-first; no config file exists in this
  scaffold. 1:1 token mapping preserved.
- Larger radius steps (`md`–`4xl`) pinned to `0px`: enforcement of the
  "nothing larger than 0.25rem" rule so shadcn defaults can't leak pills.
- Google Sans loaded as Inter (proprietary, not on Google Fonts); stack order
  keeps Google Sans first per §3.1 fallback rule.
- Structure at repo root (`app/`, `components/`, `lib/`) instead of `src/`:
  follows the existing scaffold rather than restructuring.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None needed in Phase 0 (no rendered components). Mock `Token`/`Chain` types
  carry only `symbol/name/decimals` and `id/name` so future components use the
  text-badge placeholder pattern.

**Known gaps / follow-ups:**
- `app/page.tsx` is still the create-next-app placeholder (out of scope until
  templates in Phase 6; minimal shell only).
- `stories/` still holds default Storybook scaffold examples (kept green for
  lint/build; Eque stories live co-located under `components/` from Phase 1).
- Visual screenshot check not performed (no browser preview tool connected);
  token values are verbatim from DESIGN.md §12.

**Verification performed:**
- [x] `lint` passes (exit 0; fixed 2 `react/no-unescaped-entities` errors in
  scaffold `stories/Page.tsx`; `storybook-static/` build output eslint-ignored)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] Storybook renders with no console errors (`build-storybook` succeeds;
  `dev` and `storybook` servers each return HTTP 200)
- [x] a11y addon: configured (`test: 'todo'`); no Eque components exist yet to
  sweep — first sweep due with Phase 1 atoms

---

## [Phase 1.1] Button — 2026-09-23

**Files added/changed:**
- `components/ui/button.tsx` (rewritten: Eque cva variants/sizes on the Base UI primitive, ref forwarding)
- `components/atoms/Button/Button.tsx` (new: public atom with `loading` state)
- `components/atoms/Button/index.ts` (new: folder barrel)
- `components/atoms/Button/Button.stories.tsx` (new: 11 stories + play tests)
- `components/atoms/index.ts` (re-exports Button)
- `app/globals.css` (`--tracking-button` token, `.bracket:disabled` rule)

**Implemented:**
- Variants: primary, secondary, tertiary, danger, icon (square, sized per size prop)
- Sizes: sm (32px) / md (44px, default) / lg (56px) per DESIGN.md §7.1
- States: default, hover, active/pressed, focus-visible, disabled, loading (LoaderCircle spinner + `aria-busy`)
- Stories added: Default, Secondary, Tertiary, Danger, IconOnly, Sizes, Loading, Disabled, WithIcons, ActionsRow, Gallery (variant × size matrix)

**Design system references:** DESIGN.md §2.5–2.6, §3.3, §5.2, §6.1–6.2, §7.1, §8, §9

**Deviations from DESIGN.md (if any) and why:**
- Danger hover pairs `danger-bright` bg with `ink-on-fill` text instead of white: white on `#FF8AA1` is ~2:1 contrast; near-black ink restores legibility via the existing §2.6 status-fill ink token.
- Focus outline offset 2px (global token) instead of 3px: within the AGENTS.md §7/§9 2–3px allowance, keeps a single ring everywhere.
- Disabled danger/tertiary/icon states extend the primary/secondary disabled pattern (`surface-high`/`border-subtle` + `text-disabled`); §7.1 only specifies primary/secondary.
- `press-feedback` sweep on primary/secondary/icon only; tertiary (borderless text) and danger use color shifts so the teal sweep never fights the text-button aesthetic or the red fill.
- Active `translate-y-px` on primary only, per §7.1 (secondary active is a bg shift).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (Button renders lucide glyphs only; no token/network/avatar surface).

**Known gaps / follow-ups:**
- `test-run` MCP wrapper is stuck ("already running" with no underlying process); tests executed via the equivalent `npx vitest run --project storybook Button` — 15/15 pass.
- Playwright chromium + OS libs were missing in this environment; installed (`playwright install chromium` + `install-deps`). Should not need repeating.
- A stale Phase-0 Storybook process was squatting port 6006 with a pre-Button index; killed, fresh server on 6006.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] Storybook renders with no console errors (`build-storybook` succeeds; static index lists all 12 `atoms-button` entries; dev server 200 on :6006)
- [x] a11y addon: `test: 'todo'` mode, 15/15 story tests pass with no a11y failures reported (icon stories carry `aria-label`)

**Revision 2026-09-23 (secondary hover):** secondary now mirrors primary interaction — transparent bg/brackets kept, hover adds the neon glow (`hover:shadow-neon`, cleared on active), active adds `translate-y-px`. Kept brackets over `pixel-notch` (clip-path would cut the bracket glyphs). Re-verified: lint/build/build-storybook clean, 15/15 story tests pass.

**Bugfix 2026-09-23 (missing bottom-right bracket):** user reported secondary "didn't change". Two findings: (1) the dev-server PTY had died, so preview links were dead/stale when viewed; (2) a real CSS bug — `.bracket::after` shared its pseudo-element with the `.press-feedback::after` sweep overlay, whose `transform: scaleX(0)` collapsed the bottom-right tick to zero width (only the top-left `::before` tick rendered). Fix: bracket ticks are now `background-image` linear-gradients on `.bracket` (4 layers, `border-box` origin), leaving `::after` to the sweep; disabled flattening moved to `.bracket:disabled` gradient override. Verified with zoomed Playwright screenshots: both corners render at rest, hover glow + tint intact, disabled ticks flatten to gray. Re-verified: lint/build/build-storybook clean, 15/15 story tests pass.

## [Phase 1.2] Input — 2026-09-23

**Files added/changed:**
- `components/ui/input.tsx` (restyled: `inputVariants` cva with `status: default|error|success`)
- `components/atoms/Input/Input.tsx` (new)
- `components/atoms/Input/Input.stories.tsx` (new)
- `components/atoms/Input/index.ts` (new)
- `components/atoms/index.ts` (exports Input)
- `app/globals.css` (`--color-error-bright` / `--error-bright: #ffa3a3`)

**Implemented:**
- Variants: `text`, `number` (amount: `type="text" + inputMode="decimal"`, `sanitizeAmount(raw, decimals)` strips `[^0-9.]`, collapses dots, caps fraction digits, preserves trailing dot, drops `-`; e.g. `sanitizeAmount("12.3456abc", 2) => "12.34"`)
- Sizes/states: h-11 44px, `rounded-sm`, label (Mono 500 12px, 8px gap), helper caption, error (border `#FF6B6B` + `#FFA3A3` message with icon), success (border `#5BE37D` + check icon only after validation), disabled (bg 60% opacity, `text-disabled`); error takes precedence over success
- Stories added: Default, NumberAmount, LabelAndHelper, Error, Success, Disabled, FocusState, ValidationForm, AllStates — all with interaction `play` tests (9/9)

**Design system references:** DESIGN.md §2 (incl. §2.6 status), §3.3, §5.2, §6.1, §7.2, §8, §9

**Deviations from DESIGN.md (if any) and why:**
- Added `error-bright: #ffa3a3` token: §7.2 specifies the error-message color but Phase 0.2 had no token for it.
- Focus treatment replaces the global `:focus-visible` outline (`focus-visible:outline-none` on the input): the §7.2 primary border + halo *is* the focus ring; keeping the global 2px outline would double-ring.
- No `press-feedback` sweep: inputs aren't clickable; §7 / AGENTS.md §7 reserve it for clickables.
- Error/success status locks border in all states with `focus:shadow-none` (no halo) so the status color is never diluted by a teal glow.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (Input renders lucide status glyphs only).

**Known gaps / follow-ups:**
- FocusState test needs a 250ms settle before reading computed border: the 120ms border/background transition means an immediate read catches the pre-focus color. Dev-server computed values confirm correct end state (primary border + halo, `transition-duration: 0.12s` so `duration-micro` token generates).
- Base UI `onChange` is a `BaseUIEvent`-typed handler (carries `preventBaseUIHandler`); the atom's internal `handleChange` is typed off `InputPrimitive.Props["onChange"]` — plain `React.ChangeEvent` handlers can't be passed straight through.
- Dev-server PTYs keep dying between sessions; restarted fresh on :6006 for this verification.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] Storybook renders with no console errors (`build-storybook` succeeds; dev server 200 on :6006)
- [x] a11y addon: `test: 'todo'` mode, 9/9 Input story tests pass with no a11y failures reported
- [x] Playwright screenshots verified: rest (label + helper), focus (primary border + halo), error (error border + alert icon + message)

**Bugfix 2026-09-23 (placeholder token, found during 1.3 QA):** `placeholder:text-muted` / `data-placeholder:text-muted` rendered near-black `#131A23` (shadcn leftover `--color-muted`), not muted text. Fixed to `text-text-muted` (`#718094`) in both `components/ui/input.tsx` and `components/ui/select.tsx`; Input suite re-run green (9/9).

## [Phase 1.3] Select — 2026-09-23

**Files added/changed:**
- `components/ui/select.tsx` (scaffolded via `shadcn add select`, restyled: `selectTriggerVariants` cva with `status: default|error|success`; popup, items, label, separator, scroll buttons)
- `components/atoms/Select/Select.tsx` (new)
- `components/atoms/Select/Select.stories.tsx` (new)
- `components/atoms/Select/index.ts` (new)
- `components/atoms/index.ts` (exports Select)
- `components/ui/input.tsx` (placeholder token fix, see above)
- `app/globals.css` (`--color-hover-overlay` / `--hover-overlay: rgba(255,255,255,0.02)`)

**Implemented:**
- Single-select only (`SelectPrimitive.Root.Props<string, false>`); options `{ value, label, disabled? }`; Root props (`value`, `defaultValue`, `onValueChange`, `open`, `onOpenChange`, `disabled`, `name`) pass straight through with no event wrapping
- Trigger mirrors Input: h-11, `rounded-sm`, surface, px-4, label (Mono 500 12px, 8px gap), helper/error/success-message wiring identical to Input (error precedence, `role="alert"`)
- Popup: `surface-high` bg, `border-default`, `rounded-sm`, `shadow-pixel`, 200ms fade/zoom open-close; `alignItemWithTrigger` (popup covers trigger when open — stock Base UI behavior)
- Items: min-h-11 (44px touch target), sharp rows, `hover-overlay` wash on `data-highlighted`, `primary-a08` tint + primary check on selected; disabled rows keep pointer events with `not-allowed` cursor (clicks ignored by Base UI) so the state is demonstrable
- Chevron: 16px `text-secondary`, rotates 180° on open via `[&[aria-expanded=true]_svg]:rotate-180` (verified `rotate: 180deg` at runtime)
- Stories added: Default, PreselectedValue, FocusState, Open, SelectsOption, WithDisabledOption, Error, Success, Disabled, AllStates — all with interaction `play` tests (10/10), options from `getMockChains()` text labels

**Design system references:** DESIGN.md §2 (incl. §2.5–2.6 ladders), §3.3, §5.2, §6.1, §7.2, §7.7 (row language), §8, §9

**Deviations from DESIGN.md (if any) and why:**
- New `hover-overlay` token (`rgba(255,255,255,0.02)`): DESIGN §7.7 specifies the row-hover wash but Phase 0.2 had no token; tables (Phase 4) will reuse it.
- Popup spec doesn't exist in DESIGN: extended consistently — `surface-high` (modal/tooltip surface), `rounded-sm` (allowed for selects per §6.1), `shadow-pixel` elevation, `data-highlighted`/`data-selected` treatments from §7.7 row language.
- Item text `text-sm` (14px) vs trigger `text-base`: dropdown density call; trigger stays §7.2 16px.
- `success` status added though TASKS 1.3 lists default/open/disabled/error: §7.2 covers selects for success, mirrors Input for free.
- No `press-feedback` sweep on trigger (it's a disclosure button, not an action — same reasoning as inputs).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- Chain options render as text labels only (`getMockChains()` names); no chain icons.

**Known gaps / follow-ups:**
- Base UI `Select.Value` renders the raw value for preselected values until the popup first mounts (items register on open), so the atom resolves labels itself via `Value`'s `(value) => …` render fn with raw-value fallback.
- Test-timing rules: assert popup *presence* (`toBeInTheDocument`), never visibility (200ms open animation reads opacity-0); `waitFor` the listbox to unmount after selection (200ms close animation).
- Base UI select trigger carries no `data-open` (verified `null` at runtime) — open-state styling must key off `aria-expanded`, not `data-open`.
- Dev-server PTYs keep dying between sessions; restarted fresh on :6006 for this verification.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] Storybook renders with no console errors (`build-storybook` succeeds; dev server 200 on :6006)
- [x] a11y addon: `test: 'todo'` mode, 10/10 Select + 9/9 Input story tests pass with no a11y failures reported
- [x] Playwright verified: closed (muted placeholder `#718094`), open (surface-high popup + pixel shadow + highlight wash), error (red border + message), 375px mobile open (no overflow), chevron rotation, label resolution after select

## [Phase 1.3 revision] Select popup restyle + network icon mockup — 2026-09-23

**Files added/changed:**
- `app/globals.css` (new `--color-primary-dark: #0a2b22` token + `--primary-dark` legacy var)
- `components/ui/select.tsx` (popup, items, scroll buttons)
- `components/atoms/Select/Select.stories.tsx` (mock icon in all network options)

**Implemented:**
- Popup: deep-teal `primary-dark` bg (`rgb(10,43,34)` verified), `primary` neon outline stroke, pixel shadow retained, scroll buttons re-tinted to match.
- Items: Spline Sans Mono (`font-heading`, verified `"Spline Sans Mono"` at runtime), selected tint deepened `primary-a08` → `primary-a16` so it reads on the teal bg.
- `assets/example-mockup.png` (512px, 21KB) beside every network name at 20px sharp (`size-5`, `aria-hidden`, `alt=""`); atom untouched — composition lives in stories via `SelectOption.label: ReactNode`, so the same pattern works for future token/avatar mockups. Selected value in the trigger also shows the icon via the existing label-resolution render fn.

**Design system references:** DESIGN.md §2 (primary #1FFFC3), §3 (Mono as primary/brand font), §5.2, §6.1, §7.2, §7.7

**Deviations from DESIGN.md (if any) and why:**
- New `primary-dark` token (`#0a2b22`): no dark-primary solid existed; popup spec is otherwise unchanged in structure.
- Icon usage is a per-user revision request (icon/avatar components remain out of scope per AGENTS.md §1 — no icon system built; stories-only composition).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- SUPERSEDED for Select stories: user-supplied `assets/example-mockup.png` now renders as the network icon in all chain options (and the selected trigger value).

**Known gaps / follow-ups:**
- Bundler duality: Next image imports type as `StaticImageData`, Vite resolves a URL string — stories normalize via an `unknown` + `typeof === "string"` guard (`mockupIconSrc`). Plain `<img>` with eslint-disable (not `next/image`): mock placeholder, no optimization benefit, keeps Storybook+Vite working.
- `./assets` served by both bundlers via import (no `public/` copy, no `-s` flag change).

**Verification performed:**
- [x] `lint` passes (0 errors; `no-img-element` disabled inline with reason)
- [x] `build` passes (TypeScript clean — png narrowing compiles)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 10/10 Select story tests pass (`vitest --project storybook`), no a11y failures
- [x] Playwright verified: popup bg/border, Mono items, 4 icons loaded (512px natural), trigger shows icon + "Arbitrum" after select

## [Phase 1.4] Checkbox — 2026-09-23

**Files added/changed:**
- `components/ui/checkbox.tsx` (new via `shadcn add checkbox`, restyled)
- `components/atoms/Checkbox/Checkbox.tsx` (new atom)
- `components/atoms/Checkbox/Checkbox.stories.tsx` (new, 9 stories)
- `components/atoms/Checkbox/index.ts` (new)
- `components/atoms/index.ts` (barrel export)

**Implemented:**
- Primitive: 16px sharp (`rounded-none`) square, transparent + `border-default`; checked/indeterminate fill `primary` with `on-primary` glyphs (Check vs Minus, 12px, strokeWidth 3, square caps/miter per §7.9); hover border-strong + hover-overlay wash; focus-visible primary border + halo; active primary-a16 (unchecked) / primary-pressed (filled); disabled opacity-60 + not-allowed with hover guards.
- Atom: `checked` / `defaultChecked` / `indeterminate` (controlled-only) / `onCheckedChange(next: boolean)` / `label` + `description` + `ariaLabel` (box-only) / `id` (auto useId) / `boxClassName`; inline label toggles via `htmlFor`; forwardRef to the primitive button.
- Stories: Default, Checked, Indeterminate, KeyboardToggle (Space), Disabled, DisabledChecked, WithDescription, BoxOnly, AllStates — 9/9 play tests pass.

**Design system references:** DESIGN.md §2, §5.2, §6.1, §7.2, §7.9 (square caps), §8, §9

**Deviations from DESIGN.md (if any) and why:**
- Indeterminate dash glyph: DESIGN only specifies the check; dash in `on-primary` on `primary` fill is the consistent extension (tri-state required by TASKS 1.4).
- Inline label in Google Sans 14px + caption description: DESIGN has no checkbox-label layout; follows the Input label/description language at inline density.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (checkbox has no icon slot).

**Known gaps / follow-ups:**
- Base UI checkbox API differs from Radix convention: `checked` is boolean-only, indeterminate is a separate `indeterminate?: boolean` prop (no `defaultIndeterminate` — uncontrolled indeterminate impossible); state attrs are `data-checked` / `data-indeterminate` presence attrs (no `data-state`).
- Base UI renders the box as `<span role="checkbox" tabindex="-1" aria-disabled>` + hidden input (no native `disabled` attr) — tests assert `aria-disabled`/`data-disabled`, never `toBeDisabled()`.
- Clicking a disabled box is a true no-op (verified staying true AND staying false).

**Verification performed:**
- [x] `lint` passes (also fixed a latent `eslint-disable` syntax error in Select.stories — em-dash instead of `--` separator)
- [x] `build` passes (TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 9/9 Checkbox story tests pass, no a11y failures
- [x] Playwright verified: unchecked transparent/#252F3C, checked + indeterminate primary fill with correct glyphs (`on-primary` #031A14), hover wash + strong border, focus halo + primary border, 375px no overflow

## [Phase 1.4 revision] Checkbox Mono label + exact alignment — 2026-09-23

**Files added/changed:**
- `components/atoms/Checkbox/Checkbox.tsx` (label: `font-body` → `font-heading` Mono, `inline-block` → `block`)

**Implemented:**
- Label now Spline Sans Mono 14px/20px (verified `"Spline Sans Mono"` at runtime); description stays body caption per the Input helper language.
- Box–text vertical centers measure delta **0.00px on all six rows**; left column fixed 16px + 12px gap so boxes and text start on a straight vertical line in every row.

**Deviations from DESIGN.md (if any) and why:**
- None new — Mono label follows §3 (labels in Spline Sans Mono).

**Known gaps / follow-ups:**
- Alignment trap: a bare inline `<label>` measures its content box (~18px), not the 20px line box, so `mt-0.5` on the box missed center by 2.5px; `inline-block` alone still missed by 3px because the wrapper's strut (inherited body leading) pushed the line box down 1px. Fix: label is `block leading-5` (exact 20px block) + box `mt-0.5` → both centers at row+10. Rule of thumb: never trust eyeballing — measure `getBoundingClientRect` centers at runtime.

**Verification performed:**
- [x] `lint` passes
- [x] 9/9 Checkbox story tests pass (label font change is assertion-neutral)
- [x] Playwright: delta 0.00 all rows, Mono computed, screenshot confirms straight-line rows

## [Phase 1.5] Radio Group — 2026-09-23

**Files added/changed:**
- `components/ui/radio-group.tsx` (new via `shadcn add radio-group`, restyled)
- `components/atoms/RadioGroup/RadioGroup.tsx` (new atom)
- `components/atoms/RadioGroup/RadioGroup.stories.tsx` (new, 7 stories)
- `components/atoms/RadioGroup/index.ts` (new)
- `components/atoms/index.ts` (barrel export)

**Implemented:**
- Primitive: 16px `rounded-full` circle (DESIGN's permitted round exception — single-select reads differently from the square checkbox); unselected transparent + `border-default`; selected `primary` fill + 6px `on-primary` dot; hover/focus/active/disabled mirror the checkbox (halo focus, primary-hover/pressed, disabled guards).
- Atom: `value` / `defaultValue` / narrowed `onValueChange(value)` / `options [{value, label, description?, disabled?}]` / optional Mono group `label` (wired via `aria-labelledby`) / group `disabled`; rows reuse checkbox geometry (16px control, `mt-0.5`, block Mono label + caption).
- Stories: Default, Preselected, KeyboardArrows (ArrowDown/Up), WithDisabledOption, DisabledGroup, WithDescriptions, AllStates — 7/7 play tests pass.

**Design system references:** DESIGN.md §2, §5.2, §6.1, §7.2 ("radio may be circular"), §8, §9

**Deviations from DESIGN.md (if any) and why:**
- Circular control + dot glyph: DESIGN allows circular radios; dot-in-fill mirrors the checkbox check-glyph language.
- Meta-level default `options` in stories: required-prop atoms can't have render-only stories without it (TS2322 — same class of error as Select's AllStates `args`).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (radio has no icon slot).

**Known gaps / follow-ups:**
- First test run showed 7/7 failing against a stale dev-server bundle right after the meta-args edit; clean re-run green. When a full file fails immediately after an edit, re-run once before debugging.
- Playwright probe note: `[data-slot="radio-group-indicator"]` itself is a transparent span — assert the inner dot's bg, not the indicator's (screenshot is the real check).

**Verification performed:**
- [x] `lint` passes
- [x] `build` passes (TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 7/7 RadioGroup story tests pass, no a11y failures
- [x] Playwright verified: unselected transparent/#252F3C, selected primary disc + dark dot, disabled dimmed, delta-0 row alignment, Mono labels

## [Phase 1.6] Toggle/Switch — 2026-09-23

**Files added/changed:**
- `components/ui/switch.tsx` (new via `shadcn add switch`, restyled; stock `size` prop removed — DESIGN fixes one 36×20 size)
- `components/atoms/Switch/Switch.tsx` (new atom)
- `components/atoms/Switch/Switch.stories.tsx` (new, 8 stories)
- `components/atoms/Switch/index.ts` (new)
- `components/atoms/index.ts` (barrel export; fixed a duplicated Select line introduced while editing)

**Implemented:**
- Primitive: 36×20 sharp (`rounded-none`) track, 1px border, 12px square thumb on 3px rails (off x=4 / on x=20, symmetric — verified); off = surface track + tertiary thumb; on = primary track + on-primary thumb; hover/focus-halo/pressed/disabled mirror checkbox/radio.
- Atom: settings-row layout (label left, control right, `justify-between`); label and control both 20px tall so rows align by construction (delta-0 verified); `checked` / `defaultChecked` / narrowed `onCheckedChange` / `label` + `description` / `ariaLabel` control-only mode / `forwardRef`.
- Stories: Off, On, KeyboardToggle (Space), Disabled, DisabledOn, WithDescription, ControlOnly, AllStates — 8/8 play tests pass.

**Design system references:** DESIGN.md §2, §5.2, §6.1, §7.2 (36×20 track, square thumb, on = primary), §8, §9

**Deviations from DESIGN.md (if any) and why:**
- Off-state thumb `text-tertiary` + hover `surface-raised`: DESIGN only pins the on-state; off extends the input/checkbox idle language.
- Label-left/control-right row: DESIGN has no switch-row layout; settings-row is the dominant pattern and keeps future Settings screens consistent.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (switch has no icon slot).

**Known gaps / follow-ups:**
- Barrel-edit discipline: anchor edits on unique context — a `RadioGroup`→`RadioGroup+Select` append duplicated the existing Select line (caught by reading the file back, not by tooling; duplicate `export *` from one module).
- Test-runner flake again: full-file failure with `Failed to fetch dynamically imported module … sb-vitest/deps/…` (vite dep-cache race), green on immediate re-run.

**Verification performed:**
- [x] `lint` passes
- [x] `build` passes (TypeScript clean)
- [x] `build-storybook` succeeds (dev server restarted on :6006 after it died mid-phase)
- [x] 8/8 Switch story tests pass, no a11y failures
- [x] Playwright verified: exact 36×20 tracks, symmetric thumb travel, primary on-state + dark thumb, delta-0 label alignment, Mono labels

## [Phase 1.7] Badge/Tag — 2026-09-23

**Files added/changed:**
- `components/ui/badge.tsx` (new via `shadcn add badge`, restyled: `badgeVariants` cva with 7 Eque variants on the Base UI `useRender` span primitive)
- `components/atoms/Badge/Badge.tsx` (new atom with removable close button)
- `components/atoms/Badge/Badge.stories.tsx` (new, 8 stories)
- `components/atoms/Badge/index.ts` (new)
- `components/atoms/index.ts` (barrel export)
- `app/globals.css` (new tokens: `primary-a32`, `success/warning/info-bright` + all five status `bg/border` tint tokens, `tracking-badge`)

**Implemented:**
- Primitive: h-6 (24px), px-2, sharp (`rounded-none`), 1px border, Mono 500 11px uppercase (`tracking-badge` 0.04em per the §3.3 ≤11px badge exception), micro transition, global 2px primary focus-visible ring.
- Variants: neutral (transparent + `border-default` + `text-secondary`), brand (`primary-a08` bg + `primary-a32` border + `primary` text), success/warning/info/error/danger (tint bg + tint border + 300 text per §2.6).
- Atom: `variant` / `children` / `onRemove` (parent owns removal) / `removeLabel` (default "Remove", close named e.g. "Remove Arbitrum") / `forwardRef`; close is a 16×16 keyboard-operable button with 12px square-cap lucide X, `hover-overlay` wash, offset-1 primary focus ring.
- Stories: Default, Brand, AllVariants, StatusSet, Removable (click), RemovableKeyboard (Enter), FilterChips (composite with live removal), VaultBadges (composite tag rows) — 8/8 play tests pass.

**Design system references:** DESIGN.md §2.5–2.6, §3.3 (uppercase ≤11px exception), §5.2, §6.1, §7.5, §7.9 (square caps), §8, §9

**Deviations from DESIGN.md (if any) and why:**
- New `primary-a32` token (`rgba(31,255,195,0.32)`): §7.5 pins the brand border at 0.32 but the §2.5 ladder had no 32 step; mirrors the 0.32 status tint borders.
- New `success/warning/info-bright` (300 text) + five status `bg/border` tint tokens: §7.5 status badges need them; only error/danger-bright existed from prior phases.
- New `tracking-badge` (0.04em): the Label token's letterspacing applied to the 11px badge; no ad-hoc `tracking-[...]` arbitrary value.
- Close-button 16×16 (not 44px touch target): a 24px badge cannot host a 44px target; focus-visible ring + keyboard operability retained.
- Status badges carry text labels (color never alone, §2.6); icon pairing happens at the molecule level (e.g. Risk Level Indicator 2.7), not in the atom.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (badge is text-only; token/network names render as badge text in VaultBadges story).

**Known gaps / follow-ups:**
- Test-runner flake again: full-file `Failed to fetch dynamically imported module … sb-vitest/deps/…` (vite dep-cache race), green 8/8 on immediate re-run. Rule stands: full-file failure → re-run once before debugging.
- Playwright note: stories with removing play functions (Removable, FilterChips) auto-play on direct iframe load, so the dev preview shows the post-play state ("Removed", chip gone). Expected — same class as Switch Off ending ON. Assert `initial` states in tests, not in live preview.
- Playwright-from-/tmp fails (`ERR_MODULE_NOT_FOUND playwright`): run project-local scripts from the repo dir so node resolves `node_modules`, then delete the temp file.
- Also fixed the stale `Phase 1: 1/13` counter → `7/13` (1.1–1.7 done; TASKS.md Phase 1 is a table with no checkboxes, nothing to tick there).

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 8/8 Badge story tests pass, no a11y failures
- [x] Playwright verified: exact 24px height all 7 variants, Mono 11px uppercase + 0.44px tracking, radius 0, exact tint bg/border/text per variant, 16×16 close + 12×12 X, 375px VaultBadges no overflow, zero console errors

## [Phase 1.8] Tooltip — 2026-09-23

**Files added/changed:**
- `components/ui/tooltip.tsx` (new via `shadcn add tooltip`, restyled: `TooltipProvider` pins 300ms delay, `TooltipContent` = surface-high + hairline border + `rounded-sm` + Caption + 6×10 padding + 200ms fade/zoom, opt-in sharp `showArrow`)
- `components/atoms/Tooltip/Tooltip.tsx` (new atom: `content` / element-or-string `children` / side+align / delay / showArrow / open+defaultOpen+onOpenChange, each instance wrapped in its own `TooltipProvider`)
- `components/atoms/Tooltip/Tooltip.stories.tsx` (new, 7 stories)
- `components/atoms/Tooltip/index.ts` (new)
- `components/atoms/index.ts` (barrel export)

**Implemented:**
- Primitive: delay 300 (DESIGN §7.8) pinned on Provider since Base UI reads delay there, not Root; popup `rounded-sm` (allowed for tooltips per §6.1); arrow is a plain rotated square in surface-high, no radius.
- Atom: string children render as dotted-underline hint span; element children pass through Base UI `render` so focus/semantics stay on the real control; 2px primary focus-visible ring; hover + focus open, Escape/unhover close.
- Stories: Default (hover/unhover), WithArrow (icon button), LongContent (string-trigger, max-w-xs wrap), KeyboardFocus (focus+Escape), AllSides (4 sides, delay 0), ApyBreakdown (tabular Mono composite), Open (defaultOpen screenshot pin) — 7/7 play tests pass.

**Design system references:** DESIGN.md §2.5–2.6, §5.2, §6.1 (tooltip `rounded-sm` exception), §7.8, §8 (200ms fade/zoom, 300ms delay), §9

**Deviations from DESIGN.md (if any) and why:**
- Explicit `role="tooltip"` on the popup: Base UI v1.8 `Popup` renders no implicit role (verified in bundle source); the role is required for AT + `getByRole` queries.
- `delay` lives on each atom's own `TooltipProvider`: Base UI `Root.Props` has no `delay` (TS2322 if passed there); per-atom provider keeps standalone §7.8 300ms.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (WithArrow uses a lucide `Info` glyph on a plain button, not an avatar/token icon).

**Known gaps / follow-ups:**
- New debugging rule: when a story test can't find portaled content, first check whether queries use `canvas` (story root only) instead of `screen` (whole body) — portaled popups live in `document.body`. Select already followed this; Tooltip initially didn't.
- Related: custom trigger components used via Base UI `render` MUST forward props (handlers/ref/className land on them via cloneElement) — the first `TextTriggerButton` helper swallowed them and hover/focus never opened the tooltip. Fixed by spreading `...rest` and merging className.
- Both bugs masked each other (role missing + handlers dropped); symptom was uniform `Unable to find role="tooltip"` ×7.

**Verification performed:**
- [x] `lint` passes (exit 0, zero warnings)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 7/7 Tooltip story tests pass, no a11y failures
- [x] Playwright verified: surface-high bg #1A222D, hairline border, 4px radius, 12px Caption, 6×10 padding, hover opens, 375px no overflow, zero console errors

## [Phase 1.9] Progress Bar — 2026-09-23

**Files added/changed:**
- `components/ui/progress.tsx` (new via `shadcn add progress`, restyled: 8px sharp `surface-high` track, `primary` indicator with `transition-[width] duration-default ease-eque`, Caption label/value parts)
- `components/atoms/ProgressBar/ProgressBar.tsx` (new atom: `linear` | `segmented` variants, clamped value/[min,max], `indeterminate`, `segments`, `label` + `showValue`, on Base UI Root for semantics)
- `components/atoms/ProgressBar/ProgressBar.stories.tsx` (new, 9 stories)
- `components/atoms/ProgressBar/index.ts` (new)
- `components/atoms/index.ts` (barrel export)
- `app/globals.css` (`--animate-progress-scan` + `progress-scan` keyframes in `@theme`)

**Implemented:**
- Linear: 8px sharp track, primary fill, width animates on §8 default duration on value change.
- Segmented: exact §6.2.5 treatment — 8px blocks, 2px gaps, filled `primary`, empty `surface-high` (`#1A222D`); filled count = round(ratio × segments); bar is `w-fit` so blocks stay exactly 8px.
- Indeterminate: sharp block sweeps the track (`animate-progress-scan`, 1.2s loop); value `null` to Base Root so `aria-valuenow` is omitted; static under the global reduced-motion reset.
- Label row: Caption label + Mono tabular percent; semantics from Base Root (`role="progressbar"`, aria-valuemin/max/now).
- Stories: Default (62%), Empty, Complete, Indeterminate, Segmented (12/20 filled), SegmentedComplete, SegmentedIndeterminate, WithLabel, VaultCapacity (2.4M/5M linear + 24-seg composite) — 9/9 play tests pass.

**Design system references:** DESIGN.md §2.5, §5.2, §6.1 (no rounded fills), §6.2.5, §8, §9

**Deviations from DESIGN.md (if any) and why:**
- New `--animate-progress-scan` token (1.2s `progress-scan` keyframes): DESIGN pins the segmented treatment but no indeterminate motion; a rectangular sweep matches the sharp/rectangular press-feedback language (AGENTS.md §7). Noted as extension, uses `--ease-eque`.
- Linear spec (8px height, surface-high track) is an extension: §6.2.5 only pins segmented; linear reuses the same track language so both variants match.
- Atom renders on Base Root directly, not the ui `Progress` wrapper: the wrapper auto-injects a linear Track+Indicator, which would double-render inside segmented/indeterminate branches.
- Non-interactive by design: no hover/press treatment applies (§7 is for clickable elements); loading = indeterminate variant.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (VaultCapacity uses text tickers only).

**Known gaps / follow-ups:**
- Test-runner flake again: full-file 9 failed in 293ms (`sb-vitest` dep-cache race on the new `@base-ui/react/progress` optimize), green 9/9 on immediate re-run. Rule stands.
- Playwright timing note: after adding a new Base UI dep, Storybook's Vite optimizer reloads once — wait for settle (or retry) before asserting; `networkidle` timed out during the reload, `load` + retry worked.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 9/9 ProgressBar story tests pass, no a11y failures
- [x] Playwright verified: 8px track #1A222D radius 0, primary fill 62% width, 20 blocks 8×8 with 2px gaps (primary filled / #1A222D empty), `progress-scan 1.2s` animation emitted, 375px VaultCapacity no overflow, zero console errors

## [Phase 1.14] Slider — 2026-09-23

**Files added/changed:**
- `components/ui/slider.tsx` (new: `SliderRoot/Control/Track/Indicator/Thumb` on `@base-ui/react/slider` + `sliderTrackVariants`/`sliderThumbVariants` cva, sizes sm/md/lg)
- `components/atoms/Slider/Slider.tsx` (new atom: controlled/uncontrolled, per-thumb labels, label + value readout)
- `components/atoms/Slider/Slider.stories.tsx` (new: 8 stories, 8/8 play tests)
- `components/atoms/Slider/index.ts` (new barrel), `components/atoms/index.ts` (export)
- `TASKS.md` (new 1.14 row; Phase 1 counter `0/13` → `10/14`)

**Implemented:**
- Sizes: sm (4px track / 12px thumb), md (8px / 16px), lg (12px / 20px); thumbs are sharp squares (`rounded-none`) with 2px `primary` border on `surface`, halo on hover, neon glow while dragging, 44px touch target (`h-11 w-11`).
- Track language shared with ProgressBar 1.9: `surface-high` (`#1A222D`) track, `primary` indicator; disabled dims indicator + thumb border to `border-strong` (`#384555`), no opacity wash.
- Orientations: horizontal + vertical (`h-40`, `aria-orientation="vertical"`); `thumbAlignment="edge"` default keeps edge thumbs inside track bounds.
- Keyboard free via nested native `input[type=range]` (arrows/Home/End); thumb focus ring via `has-focus-visible` (focus lands on the nested input, not the thumb div).
- Stories: Default, Controlled (allocation % with readout), Range (min/max band), MultiThumb (3 thumbs), Vertical, Sizes, Disabled, SlippageTolerance (step 0.1 + preset buttons) — 8/8 play tests pass.

**Design system references:** DESIGN.md §2 (tokens), §3 (Mono tabular readout), §6.1 (sharp, no pills), §8 (`duration-micro`/`ease-eque` only), §9 (focus-visible)

**Deviations from DESIGN.md (if any) and why:**
- Slider has no DESIGN.md spec (grayscaled search: no §7.x, no TASKS entry) — logged as 1.14 and styled as an extension: track tokens shared with the 1.9 progress bar, thumb = sharp square with 2px primary border (button-border treatment adapted to a draggable control).
- Atom owns controlled/uncontrolled + thumb count (`values.map` renders N thumbs); Base `onValueChange` union type (`number | readonly number[]`) is normalized to `number[]` internally, and raw React state setters in stories are wrapped — raw setters are not assignable to Base's handler type (TS2322).
- `defaultValue` is captured once via `useState` initializer and that stable reference is passed to Base Root: passing live state (or inline literals) changes the reference on re-render and Base logs an uncontrolled-defaultValue console error.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (SlippageTolerance presets are text buttons).

**Known gaps / follow-ups:**
- No `sb-vitest` dep-cache flake this run (8/8 first try); the re-run rule still stands for future new-dep tasks.
- `[role="slider"]` DOM queries match nothing: Base renders a native `input[type=range]` with an *implicit* slider role (no explicit `role` attr) — query `input[type="range"]` or Testing Library `getByRole` instead.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 8/8 Slider story tests pass, no a11y failures
- [x] Playwright verified: 480×8 md track `#1A222D` radius 0, primary indicator, thumbs 12/16/20px, vertical 8×160 with `aria-orientation`, disabled `input.disabled=true` + dimmed indicator, 375px `scrollWidth=375`, zero console/page errors across all 8 stories

## [Phase 1.10] Spinner — 2026-09-23

**Files added/changed:**
- `components/atoms/Spinner/Spinner.tsx` (new atom: `spinnerVariants` cva sm/md/lg, `role="status"` + `aria-label` + sr-only text)
- `components/atoms/Spinner/Spinner.stories.tsx` (new: Default, Sizes, WithLabel, LoadingPanel — 4/4 play tests)
- `components/atoms/Spinner/index.ts` (new barrel), `components/atoms/index.ts` (export)
- `TASKS.md` + `docs/PROGRESS.md` counters → Phase 1: 11/14

**Implemented:**
- Canonical pending indicator: same `LoaderCircle` glyph the Button (1.1) loading state uses, in `primary` at sm/md/lg = 12/16/24px (`size-3/4/6`), `animate-spin` (1s), `strokeWidth={2}`.
- A11y: outer span `role="status"` with **both** `aria-label={label}` (default "Loading") and an sr-only text node — `status` takes its accessible name from author only, never from contents (verified empty-name via CDP AX tree before the fix). Glyph `aria-hidden`.
- Motion: no component-level reduced-motion code needed — the global reset collapses the spin to 0.01ms/1 iteration (verified via `emulateMedia reducedMotion`).
- Stories: Default (name "Loading", svg hidden), Sizes (computed-style 12/16/24px asserts — bounding rect oscillates on a spinning glyph, so rect asserts are flaky), WithLabel ("Estimating gas fees"), LoadingPanel composite (surface panel + spinner + heading/body copy).

**Design system references:** DESIGN.md §2 (primary), §6.1 (radius 0 on svg), §8 (spin uses TW default 1s; reduced-motion via global reset)

**Deviations from DESIGN.md (if any) and why:**
- No DESIGN.md spinner spec exists (TASKS lists 1.10 as custom sm/md/lg) — extension: primary-on-dark LoaderCircle matches the Button loading precedent; color overridable via `className` merge.
- `name:` title override on LoadingPanel ("Loading panel (composite usage)"): the story id stays slug-derived from the export (`atoms-spinner--loading-panel`), only the display title changes.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None.

**Known gaps / follow-ups:**
- Button (1.1) still uses its own inline `LoaderCircle` spinner — unifying it onto this atom is a follow-up (visual parity must be preserved: Button sizes its svg via parent CSS, the atom sets explicit size).
- `storybook/test` `getByRole("status", { name })` needs the `aria-label`; content-only naming silently yields name "" in Chromium (not a Testing Library quirk — CDP confirms).

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 4/4 Spinner story tests pass, no a11y failures
- [x] Playwright verified: svg `primary` rgb(31,255,195), `spin 1s`, radius 0, reduced-motion collapses animation, 375px LoadingPanel `scrollWidth=375`, zero console/page errors across all 4 stories

## [Phase 1.11] Skeleton Loader — 2026-09-23

**Files added/changed:**
- `components/ui/skeleton.tsx` (new: depo-free `Skeleton` div, restyled sharp/tokenized)
- `components/atoms/Skeleton/Skeleton.tsx` (new atom: `skeletonVariants` text/card/row, `role="status"` + author label)
- `components/atoms/Skeleton/Skeleton.stories.tsx` (new: Default, TextLines, CardBlock, TableRow, VaultCardLoading — 5/5 play tests)
- `components/atoms/Skeleton/index.ts` (new barrel), `components/atoms/index.ts` (export)
- `TASKS.md` + `docs/PROGRESS.md` counters → Phase 1: 12/14

**Implemented:**
- Primitive strips all three shadcn defaults (`rounded-md`, bare `bg-muted` → oklch near-black): sharp `rounded-none` `surface-high` (`#1A222D`, the empty-block color shared with the progress track) pulse blocks, `animate-pulse` 2s loop.
- Variants: `text` single 16px line (`h-4 w-full`), `card` 96px block (`h-24 w-full`), `row` vault-table-style row (40px ticker square + 16px/12px line stack + right-aligned 64px figure, `gap-3`).
- A11y (Spinner-atom rule reused): blocks `aria-hidden`, wrapper `role="status"` with `aria-label` + sr-only text — `status` names never come from contents.
- Stories: Default (16px height + hidden asserts), TextLines (full/3-4/1-2 width stack), CardBlock (96px), TableRow (40px square), VaultCardLoading composite (name line + `h-16` chart override via tailwind-merge + TVL/APY pair).

**Design system references:** DESIGN.md §2 (surface-high), §6.1 (sharp), §8 (motion; pulse freezes via global reduced-motion reset)

**Deviations from DESIGN.md (if any) and why:**
- No DESIGN.md skeleton spec (TASKS lists 1.11 as `skeleton` base with three variants) — extension using the 1.9 empty-block token; `ui/skeleton.tsx` hand-written rather than CLI-scaffolded (depo-free div, no Radix wrapper to generate).
- `animate-pulse` is Tailwind's default 2s token; no §8 pulse token exists. Freezes correctly under reduced-motion (verified 0.01ms/1).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- Row variant uses a plain square block for the token-badge placeholder position (real ticker badges arrive with Vault Card 4.1).

**Known gaps / follow-ups:**
- Storybook dev server had died between sessions (compaction); restarted on :6006 (new PTY) before the visual check.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 5/5 Skeleton story tests pass, no a11y failures
- [x] Playwright verified: block `surface-high` rgb(26,34,45) radius 0, `pulse 2s`, reduced-motion collapses animation, 375px VaultCardLoading `scrollWidth=375`, zero console/page errors across all 5 stories

## [Phase 1.12] Divider — 2026-09-23

**Files added/changed:**
- `components/ui/separator.tsx` (new: Base UI Separator + orientation cva, `bg-border-subtle`)
- `components/atoms/Divider/Divider.tsx` (new atom, vertical stretches via `h-auto self-stretch`)
- `components/atoms/Divider/Divider.stories.tsx` (new: Default, Vertical, SectionBreak — 3/3 play tests)
- `components/atoms/Divider/index.ts` (new barrel), `components/atoms/index.ts` (export)

**Implemented:**
- The §4.3/§5.4 hairline: 1px `border-subtle` (`#1A222D`). Horizontal `h-px w-full` for section breaks; vertical `w-px` + `self-stretch` (stretches to flex-row height where `h-full` would collapse).
- Semantics from Base UI (`role="separator"` + `aria-orientation`); non-interactive, no hover/press.
- Stories: Default (1px height + hairline color asserts), Vertical (64px stretch in `h-16` row), SectionBreak composite (H2 + divider + body copy).

**Design system references:** DESIGN.md §4.3 (section separation), §5.4 (hairline), §6.1 (no radius needed — 1px line)

**Deviations from DESIGN.md (if any) and why:**
- None. `ui/separator.tsx` hand-written (same depo-free rationale as 1.11 skeleton; Base Separator has no extra deps beyond `@base-ui/react`, already installed).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None.

**Known gaps / follow-ups:**
- First Divider test run failed 3/3 (new `@base-ui/react/separator` dep-cache race, same signature as the 1.9 flake: fast full-file fail); green 3/3 on immediate re-run. Rule stands.

**Verification performed:**
- [x] `lint` passes (exit 0, zero warnings)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 3/3 Divider story tests pass, no a11y failures
- [x] Playwright verified: horizontal 1px `border-subtle` rgb(26,34,45), vertical 1px × 64px stretch with `aria-orientation`, zero console/page errors

## [Phase 1.13] Typography — 2026-09-23

**Files added/changed:**
- `app/globals.css` (added `--text-h5/--text-lead/--text-body-l` clamp tokens; new `.type-display/.type-h1…h5/.type-lead/.type-body-l/m/s/.type-caption` classes with exact §3.2 spec)
- `components/atoms/Typography/Typography.tsx` (new: Heading, Text, MonoNumber + cva variants)
- `components/atoms/Typography/Typography.stories.tsx` (new: HeadingLevels, HeadingWeights, TextVariants, Numbers, VaultHeader — 5/5 play tests)
- `components/atoms/Typography/index.ts` (new barrel), `components/atoms/index.ts` (export)
- `TASKS.md` + `docs/PROGRESS.md` counters → Phase 1: 14/14 (Phase 1 complete)

**Implemented:**
- Heading `display/h1–h5`: Mono, weights 700/700/600/600/600/500, fluid clamps, tracking −0.03→0, `text-primary`; `as` override (default: level, `display` → `h1`).
- Text `lead/body-l/m/s/caption`: Google Sans (Inter fallback), 400 weight, §3.2 leading; body `text-secondary`, caption `text-tertiary`; `as` defaults to `p`.
- MonoNumber: `font-heading tabular-nums`, inherits size, `text-primary`; `as` span/div/td for table use.
- Stories assert viewport-proof ranges for clamps (display 44–80 … h5 18–20) and exact px for fixed sizes (16/14/12), plus weights, families, caption color, tabular-nums, element mapping.

**Design system references:** DESIGN.md §3.1 (families), §3.2 (scale table — every value), §3.3 (sentence case, left-align, colors, tabular numbers, 65ch rule noted on Text)

**Deviations from DESIGN.md (if any) and why:**
- New CSS (tokens + `.type-*` classes) is the extension this task required: §3.2 pins exact leading/tracking no Tailwind utility reproduces, so exactness lives in `globals.css` (the token file), not arbitrary values in components. Utilities-layer `className` overrides still win over the plain-CSS classes.
- Emphasis/Strong (§3.2 inherit-size rows) have no dedicated props — covered by `className="font-medium"/"font-bold"` overrides; noted, not built.
- 65ch line-length is a container concern (`max-w-prose` in stories), not enforced by the atom.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None.

**Known gaps / follow-ups:**
- `storybook/test` Canvas has no `.container` — play DOM queries must use the `canvasElement` arg (TS2339); destructure only what the test uses (`no-unused-vars` warns otherwise).
- Story `name:` overrides change the display title only — iframe URLs stay export-slug-derived (`atoms-divider--section-break`, same lesson as 1.10 Spinner).
- Phase 1 is now 14/14 complete.

**Verification performed:**
- [x] `lint` passes (exit 0, zero warnings)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 5/5 Typography story tests pass, no a11y failures
- [x] Playwright verified: h1 56px/700/Mono, display 80px, h5 20px/500, body-m 16 / body-s 14 / caption 12 tertiary rgb(143,156,173), Google Sans body stack, mono tabular-nums, 375px VaultHeader `scrollWidth=375`, zero console/page errors

## [Phase 2.1] Stat Card — 2026-09-24

**Files added/changed:**
- `components/molecules/StatCard/StatCard.tsx` (new: label + h3 tabular value + optional trend row + loading)
- `components/molecules/StatCard/StatCard.stories.tsx` (new: Default, UpTrend, NoTrend, DownTrend, FlatTrend, Loading, PortfolioRow — 7/7 play tests)
- `components/molecules/StatCard/index.ts` (new barrel), `components/molecules/index.ts` (export)

**Implemented:**
- Card frame: L1 `surface` bg, hairline `border-subtle`, `rounded-none`, `p-5 md:p-6` (20px mobile / 24px desktop per §4.4), `flex-col gap-3`.
- Label: Mono 12px 500 tertiary (extends the Input label language at inline density); value: Heading `h3` (Mono 600, clamp 24–32) + `tabular-nums` so figures align (§3.3); `gap-2` label→value.
- Trend row (optional): Divider hairline + glyph + Mono 12px 500 text; up = ArrowUpRight/success, down = ArrowDownRight/error, flat = Minus/tertiary (icon + text, never color alone per §9); glyphs square-cap/miter per §7.9, `aria-hidden`.
- Loading: keeps the label, swaps value + trend for the Skeleton `card` block (`role="status"`, "Loading {label}").
- Non-interactive display card by design: no hover/press (same rationale as Divider/ProgressBar); no pixel motif (budget kept for Vault Card 4.1 featured variant).
- Stories use `formatCurrency`/`formatPercentage` from `lib/utils.ts`.

**Design system references:** DESIGN.md §2 (tokens), §3.3 (tabular numbers, sentence case), §4.4 (card padding 24/20, heading→paragraph 8–12), §5.1 (L1), §5.4 (hairline), §6.1 (sharp), §7.3 (card structure), §7.9 (square caps), §9 (status never color alone), §10 (375px)

**Deviations from DESIGN.md (if any) and why:**
- Label weight 500: §7.3 pins Mono 12px tertiary but no weight; 500 matches the Input label precedent (§11 forbids weights below 400 on dark).
- `value: ReactNode` (not string): lets consumers pass formatted strings or `MonoNumber` nodes; stories demonstrate both.
- No `featured` prop: TASKS 2.1 requires label/value/trend/loading only; brackets + 32px padding arrive with Vault Card 4.1 (YAGNI).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (stat card has no icon slot).

**Known gaps / follow-ups:**
- Render-only stories on components with required props need dummy `args` (TS2322) — same rule as Select 1.3 / RadioGroup 1.5; applied to PortfolioRow.
- Dev-server PTY died between sessions again; restarted on :6006 before the visual check.
- No sb-vitest dep-cache flake (no new deps added); 7/7 first try.
- 2.6 Percentage Change Indicator will be the full trend component; StatCard's inline trend row stays minimal so the two never diverge (AGENTS.md §8 one-pattern rule).

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds; dev server 200 on :6006
- [x] 7/7 StatCard story tests pass, no a11y failures
- [x] Playwright verified: surface rgb(13,18,25), hairline rgb(26,34,45), radius 0, 24px padding, label Mono 12 tertiary, H3 tabular Mono value, up rgb(91,227,125) / down rgb(255,107,107) / flat rgb(143,156,173), glyph aria-hidden, loading status "Loading Total value locked", 375px PortfolioRow scrollWidth=375, zero console/page errors

**Revision 2026-09-24 (primary stroke, per-user edit):** card frame is now `border-primary` (1px `#1FFFC3`, verified rgb(31,255,195) on all three PortfolioRow cards) instead of the hairline `border-subtle`. This deviates from DESIGN.md §5.4 (primary/accent border reserved for hover/selected) and raises per-card teal above the §11 ≤10%-per-viewport guidance when cards repeat — accepted as a user-directed edit; one-line revert to `border-border-subtle` if it reads too strong. Skeleton `card` variant deliberately keeps the subtle `surface-high` ghost (it's a placeholder, not a card). Re-verified: lint/build clean, 7/7 story tests pass (UpTrend border assert updated).

## [Phase 2.2] APY Pill — 2026-09-24

**Files added/changed:**
- `components/molecules/ApyPill/ApyPill.tsx`
- `components/molecules/ApyPill/ApyPill.stories.tsx`
- `components/molecules/ApyPill/index.ts`
- `components/molecules/index.ts` (added ApyPill export)

**Implemented:**
- Props: `apyBase`, `apyReward`, `apyBoost` (percent units), `side`, `className`; total = base + reward + boost.
- Total in a `brand` Badge via `MonoNumber` with `text-primary` override (tailwind-merge beats MonoNumber's `text-text-primary`, keeping the brand teal).
- Breakdown in Tooltip content: Base/Reward/Boost rows as tabular `MonoNumber` (reuses the 1.8 ApyBreakdown language — the real component, not a demo).
- Badge trigger carries `tabIndex={0}` so keyboard users can open the breakdown; Base UI clones handlers/ref/className (incl. focus-visible ring) onto the rendered element but can't make an unfocusable span focusable. No ref forwarded (atom renders no DOM of its own).
- Stories: Default (hover opens, teal assert, unhover closes), KeyboardFocus (tabindex assert, focus opens, Escape closes), ZeroApy, NoBoost, VaultApyRow composite (first three `getMockVaults()`).

**Design system references:** DESIGN.md §2 (brand tint), §3.3 (Mono 11px badge, tabular), §7.5 (badge), §7.8 (tooltip, 300ms delay), §9 (focus-visible ring)

**Deviations from DESIGN.md (if any) and why:**
- None.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- None (pill is text-only by design).

**Known gaps / follow-ups:**
- Story-test gotcha: `canvas.getByText` returns the inner MonoNumber span — focus assertions must climb to `closest('[data-slot="apy-pill"]')` first (KeyboardFocus failed 1× before the fix).
- Test expectations compute totals via `formatPercentage(base+reward+boost)` with the same arithmetic the component uses, so FP sums can't drift.
- FP check: 8.42+3.15+1.2 → toFixed(2) "12.77%" as expected.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds
- [x] 5/5 ApyPill story tests pass; 7/7 StatCard re-verified (primary stroke intact)
- [x] Playwright verified: 3 pills, brand tint bg rgba(31,255,195,0.08) + border rgba(31,255,195,0.32), radius 0, teal Mono 11px, totals 12.77/6.20/29.05% APY, tooltip "Base 8.42% Reward 3.15% Boost 1.20%", 375px scrollWidth=375, StatCard borders rgb(31,255,195) ×3, zero console/page errors

**Revision 2026-09-24 (negative total turns red, per-user edit):** a negative total (`total < 0`) flips the badge from `brand` to the `error` variant (status tint bg/border per §2.6) and the total from `text-primary` to `text-error`, both via the existing variant/merge paths — no new tokens. Red pairs with the minus sign (never color alone, §9); zero stays brand. New `NegativeApy` story (-8.2/1.5/0.2 → "-6.50% APY", asserts `data-negative` + red text + breakdown opens). `data-negative` attribute exposes the state for tests/consumers. Re-verified: lint clean, 6/6 story tests pass, Playwright error tint bg rgba(255,107,107,0.1) + border rgba(255,107,107,0.32) + text rgb(255,107,107), radius 0, zero console/page errors.

## [Phase 2.3] Token Amount Input — 2026-09-24

**Files added/changed:**
- `components/molecules/TokenAmountInput/TokenAmountInput.tsx`
- `components/molecules/TokenAmountInput/TokenAmountInput.stories.tsx`
- `components/molecules/TokenAmountInput/index.ts`
- `components/molecules/index.ts` (added TokenAmountInput export)

**Implemented:**
- Props: `token` (ticker badge + `decimals` cap), `balance`, `tokenPriceUsd?`, `label` (default "Amount"), `defaultValue`/`value`/`onChange` (string-level; uncontrolled by default), `error?`, `disabled?`, `id?` (auto `useId`, label stays associated via `htmlFor`), `className?`.
- Layout: label + "Available X SYM" balance line; field row = Input (number variant, `min-w-0 flex-1` wrapper) + neutral text ticker badge (`max-w-20 truncate` + `title`, SUPERLONG-safe) + tertiary sm Max; USD estimate (`MonoNumber`, `≈ $X.XX`, `$0.00` when empty) only when a price is provided.
- Max fills via exported `formatMaxValue` (no grouping separators, `decimals`-capped, no `toFixed` trailing zeros); fires `onChange` in both modes. Validation stays with the consumer — `error` passes straight to Input (`role="alert"`).
- Stories: Default, TypeToEstimate (letters stripped + USDC 6-decimal cap mid-typing), MaxFillsBalance (value + estimate + `onChange` spy), InsufficientBalance, LongTokenSymbol, ZeroBalance, Disabled.

**Design system references:** DESIGN.md §2 (tokens), §3.3 (Mono/tabular estimate), §6.1 (sharp; `rounded-sm` on the input only), §7.1 (tertiary button), §7.2 (input + error message), §9 (label association, focus rings), §10 (375px). No dedicated amount-input spec in DESIGN.md — composed from the Input + Button + Badge languages.

**Deviations from DESIGN.md (if any) and why:**
- None (new composition from existing tokens/patterns, noted as extension per AGENTS.md §3).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- Token shown as neutral text ticker badge (AGENTS.md §1 pattern).

**Known gaps / follow-ups:**
- Test gotcha: `getByRole("alert", { name })` does NOT resolve on the Input error paragraph in this runner — use the Input atom's own shape (`getByRole("alert")` + `toHaveTextContent`).
- Playwright iframe slugs derive from the story EXPORT name (`--max-fills-balance`), not the display `name` ("Max fills the balance").

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes (Next 16.3.6 Turbopack, TypeScript clean)
- [x] `build-storybook` succeeds
- [x] 7/7 TokenAmountInput story tests pass (green twice in a row)
- [x] Playwright verified: balance "Available 2.50 WETH", WETH badge, Max button, h-11 field with 4px radius, live estimate $6,250.00 after Max click (value "2.5"), 375px scrollWidth=375 on long-ticker story, zero console/page errors

## [Phase 2.3-rev] TokenAmountInput revision: token dropdown + mock art + slider — 2026-09-24

**Files added/changed:**
- `components/molecules/TokenAmountInput/TokenAmountInput.tsx`
- `components/molecules/TokenAmountInput/TokenAmountInput.stories.tsx`

**Implemented:**
- Props added: `tokens?` (default `[token]`), `onTokenChange?`; removed the text ticker badge. Field row is now Input (number variant) + `Select` atom (`triggerClassName="w-auto px-2.5"`, sr-only "Token" label gives the combobox its accessible name) + tertiary sm Max.
- Mock token art: shared `assets/example-mockup.png` via `@/assets` image import normalized to a URL (`TOKEN_ICON_SRC`), 20px sharp `<img aria-hidden>` in both trigger and popup rows — same placeholder pattern as the Select atom's stories, NOT an icon system (AGENTS.md §1 holds: no Token Icon component built).
- Percentage slider (`Slider` atom, `showValue` + `%` format): controlled `[percent]` derived from field/balance, `onValueChange` fills via `formatMaxValue`; two-way sync (typing updates readout, End/Home keys drive the field). Disabled when `disabled || balance <= 0`.
- Token switch keeps the typed amount re-capped to the new token's decimals (`sanitizeAmount`) and fires `onTokenChange`; parent owns balance/price swap (story demonstrates USDC 1250/$1 ↔ WETH 2.5/$2500).
- Stories: Default (+art/src/combobox/0% asserts), TypeToEstimate (+slider readout), MaxFillsBalance (+100%), InsufficientBalance (unchanged), TokenArt (replaces LongTokenSymbol — full SUPERLONG in trigger, no truncation), TokenSwitcher (popup USDC/WETH rows, switch asserts balance line + spy), SliderSetsAmount (End→"1250"/$1,250.00/100%, Home→"0"/0%), ZeroBalance (+slider disabled), Disabled (+combobox/slider disabled).

**Design system references:** DESIGN.md §2, §3.3, §6.1, §7.1, §7.2, §9, §10 — same composition as 2.3 base, plus the Select/Slider atom languages.

**Deviations from DESIGN.md (if any) and why:**
- Mock `example-mockup.png` art per user direction (placeholder, story-level pattern shared with Select stories).

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):**
- Token art = shared mock image in Select rows (user-supplied asset); no icon component abstracted.

**Known gaps / follow-ups:**
- Test gotchas: `aria-label` on the Select atom lands on the Root, NOT the trigger — name the combobox via the atom's `label` prop (sr-only span works: button is labelable). Base UI `onValueChange` types are `(string | null)` / `(number | readonly number[])` — handlers must accept the union. Popup is portaled: query with `screen.findByRole`, not `canvas`. Trigger label resolves a beat after mount — use `findByRole` in Default.

**Verification performed:**
- [x] `lint` passes (exit 0)
- [x] `build` passes
- [x] `build-storybook` succeeds
- [x] 9/9 TokenAmountInput story tests pass
- [x] Playwright: no overflow at 480px on Default/TokenSwitcher/SliderSetsAmount, 375px scrollWidth=375, popup column list with art renders, zero console/page errors

## [Registry] shadcn registry distribution pipeline — 2026-09-26

**Files added/changed:**
- `registry.json` (new) — distribution manifest: 18 items (14 atoms + `apy-pill`, `stat-card`, `token-amount-input` + `utils` lib)
- `package.json` — added `registry:build` script (`shadcn build`)
- `.gitignore` — added `/public/r` (generated output, rebuilt at deploy time)
- `AGENTS.md` — added §16 documenting the registry workflow

**Implemented:**
- Registry items use kebab-case names (`button`, `radio-group`, `apy-pill`, ...); components are `registry:ui`, shared utils is `registry:lib`.
- Each atom item bundles its Eque-customized primitive (`components/ui/*.tsx`) so the install is self-contained; file targets preserve the repo's atoms/molecules taxonomy (`components/atoms/Button/Button.tsx`).
- `dependencies` per item = exact runtime npm deps mapped from real imports (`@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react` as applicable).
- `registryDependencies` use the **namespaced** `@eque/*` form (NOT plain names). Verified 2026-09-26: plain names resolve against shadcn's default registry — the `button` test installed shadcn's scaffold `utils.ts` (1 line) instead of Eque's `lib/utils.ts` with formatters, and `apy-pill` failed outright on `typography`.
- Consumer setup: `"registries": { "@eque": "https://eque-ui.vercel.app/r/{name}.json" }` in `components.json`, then `npx shadcn@latest add @eque/button`.
- Vercel note: the Storybook deployment serves `storybook-static/`, not Next's `public/` — the deploy build command must be `npm run registry:build && npm run build-storybook && cp -r public/r storybook-static/r` so `/r/*.json` is served from the same deployment.

**Design system references:** N/A (distribution mechanism, no visual change).

**Deviations from DESIGN.md (if any) and why:** none.

**Excluded-component substitutions used (Token Icon / Network Icon / Avatar):** none (no component changed).

**Known gaps / follow-ups:**
- `token-amount-input` EXCLUDED from v1: the component bakes in `import mockupIcon from "@/assets/example-mockup.png"` and binary assets cannot be inlined into registry JSON. Unblock options: (a) add an `iconSrc` prop with the mock as default, or (b) switch to the AGENTS.md §1 text-ticker placeholder.

## 2026-09-26 — TokenAmountInput `iconSrc` prop + registry item (owner decision: option (a))
- Added optional `iconSrc?: string` to `TokenAmountInputProps`: decorative 20px artwork in the dropdown trigger/rows; renders nothing when omitted (ticker text carries identity, AGENTS.md §1 — no Token Icon component).
- Removed `import mockupIcon from "@/assets/example-mockup.png"`, `StaticImageData`, and the exported `TOKEN_ICON_SRC` from the component. Mock art moved to `TokenAmountInput.stories.tsx` (same normalize pattern as `Select.stories.tsx`), passed via `meta.args.iconSrc` to all stories.
- Added `token-amount-input` registry item: files `TokenAmountInput.tsx` only; deps `cn`; registryDependencies `@eque/utils` + atoms `@eque/button,input,select,slider,typography`. Registry rebuilt: 18 items / 19 JSON files, all parse.
- Verification: `npm run lint` pass; `npm run build` (next build + TS) pass; `npm run registry:build` pass. Browser story tests pending Playwright install in this environment.
- AGENTS.md §16 updated with the binary-asset pattern (URL prop + mock in stories).
- Theme CSS (`app/globals.css` tokens) is NOT distributed yet — consumers copy it manually for now. A `@eque/theme` registry item is a follow-up.
- New components added in later phases must get a registry item in the same pass (see AGENTS.md §16); consider adding that to the Definition of Done.

**Verification performed:**
- [x] `npm run registry:build` succeeds — 18 JSON files in `public/r/`, all parse as valid JSON
- [x] End-to-end install test into a scratch project: `npx shadcn@latest add @eque/apy-pill` (via `@eque` namespace) created 7 files (`ApyPill` + `badge`/`tooltip`/`typography` atoms + their primitives + Eque's `lib/utils.ts` with formatters), auto-installed npm deps, and every `@/` import in the installed files resolves to an installed file
- [x] `lint` not re-run (no component source changed); `build-storybook` unaffected (registry output is gitignored and independent)

## 2026-09-26 — TokenAmountInput: alignment fix + `showSlider` prop (owner request)
- Alignment: the input field and token dropdown were ~12px off (screenshot). Root cause: `label={<span className="sr-only">Token</span>}` — the span was sr-only but the Select atom's label *wrapper* is visible-height (`text-xs` ≈ 16px + `gap-2` 8px = 24px extra column height), pushing the trigger down under `items-center`. Fix: the sr-only `<label htmlFor>` now lives outside the Select (native association keeps the combobox's "Token" accessible name) and the Select gets no `label` prop — both columns are exactly 44px, pixel-aligned.
- New prop `showSlider?: boolean` (default `true`): `false` hides the percentage slider; field, Max, and estimate keep working. New `WithoutSlider` story asserts the slider is absent.
- Registry rebuilt (`token-amount-input` item now ships `showSlider`); `npm run lint` and `npm run build` pass. Browser story tests still unverifiable here (Playwright download blocked by proxy).
- Decision (owner: "bebas"): per-option `iconSrc` on the Select atom NOT added — `label: ReactNode` already covers icons and TokenAmountInput funnels `iconSrc` into the option labels. No API change.

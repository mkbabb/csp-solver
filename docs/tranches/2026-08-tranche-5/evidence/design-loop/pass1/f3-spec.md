# F3 SPEC — "one sheet, every width"

Pass 1 · SYNTHESIS lane · sources: `charter-f3.md`, `f3-research.md`, spot-verified against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` (GameScene.vue, scene.css read in full).

**Center, resolved**: one panel, one grammar, two axes. The four-times-audited ≥1024 right-edge drawer is untouched; <1024 the same single `GameControlPanel` mount becomes a fixed bottom under-sheet with three detents, dragged by direct transform writes and settled by the existing `useFlipGlide` on the existing glass curve. The stacked mobile card dies; the template fork dies; the dual-panel-instance hazard dies with it.

---

## D1 — Scope ruling (closes OQ4)

The ≥1024 axis stays horizontal and byte-identical: `useControlsDrawer.ts` keeps its §6 regime veto, `scene.css`'s ≥1024 block keeps the audit-4 fiction, the grow rungs and masthead ride stay. "One sheet" is honored at the *panel* level: one `<slot name="controls">` mount, one template, one motion vocabulary (`MOTION.curves.drawerGlide` @520ms — F1: byte-identical to the vaul/iOS sheet curve, so the sheet's motion needs **no new curve, no new named timing, no ratify row**). A bottom anchor at every width is REFUSED — it would raze the audited desktop fiction for zero brief coverage.

## D2 — Engine (closes C4/C5, honors the useFlipGlide no-edit risk)

Split gesture, both halves precedented in-estate:
- **Drag**: new `useSheetDetents.ts` in `games/shared` (OQ9: the panel is games-shared chrome; `useLongPress`/`useFlipGlide` already live there). `useLongPress`'s shape — capture-free pointer machine, slop 10px, `onScopeDispose` — with a `translateY` accumulator writing `el.style.transform` per `pointermove` (never CSS vars per-frame — vaul's recalc finding = the estate's own layerization rationale). `html.sheet-gesturing` promotes for the gesture window, arms no transitions — the `drawer-gesturing` model, axis-parallel.
- **Settle**: one `useFlipGlide.run()` per release — `from` = live drag delta (the accumulator, no rect read), `to` = identity over the new rest pose. `run()` supersedes in-flight glides, so flick-during-settle is free and the `reverse()` binary-flip limit (C5) never engages. Three detents = fresh `run()`s, never `retarget()`. `useFlipGlide.ts` is **not edited**.
- Detent pick at release: nearest by position, biased by velocity (>0.5px/ms picks the next detent in the flick's direction). PRM: no glide — snap the rest pose, done.

## D3 — Channel discipline (closes C3 + the keyboard collision; the dossier's strongest input)

The estate's own idiom, generalized: **rest pose on the `translate:` channel, gesture on `transform:`** (scene.css:76-82 verbatim precedent).

- Sheet anchor: `position: fixed; top: calc(var(--vv-height, 100dvh) * 1px)`… concretely `top: var(--vv-height, 100dvh)`; `left: 50%`; rest = `translate: -50% calc(-1 * var(--sheet-rest))`. When the keyboard opens, `--vv-height` shrinks → the sheet yields by anchor, translate untouched, any in-flight drag unperturbed. Never `bottom: 0`, never height-yield — a height change relayouts `.control-panel-filtered` and re-rasters its 3-pass filter.
- `useKeyboardViewport.ts` mints the second consumer: publish `--vv-height` alongside `--keyboard-inset` **in the same resize handler, vars before `ensureVisible`** — one listener, deterministic ordering (kills dossier risk Q5-2). `onFocusOut` eagerly resets both (the existing masking now also clamps the iOS 26 `offsetTop` non-reset for the sheet — rig-verify, owner E-row).
- `--sheet-rest` per detent is written **once at settle** (inline on the sheet) — discrete, not per-frame.
- First `env(safe-area-inset-bottom)` consumer in the estate: the sheet's bottom padding (`viewport-fit=cover` already set).

## D4 — Detents (closes OQ5; the budget forces it)

Full-height sheet, translate-revealed — **reveal, never per-detent reorder** (the dossier's three reasons stand: errorCheckMode same-value re-emit seam, `expandedPanel` locality, the filtered card's move-not-resize covenant).

| detent | `--sheet-rest` | visible |
|---|---|---|
| closed | `0.75rem` | 48px tongue only; board + masthead own the fold, zero document scroll |
| half | `14rem` (224px) | Marks (70) + play tools (58) + action row (52) + air — 180px of the ~196px budget; Marks is IN (the most-touched play control fits, so the "contested third" is settled by arithmetic) |
| full | `min(content, var(--vv-height) − 4rem)` | everything; the stage zone is the first content the half→full glide reveals — the NEW-GAME headline is the detent transition's own marginal reveal (mark 1) |

Source order, one order every width: **play zone → stage zone → prefs zone** (`.zone-play` / `.zone-stage` / `.zone-prefs` wrappers, `BoilDivider` between play and stage, `<hr>` before prefs). This inverts today's staged-first order on desktop too — deliberate: it's the family's answer to brief items 2/3 (preference-cadence controls sink; zones become the grammar), keeps DOM order = visual order = focus order (no CSS `order` a11y split), and is an owner-visible change on the audited surface → **owner row 1**.

## D5 — The single mount (closes the fork; C8 counts adopted as measured: 6 headings/5 rows)

- `GameScene.vue`: delete the `.mobile-board-width lg:hidden` mount (lines 79-86); `.scene-controls` drops `hidden lg:` gates and mounts the one panel at every width. It stays a sibling of `.board-peek-host` inside `.app-layout` inside `.board-group` — Trap 1 avoided by construction (never inside the peek host's mid-gesture `will-change` containing block) and gallery `v-show` gating + the F6 `scene-leaving`/`gallery-leaving` fades inherited for free (verified: `.scene-controls` is already an F6 fade target). `#controls-drawer` survives on the same node — most e2e anchors keep resolving.
- `GameControlPanel.vue`: one template. The five fork divergences resolve: washi hover chips and `KeyboardLegend` stay, gated `@media (hover: hover)` / fine-pointer (the estate's existing pattern — OQ7: no deletion this family); coarse font-size/row-vs-column styling moves from the `mobile` prop to media queries; `showTabs`/`expandedPanel`/`valueLabel`/`.mobile-heading-*`/heading-value readout **deleted** (~45 LOC — the full detent has room desktop-style; UI-12 was deliberate → **owner row 2**, OQ10 banked).
- `mobile` prop (13 files / 47 occurrences) deleted end-to-end. `useId` dual-instance comment retired with the hazard.

## D6 — Tab (closes C1 + C6 + Trap 3, OQ2)

Two axis-specific instances of one component, media-display-gated: the ≥1024 tongue untouched inside `.board-peek-host`; a new `edge="bottom"` variant mounted **inside `.scene-controls`** — it rides the sheet's translate/transform natively (no fifth mover), and the sheet (fixed, `z-index: 45`) is a stacking context that contains the tongue's `z-index: -1`, so C6 dissolves with **no** `.board-peek-host` hoist. Transpose is cosmetic: horizontal washi label, `top: -2.75rem`, 92×48 (≥44 floor holds), radius/clip-path flipped. C1 acknowledged: counter-motion already ships ≥1024; the sheet's tab needs none (it rides the sheet). Trap 3: a drag that exceeds slop sets a consumed flag; a capture-phase click handler on the tab swallows the trailing click (~5 LOC).

## D7 — Recognizer coexistence (closes Trap 2 / OQ1)

Drag surfaces v1: the tongue + the sheet card's top padding band + the `.peek-hold-surface` divider band (all natural `touch-action: none` zones). Arbitration needs **zero changes to the peek code**: the hold already self-cancels at 10px slop (`useLongPress` idiom); the sheet drag arms at the same 10px. Movement → drag wins; 350ms stillness → peek wins. The content pane keeps native scroll (`pan-y`); drag-down from the pane only when `scrollTop === 0` is deferred to a later slice — v1 doesn't drag from the pane at all. CRITIQUE keeps the "two recognizers, one band" failure mode on its checklist.

## D8 — Scroller premise (closes C7) & board fold (closes C2)

- The old `.controls-card` scroll idiom (already `overscroll-behavior: contain`) becomes the sheet's pane with a `<lg` arm: `max-height: calc(var(--vv-height, 100dvh) − var(--keyboard-inset, 0px) − 6rem)`. The "no inner scroll container" premise is re-cut in `index.css:388-390` and `e2e/mobile-platform.spec.ts:56` to "one contained inner scroller"; the `overscroll-behavior-y` assertion stays green.
- C2 adopted: the closed-detent win is **zero-scroll co-visibility**, not board growth. New scope, one line: a `<lg` height guard arm on the board shell — `max-width: min(<existing>, calc(100dvh − 11rem))` — so tall boards on short viewports never eclipse the tongue.

## D9 — Persistence (closes OQ3)

One key, widened codec: `csp-drawer-open` reads `"0"`→closed, `"full"`→full, anything else→half (<1024) / open (≥1024 — `"full" !== "0"` keeps the desktop read compatible). Sheet writes `"0" | "1" | "full"`. Legacy values land on half, never full.

## D10 — A11y & modes (inherited obligations)

`aria-expanded = detent !== closed`, truth at interaction; `inert` at closed (merged: `rowRegime ? drawerInert : sheetInert`); Esc settles to closed (the existing rail keydown, now live at every width); focus reclaim to the tongue on Esc-close. PRM snaps. `--keyboard-inset` still scrolls the focused cell via the untouched `ensureVisible`.

---

## CHANGE INVENTORY (all paths under `web/frontend/`)

| file | change | LOC |
|---|---|---|
| `src/games/shared/useSheetDetents.ts` | NEW — pointer drag machine, detent pick (position+velocity), `run()` settle, `html.sheet-gesturing` + `data-sheet` detent attr, storage codec, sheetInert, PRM snap | +~160 |
| `src/games/shared/GameScene.vue` | delete mobile mount; single `.scene-controls` mount all widths; bottom `DrawerTab` inside the sheet; wire `useSheetDetents`; merged inert/Esc; drop `:mobile` | −10 net |
| `src/games/shared/scene.css` | `<1024` sheet block (fixed, `--vv-height` anchor, translate rest, z-45, safe-area pad, pane max-height arm); delete `.mobile-board-width`; `sheet-gesturing` promotion | +~40 |
| `src/games/shared/GameControlPanel.vue` | fork → one template with three zone wrappers, play→stage→prefs; delete `showTabs` cluster; hover/fine media gates; drop `mobile` prop | −~200 |
| `src/games/shared/DrawerTab.vue` | `edge` prop + bottom transpose CSS; drag-consumed click suppression | +~30 |
| `src/games/shared/useKeyboardViewport.ts` | publish `--vv-height` (vars-before-ensureVisible ordering); focusout resets both | +~8 |
| `src/games/shared/GameBoard.vue` | one `<lg` height-guard arm | +2 |
| `src/App.vue` | retire the `.board-group` keyboard padding rule (consumer gone) | −8 |
| 5×`*Game.vue`, 2×`ControlPanel.vue`, `OptionSelector/PencilModeToggle/AssistSettings/AttributionCard` | strip `mobile` plumbing; coarse styling → media queries | −~40 / +~30 |
| `src/assets/index.css` | re-cut the scroller-premise comment | ±0 |
| `src/games/shared/useControlsDrawer.ts` | comment only: §6 non-goal re-opened, sheet sibling named | +2 |
| e2e: `drawer.spec.ts` (:278-295 describe), `mobile-platform.spec.ts` (iPad describe, vv-grep comment, keyboard fake drives `--vv-height`), `mobile-affordances.spec.ts` (selectors → sheet-at-full) | recut to sheet semantics | ±~60 test |

**Net-LOC sign: ≈ break-even, target ≤ 0** (deletions ~282 vs additions ~272 before test recuts) — and it retires a hazard class (dual panel instances/`useId`), the `mobile` prop's 47-occurrence reach, and the only unreachable-fold surface. **Goldens at risk: 0** (dossier-verified).

## OWNER ROWS

1. Desktop panel zone reorder play→stage→prefs (content-order change on the audit-4 surface).
2. `showTabs`/UI-12 closed-tab readout deletion (deliberate prior fix removed).
3. T3 "bottom-sheet non-goal" formally re-opened (`useControlsDrawer.ts:18` recut).
4. E-row: real-rig (`perf-rig-iphone16`) keyboard verification — iOS 26 `offsetTop` non-reset clamp, vv-resize vs `ensureVisible` frame ordering. The e2e vv fake can't catch either.

## PROTOTYPE SLICE (ordered; the smallest artifact that can FALSIFY the center)

A branch-local spike, ~120 LOC, **no** template unification, **no** tab variant, **no** storage — physics only:

1. `scene.css` <1024: `.scene-controls` → fixed sheet, `--vv-height` anchor, translate rest, hardcoded detents {48px, 224px, full}; temporary grabber strip.
2. Minimal drag inline in `GameScene` (pointer machine + direct transform writes + `html.sheet-gesturing`) with `useFlipGlide.run()` settle on release.
3. `useKeyboardViewport` publishes `--vv-height`.

Run on `perf-rig-iphone16` (hardware Safari, not the sim). **Falsifiers — any one kills or recuts the family**:
- **F-a** dragging over `.control-panel-filtered` re-rasters the 3-pass filter (paint storms / sustained <55fps in the timeline) → the filtered card can't ride a per-frame parent transform → center dies.
- **F-b** keyboard up: the sheet fails to track `--vv-height` (eclipsed, or lags beyond the keyboard's own animation) → the anchor model dies.
- **F-c** `run()` settle from a live drag pose shows the F1-phantom artifact class (pose jump at `fill:none` drop) → engine split dies; fallback = the scroll-snap substrate (dossier Q3, held in reserve).
- **F-d** iOS 26 `offsetTop` non-reset leaves the sheet mis-anchored after dismiss and the focusout clamp can't cure it → keyboard model recut.

## FAMILY SUCCESS TEST

On iPhone-16 geometry (393×~745 vv), `view === 'playing'`:
1. **Closed**: `documentElement.scrollHeight ≤ clientHeight` (zero scroll); board, masthead, tongue co-visible; tongue ≥44px.
2. **Half**: board fully visible AND Marks + Undo/Redo/Hint + Clear/Fill/Solve/Share all inside the vv at ≥44px targets.
3. **Drag**: rAF sampling during a scripted drag observes transform-channel mutation only (no layout/size mutation on the filtered card); rig timeline shows compositor-only frames.
4. **Settle**: the glide runs `cubic-bezier(0.32, 0.72, 0, 1)` @520ms — the one glass curve, inspected off the live animation.
5. **Keyboard** (e2e vv fake + rig): sheet top ≥ keyboard top at all times; focused cell stays clear via the untouched `ensureVisible`.
6. **One instance**: exactly one `GameControlPanel` in the DOM at every width; all 8 goldens byte-stable; `drawer.spec.ts` ≥1024 suite untouched and green.

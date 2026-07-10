# T2-W5 · Lane S3 — notes, layout, mobile (H5b′/H9/H2/H8/H6 + R3)

**Stamp**: 2026-07-10, working tree over HEAD `91bb8b0`, Apple M5 Max. Design lane on the Fable core; the `frontend-design` plugin skill was loaded via the Skill tool before any design work. All numbers below are from live Playwright probes against the dev server (geometry/count-based — load-insensitive; T2-W3's cargo runs were active and irrelevant to these measurements).

## Slate execution (Q8-final wording, verbatim scope)

| Item | Where | What landed |
|---|---|---|
| **H5(b′)** | `SolverErrorNote.vue` ×2 games | `onMounted → await nextTick() → scrollIntoView({block:'nearest', behavior:'smooth'})`; `behavior:'auto'` under PRM (one-shot `matchMedia` at show time). Toast clause struck per Q8 — markup, mount point, `role=alert`, persistence all untouched; only a `ref` on the existing root div. |
| **H9 in-flow-on-mobile** | `SudokuBoard.vue` / `FutoshikiBoard.vue` (+ `AnswerKeyLaminate.vue` interlock) | The board component root is now a `.board-shell` (carries the width classes); the square `.board-wrapper` and the `.board-margin` strip are siblings inside it. `<lg`: strip is in flow — its real height pushes the controls panel down. `≥lg`: `position:absolute; top:100%` — the overlay margin-strip exactly as before (no desktop layout shift). Interlock: the laminate anchored `inset:0` to `board-peek-host`, which now grows on mobile — re-anchored `top:0; left:0; width:100%; aspect-ratio:1/1` (identical on desktop, square-true on mobile; probe: laminate 351×351 == board 351×351). |
| **H2-elevation-only** | `HandwrittenLogo.vue` | `logo-menu-card cartoon-shadow-sm bg-card` → `cartoon-shadow-md bg-popover`, plus a dark hairline: `.dark .logo-menu-card { border-color: color-mix(in srgb, var(--color-foreground) 25%, var(--color-border)) }` (computed dark border ≈ srgb 0.357 vs the 16%-L token that vanished on the 6.5%-L popover ground). Placement half stays dead. |
| **H8-centering-only** | `App.vue` / `FutoshikiGame.vue` | `.app-layout { align-items: center }` (base — covers the row regime; the stacked column already centered). Probe: board-center − card-center = **−2 px** at 1440 (the cartoon-shadow translateY(−2px)). |
| **H6-shrunk** | `CelebrationStar.vue` (shared pencil — one copy serves both games) | 2.5 → **3.25 rem**, anchor preserved exactly: old `bottom:-2.75rem` put the top edge 0.25 rem below the board; new `top: calc(100% + 0.25rem)` keeps that top-left corner and grows down-right. No reposition, no burst. |

## R3 mobile

- **`md:` → `lg:`** at every iPad-portrait-clipping site: the board/controls row (`App.vue:178,200` + the paired `max-width:767px` scoped blocks → `1023px`; `FutoshikiGame.vue` twins) and the board width classes (`SudokuBoard.vue`/`FutoshikiBoard.vue` — the 85 vw/dvh caps ride the row regime). Probe at 768×1024: stacked ✓, board = panel = **672 px** (the md: 85vw board under-filled the 42 rem panel by ~19 px), horizontal overflow **0 px**, both games.
- **44 px tap-target floor** — shared block at the end of `index.css`, `@media (pointer: coarse)` only (fine pointers keep the compact pencil layout): `.logo-menu-item, .ctrl-btn, .mobile-heading-btn, .attribution-trigger, .error-note-retry { min-height: 2.75rem }` + `align-content:center` on the menu items. Probed on a touch context at 375: menu items **44, 44** (were 36.2), heading tabs 44, option rows 44, @mbabb 44, icon-btns already 44. Cells exempt (D12 arithmetic impossibility).
- **42×32 px logo-button↔toggle contention at 375** — root cause re-derived and confirmed: the centered wordmark+caret span (x 51→324) ran under the fixed 5 rem toggle (x 291→371, y −4→76); overlap ≈ the audit's 42×32. Fix: `@media (max-width:480px) { .corner-right { --toggle-size: 4rem } .masthead { margin-top: 0.75rem } }`. Probe: logo↔toggle overlap **null**, attribution↔toggle **null**.
- **One judgment call the slate didn't name**: the `--toggle-size: 8rem` rung at ≥768 died with the md row regime — at 768–1023 the 128 px fixed sun grazed the board's top-right frame in the new stacked composition. Stacked keeps the 5 rem sun; ≥lg keeps 13 rem. Probe at 768: toggle↔board overlap null, toggle↔logo null.

## Probes (all on the final tree)

- **H9 composition, 375, error state live** (worker route aborted → `solveState 'error'`): note card 343×64 in flow 35.6 px below the board; **panel top − note bottom = 20 px** (the 1.25 rem flex gap) — pushed down, zero overlay. Futoshiki twin: same numbers.
- **H5**: `scrollIntoView` recorded on the `.error-note` element — `{block:'nearest', behavior:'smooth'}` normal, `{block:'nearest', behavior:'auto'}` under emulated PRM. No focus movement (scrollIntoView moves none); alert announced on insertion as before.
- **Gates**: `vue-tsc -b` clean · `vite build` clean (out-of-tree outDir; tracked `dist/` untouched) · `eslint` clean on every touched file.
- **Screenshots** (own review, in `T2-W5-S3-shots/`): 375 both games, 375 menu-open (H2 + floored items), 375 error-note (H9+H5), 375 peek (laminate square), 768×1024 both games (no clip, sun clear), 1440 menu-open light + dark (hairline reads).

## Coordination notes

- **S2 overlap (HandwrittenLogo.vue)**: S2's H3/H4/I2 landed mid-lane; my H2 edits are disjoint (template class attr + the `.logo-menu-card` rule block) and were applied against S2's landed state. The 44 px floor for `.logo-menu-item` went through the shared `index.css` block (no scoped-rule touch). **Optional refinement left for S2**: with the coarse-pointer `min-height:2.75rem + align-content:center`, the scribble underline (content-box bottom) sits ~9 px below the centered text on touch devices; folding the floor into the scoped padding instead (`padding: 0.4rem 0.65rem 0.75rem`) would keep the underline glued to the text. Cosmetic, touch-only.
- **ControlPanel internals** (`md:items-stretch`, OptionSelector's `md:` text sizes) left at `md:` — the desktop panel instance is `hidden` below `lg`, so those classes only ever render ≥1024 where `md:` ≡ `lg:`; flipping them would be diff noise. Note: the *mobile* panel instance is now visible at 768–1023, where its previously-dead `md:text-[1.375rem]` option size activates — larger option labels on iPad, appropriate and probed non-clipping.
- **16×16 at 768–1023**: board caps at `min(52rem, 100vw−1.5rem)` vs the 42 rem controls card — the same width mismatch that already existed below 768 at HEAD; pre-existing shape, not widened by this lane.
- Dev server left listening on :3000 (shared per wave convention).

## Deviations (FAIL-EXPLICIT)

1. A `prettier --write` pass mid-lane resolved the owner's global `~/.prettierrc.json` (tabWidth 4, no project config exists) and reformatted whole files against the committed 2-space/single-quote style; fully reverted — files restored from HEAD/context and semantic edits re-applied in the committed style, then all gates + probes re-run green on the final tree. No formatting churn ships in this lane's diff.
2. The peek-hold surface (BoilDivider) wasn't floored — not in the L15 named set; its height is governed by the divider's own layout. Flagged as a possible follow-on, not acted on.
3. H5's PRM verification used Playwright's `reducedMotion:'reduce'` emulation + a `scrollIntoView` interception shim, not an OS-level setting.

# P-W3 — adoption

The app wave. Dominant sign: deletion. One commit per group, each carrying its own gate;
`^0.10.0` adopted at the top. Net LOC comfortably negative outside the budget files.

## File → change inventory

**Group A — the measured headline (r2 cause 1).**

| file | change | net |
|---|---|---|
| `pencil/glyph/HandwrittenGlyph.vue` | the `:filter` binding (line 348), the `grainOn` ref, and all six hoist/restore sites DELETED—r3 §4.2's missed third hoist (hover wiggle) dies by deleting the thing it hoists. `contain: paint` stays. If the ballot ruled B: `displayPath` becomes a `useBoilCache`-memoized `grainStrokeD(d, …)` per (char, variant), fixed sample count; wiggle/flourish/murmur morph ungrained variants and Vue's `:d` restores the grained rest pose—both behavioral deltas disclosed on the contact sheet | **−25** (B: ≈ +10) |
| `pencil/chrome/ScribbleLoader.vue` | filter attribute deleted—60 reference-filter re-executions/s on the surface the user watches while waiting; 2.2 px stroke at 24 px, the tooth is sub-perceptual (r3 §4.3), pair attached | **−1** |
| `games/shared/GameControlPanel.vue` | `.icon-btn` filter + `:hover` wobble deleted per the ballot (the wavelength argument: viewBox 24 vs 25-unit grain—a uniform nudge); `transition: all 150ms` → `background-color 150ms, color 150ms`; `.section-heading:hover` wobble deleted (re-ran the 3-pass panel filter over ~320×700) | **−8** |
| `pencil/chrome/OptionSelector/OptionSelector.vue` | `transition-all` → `transition-colors`; `.ctrl-btn:hover` wobble deleted | **−1** |
| `pencil/chrome/SvgFilters.vue` + `SvgFilters.test.ts` | `#wobble-celestial` / `#wobble-heart` lose their last clients → `ORPHAN_BASE_DEFS`; the existing orphan census is the enforcing config, moved in the same commit | **−12/+2** |
| `.control-panel-filtered` | per the G2.4 ballot; whichever ruling, encoded in `filterBudget.ts` in the ruling's commit | ballot |

**Group B — the theme swap (r2 cause 2).** `composables/useTheme.ts`:
`disableTransition: true` (+23.5 fps on the estate's worst scenario; the swap is covered by
the toggle's Bloom—frame strip attached). **±0**

**Group C — free wins, source-proved.**

| file | change | net |
|---|---|---|
| `assets/index.css:601` | `.cell-reveal-animated` `animation-fill-mode: both → backwards`—the 100% keyframe equals the cascade, but `scale(1)` computes to a matrix, so 35–81 cells carried an effect-sourced transform indefinitely (the best "iOS especially" mechanism, r3 §3.1). One token, zero pixels. `animatingCells` untouched | ±0 |
| `games/shared/gameCell.css:33,151,206` | same class: `marks-fade-in` ×2 provably redundant forwards fill → `backwards`; `ghost-draw-on` keeps `both` only if its end state differs from the cascade, else the value moves into the rule | ±0 |
| `pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | `.progress-pose` stack gated `v-if="progress > 0 && !solveSuccess"`—four invisible `<g>`s stop trading opacity over the board box 8/s forever (r3 §4.4) | +1 |
| `pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` | pin `font-variation-settings: 'opsz' 52` on the measuring text AND in the bake `<style>` (mark 4 M2—unclips all five labels, baked pixels unchanged); delete the `\|\| 72` fallback arithmetic (F2 owns it); toggle's twin fallback likewise | −2/+2 |
| `assets/fonts/fraunces-subset.woff2` | re-derived over all five labels—cmap gains m+n, the mid-word Georgia fallback in "thermo"/"kenken" dies, on page and in bake | asset |
| boil consumers (outline, tally, logo, toggle, gallery) | five `heldFrameCount` wraps—closes the latent hold-gate gap so the shipped laminate hold is actually total; contract repair, not perf | +5 |
| `pencil/config/pencilConfig.ts` | the grain-static disposition comment rewritten to the shipped truth, citing the budget | ±0 |

Conditional, banked: the control-panel twin `v-if` (one twin rendered via a `min-width:
1024px` MQL ref in `useCoarsePointer`'s file)—a style-recalc win, ships only if the
themeToggle floor is missed without it. Deliberately untouched: `BoilDivider` (frozen at
`fb15253d`—the thin-line 0.809 is exactly why it stays a frozen filter, not a bake),
PosterBoard/celebration transients (one raster each), `.sparkle-icon` (built-in interpolable
filter, benign).

**Group D — the invariant, the one place LOC rises on purpose.**
`src/pencil/config/filterBudget.ts` (+~20) + `e2e/filter-census.spec.ts` (+~60): the
exact-match per-selector allowlist (README §invariant) plus the forwards-fill source census,
enforced against the **built dist** in the existing e2e CI job, landing in the same commit as
the deletions it licenses.

## Gates

| gate | command + instrument | threshold | born-RED |
|---|---|---|---|
| G3.1 filter census | `npx playwright test filter-census` vs built dist | population == `filterBudget.ts` exactly; `board-cells` 0; total ≤ 14 | RED at base: 99–123 |
| G3.2 fill census | same spec, settled default state, plus source-level allowlist | zero animations whose fill supplies a computed transform; `both\|forwards` sites == allowlist | RED at base: 35–81 retained |
| G3.3 hover sweep + solve window | new rig scenarios at :4894 (`run-safari.sh <id> hoverSweep,solveWindow`), base minted first—numbers nobody has | hover jankMs → ~0 post-narrowing; loader window: reference-filter re-executions 60/s → 0 | RED once based |
| G3.4 wordmark integrity | e2e in WebKit vs built dist | all five labels' ink inside their viewBox; zero fallback-font glyphs in "thermo"/"kenken" | RED at base (all five clip; m/n missing) |
| G3.5 soul artifacts + owner audit | the P-W2 contact sheet + board composite re-minted on the adopted build; **blocking owner row, never banked** | owner pass; SSIM tripwire ≥ 0.98 with the negative control still redding | RED until minted |
| G3.6 estate green + goldens | full unit + e2e; glyph/icon/panel/logo goldens re-minted from the **runner artifact** only, non-author verify, darwin/linux pairs md5-distinct; gridPaths hoist fixture byte-equal if F3 shipped | all green | — |

The logo goldens **move by design**—mark 4 is the owner's complaint that they're soft—so that
re-baseline ships with before/after pairs and the mark cited, never as a silent re-mint.

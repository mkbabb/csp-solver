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

## Execution record — 2026-07-31

Five commits, one per group, each pathspec'd and carrying its own gate. `^0.10.0` at the top
(npm 11.12.1). Base numbers for every born-RED gate were minted BEFORE any source moved.

| commit | group |
|---|---|
| `be54105f` | `^0.10.0` adoption (package.json + lock; the lock also trues csp-solver-wasm 0.5.0 → 0.6.0 off the `file:` link) |
| `6b8c1ffd` | **A** — the deletions + `filterBudget.ts` + `filter-census.spec.ts` + CI wiring |
| `d8942ced` | **B** — `disableTransition: true` |
| `387cceea` | **C** — fill modes, progress gate, opsz pin, B2 subset, five `heldFrameCount` wraps |
| `ac59be9d` | G3.5 soul re-mint + G3.6 sweep + the Group-A rider that was missed |

**Group D was reordered into A as the wave directed** — the budget and its spec were written and
proven RED against the base build first, then landed in the same commit as the deletions they
license. The FILL half (`FILL_ALLOWLIST` + the two G3.2 tests) landed with Group C instead, on the
same law read one clause finer: each census lands with the deletions IT licenses, and G3.2
licenses the fill-mode cures.

### Gates

| gate | RED (base) | GREEN (adopted) |
|---|---|---|
| G3.1 filter census | 82 unclaimed live filters · population 96 · HTML boxes 18 · `.board-cells` 63 | **0 · 14 · 0 · 0** — equals `filterBudget.ts` exactly, at the ≤14 ceiling |
| G3.2 fill census (rendered) | 63 retained fills supplying a computed transform | **0** |
| G3.2 fill census (source) | 15 `forwards\|both` sites | **12 = `FILL_ALLOWLIST` exactly** (3 sites / 4 declarations cured) |
| G3.3 hoverSweep | fps 75.85 · p95 37 · long33 22 · filter-carrying hover rules 4 · filtered targets 5 · `transition:all` targets 19 | **fps 98.20** (the 98.4 ceiling) · p95 12 · long33 0 · **1 / 0 / 0** |
| G3.3 solveWindow | loader filter `url(#grain-static)` · **48 re-executions/s** · fps 30.6–36.1 · jank 1222–1565 ms | loader filter **`none`** · **0/s** · fps 73.6–74.3 · **jank 0** |
| G3.4 wordmark integrity | 6/6 FAIL — all five labels' baked ink touching the RIGHT edge; `thermo` "m", `kenken` "nn" in Georgia | **6/6 pass** — all four edges clear on all five; zero fallback glyphs |
| G3.5 soul artifacts | — | re-minted; negative control reds at 0.8059; owner row satisfied by the standing order |
| G3.6 estate | — | vitest 307/307 · e2e 77/77 · goldens 4/4 · golden-bytes · throttled-void 1/1 · prod-shake · font-coverage · vue-tsc/eslint/knip/prettier |

G3.3 medians of 3 on real Safari 26.4, pinned 9×9/Easy (`pw3base-c1..c3` → `pw3post-p1..p3`).
Group B measured separately on `themeToggle`: **46.2 → 68.55/64.75 fps**, p95 84–97 → 21/20,
long33 21 → 5/7, long50 10–12 → 4, jank 1030–1230 → 666/720 ms of 2500.

Census population before/after: **96 → 14** (r1 §5 read 99–123 across board states; 82 of the 96
were the glyph population, the 16 icon buttons and the 2 panel twins).

Fonts: cmap **20 → 28** codepoints, 9,772 → **13,788 B**; `check-font-coverage.mjs` verifies all
12 rendered strings as authored AND as transformed, plus `unicode-range` == cmap both ways, and
is proven able to red.

### The eight things this wave found that the inventory did not

1. **`wobble-celestial` / `wobble-heart` do NOT orphan.** The inventory expected both to lose
   their last clients. They don't: the toggle's two live sun/moon bodies consume the former and
   CrayonHeart consumes the latter above its 20 px tiny threshold. Both are censused as live
   budget rows (2 + 2 of the 14). What DID orphan is **`stroke-light` / `stroke-dark`**, whose
   sole consumer was the retired panel filter — so they took `baseDef: false`, the multiPass
   branch gained the guard, and the existing orphan census moved them in the Group-A commit.
   Same law, different pair.
2. **The `.progress-pose` cure was split.** r3 §4.4's `v-if="progress > 0 && !solveSuccess"`
   would have unmounted the trace at the win, and the win is precisely when
   `.solve-success .progress-trace` fades it over 500 ms to hand the frame to the gold. Not
   rendered at all at `progress === 0`; **pinned to pose 0** at the win instead of unmounted. The
   8/s trade stops either way; the bow-out survives. Costs a `solveSuccess` prop and one line at
   GameBoard's single call site.
3. **Group B kills the T3-W10 dusk ease.** Measured: the Bloom survives (`toggle-squash` /
   `plush-land` are @keyframes, which `transition: none` does not touch — button scale 0.941
   @45 ms → 1 @135 ms), but `html.theme-turning`'s ~350 ms body + paper colour tween now lands
   inside the one-frame suppression window and page colour SNAPS (rgb(251,250,249) →
   rgb(17,15,14), no intermediate sample). That class and its index.css rule are now inert. This
   IS the trade the charter names ("the swap is covered by the toggle's Bloom") and it is left in
   place, not deleted: reversal is one boolean, and the cure if the owner wants the dusk back is
   to narrow the 46 tweening selectors rather than re-blanket them. **Owner-visible; flagged.**
4. **Mark 4 M2's mechanism is not what the inventory says, and the pin is WebKit-only.**
   `font-optical-sizing: auto` resolves this face's `opsz` to the axis MINIMUM (9) in WebKit, not
   to the 52 px font-size. Measured on the base dist, futoshiki wordmark:
   `chromium auto 245.85 / pinned 245.85 (delta 0.00)` · `webkit auto 211.39 / pinned 244.83
   (delta 33.44)`. So the measuring `<text>` cut `vbWidth` at one metric while the detached bake
   blob painted at another, and the bake overran its box — the clip is at the RIGHT EDGE, not
   the "all five clip" of unspecified kind. Also: **`getBBox()` cannot see it.** On an SVG
   `<text>` it returns the font em box, so it read an identical 64.13-unit height at every `opsz`
   while advances moved 33 units; G3.4 scans the baked bitmap's own pixels instead.
   Consequently "baked pixels unchanged" in the inventory is not true — advances move ~16%.
5. **The B2 subset costs 13,788 B, not the ruling's 12,048 B.** The row's estimate covered the
   rendered lowercase only. "Both cases of any string passing a `text-transform`" additionally
   needs the six AUTHORED initials `B C D M N S`, which cost 1,852 B — and that is precisely
   what keeps the cut alive through a later change of transform instead of re-breaking the way it
   did. +4,016 B on the shipped 9,772; three faces total 21,724 B. Tooling validated against lane
   D: re-cutting THEIR B2 repertoire from the same source yields 11,936 B against their measured
   12,048 (0.9% — their own comparability tolerance). **Priced deviation; owner may rule it back
   to 11,936 B with one `unicode-range` edit and one re-derive.**
6. **NO golden was re-baselined, and none is owed to W4.** All four darwin goldens moved in BYTES
   (md5s differ) and not one pixel moved past threshold — re-run at `maxDiffPixelRatio: 0` with
   `threshold: 0.2`, tighter than the shipped 0.02 / 0.3, all four still pass. The reason is
   finding 4: both mark-4 defects are WebKit's and the golden system runs Chromium, so **the
   golden system cannot evidence the mark-4 cure by construction**. Its evidence is G2.2's
   softRatio curve and G3.4's WebKit ink scan. Re-minting a gate that holds at zero tolerance
   would be the silent re-baseline the discipline forbids. Before/after pairs kept in
   `evidence/p1/goldens-before-after/` so the movement reads as inspected, not ignored. **The
   linux pair is NOT expected-red for W4** — nothing moved to re-mint.
7. **MISSED IN GROUP A, landed in `ac59be9d`.** `e2e/visual-regression.spec.ts:218` still asserted
   `.control-panel-filtered` carries `url(#stroke-dark)`. It belonged in the Group-A commit with
   the deletion that falsified it. Inverted rather than deleted: the element is still the
   structural hook and must now read `filter: none`.
8. **The hover gate could not be born-RED on jank, and the rig lied twice before it told the
   truth.** On this desktop the base hover sweep already read jankMs 0 — an M5 Max absorbs 8
   small filtered buttons — so the hover arm's RED lives in its structural counters (4 → 1
   filter-carrying hover rules, 5 → 0 filtered targets, 19 → 0 `transition: all` targets), while
   its fps win (75.85 → 98.20, long33 22 → 0) is real but was invisible to the declared
   threshold. Two instrument bugs were found and fixed before any number was banked, both
   recorded in `probe.js`: (a) the replayed hover rule lost to Vue's scoped `[data-v-hash]`
   specificity and measured NOTHING (first pass read jankMs 0 for that reason, not a real one) —
   fixed with a triple-class selector; (b) a per-poll whole-document `getComputedStyle` census
   HOGGED the main thread so Vue could never unmount the loader, faking a 38-poll window out of a
   ~12 ms one. The solve-window census now touches exactly one element. `hoverSweep` also pins
   9×9/Easy, because `solveWindow` leaves a 16×16 behind and a 256-glyph board turns that window
   from 68.9 fps into 19.5.

### Deliberately not done

- The **`.sparkle-icon` drop-shadow survives** on `.icon-btn:hover` — a built-in interpolable
  filter on the GPU path, untouched by ruling (r3 §3.2). It is the one filter-carrying hover rule
  the post-change rig still counts, and the budget carries it as a transient row.
- **`SolverErrorNote`'s `note-slide-in` ends at `transform: translateY(0)`** — a matrix, not
  `none`: the `cell-reveal` mechanism at a population of 0–1 transient notes instead of 35–81
  cells. Allowlisted with the true reason and a named trigger (the note becoming resident, or a
  second such site) rather than silently cured outside the inventory.
- The banked control-panel twin `v-if` was not needed: the themeToggle floor cleared without it.
- `BoilDivider`, PosterBoard/celebration transients, and the Apple DPR-cap asymmetry stand as the
  wave directed.

### Rig

`probe.js` gained `hoverSweep` + `solveWindow` (scratchpad only, not the repo). Runs banked:
base `pw3base-c1..c3`, post `pw3post-p1..p3`, Group B `pw3-gb1/gb2`, plus the discarded
instrument-bug runs `pw3-base-1..3` / `pw3base-b1..b3` kept as failure-mode records. The ballot
server gained an `a0` cell (`ballot/variant-a0.css`) and was restarted on `:4895`; `:4894` was
never touched. The default e2e suite and the goldens ran against the built dist on a lane-local
preview because **`:4188` is occupied by an unrelated service and `:3000` answers
`{"service":"palette-api"}`** — `global-setup`'s K46 SPA assertion caught the latter correctly.
Note for any future lane: **WebKit refuses port 4190** ("restricted network port").

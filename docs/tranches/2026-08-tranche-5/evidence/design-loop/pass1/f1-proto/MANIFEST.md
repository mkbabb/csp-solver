# F1 "CADENCE STRATA" — PROTOTYPE MANIFEST (pass 1)

Ordered slice built per `f1-spec.md` §Prototype slice. Nothing under the project tree was
touched: every code artifact is a copy of the real file with the change applied, sitting beside
a unified diff against the original. Real paths in the tables are relative to
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend`.

## VERDICT

**The center survives — with one measured correction and two named residuals.** All four
falsification tests pass. The correction: the ≥lg left-flank strip pose is **off-screen through
1279px** and the seam moves to **1280**, with the already-built fixed tray covering 1024–1279.
Nothing else in the spec's decision set moved.

---

## 1 · ARTIFACTS

| Artifact | Status | How |
|---|---|---|
| `real-diffs/GameToolbar.vue` | **SPEC-COMPLETE CODE** (new file, unbuilt) | Real Vue SFC against the real imports (`@pencil/grid/HandDrawnOutline`, `@pencil/chrome/icons/{Undo,Redo,Hint}Icon`, `@games/shared/useAssists`). Not type-checked — the slice deliberately never enters the project tree, so `vue-tsc` can't see it. |
| `real-diffs/GameScene.f1.vue` + `diffs/GameScene.diff` | **SPEC-COMPLETE CODE** | `#toolbar` slot inside `.board-peek-host`, `toolbarEl` ref piped into `registerDrawerScene`, the `.in-live-face` kill rule, the zero-box `.toolbar-slot`. |
| `real-diffs/useControlsDrawer.f1.ts` + `diffs/useControlsDrawer.diff` | **SPEC-COMPLETE CODE** | Scene shape gains `toolbar`; the fifth counter-scale mover + the `position === "absolute"` gate. |
| `real-diffs/scene.f1.css` + `diffs/scene.diff` | **SPEC-COMPLETE CODE** | `.game-toolbar` added to all three fade selector lists; the `<lg` tray occlusion reserve; the `.controls-card` cap annotated for deletion at the rewrite (kept through the measurement slice — it is *how* `scrollHeight === clientHeight` is askable). |
| `real-diffs/SudokuGame.f1.vue` + `diffs/SudokuGame.diff` | **SPEC-COMPLETE CODE** | Sudoku alone wired: `#toolbar` mount, four emits routed to the existing composable seams. |
| `real-diffs/GameControlPanel.f1-measure.vue` + `diffs/GameControlPanel-measure.diff` | **MEASUREMENT SCAFFOLD** (slice 3, not the rewrite) | Six `v-if="false"` marks: `PencilModeToggle` ×2, `AssistSettings` ×2, `.play-controls` ×2. |
| `real-diffs/OptionSelector.f1.vue` + `diffs/OptionSelector.diff` | **SPEC-COMPLETE CODE** | `mobile` prop deleted, vertical branch deleted, one size ramp, `flex-wrap` on the row. |
| `mock/f1-mock.html` | **RUNS** | Open in any browser: `open mock/f1-mock.html`. 62,039 B, fully self-contained (the three real subset faces are data-URI'd with their real `unicode-range`s; every token, every geometry rule copied verbatim). Live rig top-right; scriptable via `window.__f1.{set,read,glide,scaleProduct,stripWidth}`. |
| `measure.mjs` `measure-b.mjs` `measure-c.mjs` `measure-d.mjs` `shoot.mjs` | **RUN** | `node measure.mjs [chromium\|webkit]`. Playwright 1.61.1 borrowed read-only from the project's `node_modules`. Results banked as `results-*.json`. |
| `shots/*.png` (9) | **RUN** | `node shoot.mjs`. Baseline vs F1 at 1024×768 / 1440×900 / 390×844, both toolbar poses, keypad-raised, gallery face. |

Source of the mock (edit these, re-run the builder block at the end of this file): `mock/f1-mock.body.html`, `mock/f1-mock.css`, `mock/f1-mock.js`, `mock/_fonts.json`.

---

## 2 · FALSIFICATION RESULTS

### (b) Desktop card scroll death — **PASSES, but only with BOTH changes**

`.controls-card` `scrollHeight − clientHeight`, px (`results-chromium.json`):

| variant | 1024×768 | 1440×900 |
|---|---|---|
| baseline (today) | **+430** | **+371** |
| three rows off, vertical selector | +42 | 0 |
| vertical selector → horizontal, rows kept | +190 | +131 |
| **rows off + horizontal (F1)** | **0** ✓ | **0** ✓ |

Spec §5 claimed the vertical `OptionSelector` was *the* root cause. It is the larger single
term (−240px at 1024) but **neither change alone clears 1024×768**. The requirement is
conjunctive, which strengthens §6: the 122-line branch unification isn't a bonus, it's the
other half of the fix. Card width grows 270.2 → 346.0px (the horizontal row is wider) — and
that widening is what kills the left-flank pose below.

### (a) Mobile tray with the OS keypad RAISED — **PASSES**

390×664, `--keyboard-inset: 336px` (iPhone 16 portrait keypad):

- keypad top edge **339** · tray bottom **331** · **clearance +8px** ✓
- all four tap targets ≥44×44 (44/44/44 and 48.1×44 for Check) ✓
- page height 1.490 → **1.061 viewports** (spec target ≤1.15) ✓
- stacked card height 571.5 → **281.1px** (−290.4)
- 390×844 (the real layout viewport): **1.000 viewports**, tray clear of the card entirely.

### (c) Glide fidelity — **PASSES**, 5 movers, both engines

Two full open/close cycles, 5 samples per glide, `host × toolbar` scale product:

| | 1280×800 | 1440×900 | 1920×1080 |
|---|---|---|---|
| movers enrolled | 5 | 5 | 5 |
| max \|1 − product\| | 0.01% | 0.18–0.19% | 0.18–0.19% |
| strip-width drift | 0.01px | 0.12–0.13px | 0.13px |

Identical to 2 decimal places on **chromium and webkit** (`results-c-*.json`). Zero writes to
the `translate:` channel by any mover — the tray's centering lives there, the strip's pose on
`transform`, and they are media-exclusive.

### (d) Gallery-face vanish — **PASSES**

`.board-peek-host.in-live-face :deep(.game-toolbar) { display: none }` — toolbar invisible on
the card face, visible again when the host parks home, at every width, both engines.

---

## 3 · THE ONE KILL, AND WHAT REPLACED IT

**Spec decision 3's ≥lg pose (`right: calc(100% + 0.75rem)` from 1024) is dead.** Measured
strip left-edge x with the drawer OPEN (`results-b-chromium.json`):

| width | left flank | + 4.25rem host gutter | board's top edge |
|---|---|---|---|
| 1024×768 | **−69.9px** ✗ | **−8.8px** ✗ | on-screen, but **collides with the masthead** ✗ |
| 1180×820 | **−18.8px** ✗ | +15.3 ✓ | ✓ |
| 1280×800 | +40.7 ✓ | ✓ | ✓ |
| 1440×900 | +103.8 ✓ | ✓ | ✓ |
| 1920×1080 | +341 ✓ | ✓ | ✓ |

Arithmetic: at 1024 the row is board 608 + gap 56 + card 346 = 1010px, leaving ~7px of side
slack against a strip that needs 65 + 12. A gutter wide enough for 1024 pushes the row past the
viewport. The top edge clears horizontally at every width but the 768-tall viewport gives the
board 608 of 768px, and the remaining 160 belongs to the masthead — the strip lands in it.

**Resolution (one number, zero new poses):** the strip's media query becomes
`@media (min-width: 1280px)`. 1024–1279 keeps **pose 1**, the fixed tray — already built,
already measured, and honest in the row regime too (`results-d-chromium.json`):

| | 1024×768 | 1024×900 | 1180×820 | 1279×700 |
|---|---|---|---|---|
| occludes the controls card | 0px | 0px | 0px | 0px |
| page height | 1.0 vp | 1.0 vp | 1.0 vp | 1.0 vp |
| overlaps the margin-voice *band* | 27.4px | 0 | 32.4px | 32.8px |

The band overlap is empty space: the margin voice is left-aligned at the board's left edge, the
tray is viewport-centered. Consequence for the composable: the drawer regime starts at 1024 but
the strip pose at 1280, so the fifth mover is gated on
`getComputedStyle(toolbar).position === "absolute"` — animating a viewport-anchored tray would
drag it sideways every gesture.

---

## 4 · RESIDUALS (named, not fatal)

1. **The tray eclipses the keyboard-avoidance landing zone.** `useKeyboardViewport`'s
   `computeScrollDelta(cell, band, gap = 24)` seats a focused cell 24px above the band's bottom
   — inside the tray's 273–331px range at 390×664. The mechanism already takes the argument:
   F1 must pass `gap = 24 + trayHeight` (≈ 66). One call-site change, no new machinery.
2. **The `<lg` fixed tray eats the card's foot at the bottom of a scrolling page** — 65.6px at
   390×664. `scene.f1.css` reserves it (`.app-layout { padding-bottom: 4.25rem }` <1024), which
   costs 1.061 → 1.163 viewports at 390×664, **0.013 over** the spec's ≤1.15. At 390×844 and
   430×932 the reserve is free (page already 1.000 vp, zero overlap). Trim to 3.5rem lands 1.15
   exactly; the honest number is reported rather than the tuned one.
3. **The 0.75rem gutter breathes by hostScale during the glide** (10.9 → 12.0px at 1024-class
   scales), inherited from the tab's `left: calc(100% - 0.5rem)`. The `transform-origin:
   100% 50%` on mover 5 pins the board-facing seam; the outer edge carries the ~1px. Below
   perception, recorded for completeness.

---

## 5 · NET LOC

**The slice itself is additive by construction** — it adds the toolbar and scaffolds the
measurement without paying the panel rewrite:

| file | as-written | code-only |
|---|---|---|
| `GameToolbar.vue` (NEW) | +285 | +189 |
| `GameScene.vue` | +34 / −0 | ~+14 |
| `useControlsDrawer.ts` | +32 / −1 | ~+8 |
| `scene.css` | +20 / −3 | ~+6 |
| `SudokuGame.vue` | +20 / −0 | ~+9 |
| `OptionSelector.vue` | +13 / −5 | −6 |
| `GameControlPanel.vue` (scaffold, reverted at rewrite) | +9 / −4 | +6 |
| **slice total** | **+400** | **+226** |

**Projected full-family net, from measured spans** (not the spec's estimates — every deletion
below is a counted line range in the real files):

| file | Δ | derivation |
|---|---|---|
| `GameControlPanel.vue` | **−302** | mobile branch L330–526 = 197 lines deleted outright; desktop branch L529–710 = 182 becomes the ONE template minus PencilModeToggle (1) and `.play-controls` (29) → −30; script (`showTabs`, `headingClass`, `valueLabel`, `expandedPanel`, the dead import) −17; CSS `.play-controls` L911–928 = 18 + `.mobile-*`/`.heading-value` L930–973 = 44 → −58 |
| `PencilModeToggle.vue` | **−47** | file deleted (32 code lines) |
| `AssistSettings.vue` | **−26** | candidates row + `CANDIDATE_OPTIONS` + handler + model (the file is only 91 lines; the spec's −46 was not available) |
| `useAssists.ts` | **−11** | `ERROR_CHECK_CYCLE`, `cycleErrorCheckMode`, `toggleCandidates`, two returns |
| `OptionSelector.vue` | **−6** | code-only |
| `scene.css` | **+12** | +17 (fades, tray reserve) −5 (the cap block, deleted at the rewrite) |
| `GameToolbar.vue` | **+285** | as written |
| `GameScene.vue` / `useControlsDrawer.ts` | **+66** | as written |
| 5 × game `#toolbar` mount | **+100** | SudokuGame measured at +20, ×5 |
| **PROJECTED NET** | **≈ +71** | |

**This is the family's parsimony problem, stated in numbers.** The charter's binding test — "the
family wins only if net LOC falls" — is **not met by the spec's own estimate set**. Where the
spec projected −200…−280, the measured spans give ≈ +71. The two gaps: the panel's deletable
mass is −302, not −520 (the two branches are 379 lines total, not 520), and the toolbar as
written in the house register is 285 lines, not 130. Routes back to negative, each real:
comment density on the new toolbar to the panel's own ratio (−60), the 5× mount collapsed into
`GameScene` mounting `GameToolbar` itself behind a `toolbar?: false` opt-out (+100 → +12,
saves 88), and the `KeyboardLegend`/`SheetWashiLabel` duplication the ONE template retires
(unmeasured). Sum of the two counted ones: **≈ −77**, i.e. net ≈ **−6**. Marginal. **CRITIQUE
must rule on whether F1's real-estate and reachability wins justify a net-neutral LOC family**,
because the measurements say net-negative is not free here.

Frozen and unedited: `share-truth.spec.ts:57` `nth(4)`. The card's `.icon-btn` order is
Deal · Clear · Fill · Solve · Share and the deleted `.play-controls` row sat *after* Share, so
index 4 is untouched. All 35 `.controls-card`-scoped e2e locators keep their premise (the double
mount stays).

---

## 6 · REBUILDING THE MOCK

```
cd mock && python3 - <<'EOF'
import json
F=json.load(open('_fonts.json'))
R={'fraunces-subset.woff2':('Fraunces','normal','100 900','font-stretch:100%;','U+0020,U+0042,U+0044,U+0053,U+0061,U+0063-0064,U+0065-0066,U+0068,U+0069,U+006B,U+006C,U+006F,U+0072-0074,U+0075,U+0079,U+007A'),
   'firacode-subset.woff2':('Fira Code','normal','300 700','','U+0020,U+0031,U+0034-0037,U+0039,U+0040,U+0045,U+0048,U+004D,U+0061-0062,U+0064-0065,U+0069,U+006D,U+0072,U+0073,U+0075,U+0079,U+00D7'),
   'patrickhand-subset.woff2':('Patrick Hand','normal','400','','U+0020-0021,U+0027,U+002D-002E,U+0030-0039,U+003F,U+0043,U+0052,U+0053,U+0061-0069,U+006B-0077,U+0079-007A,U+00D7,U+2014,U+2026')}
faces=''.join(f'@font-face{{font-family:"{n}";font-style:{s};font-weight:{w};font-display:swap;{x}src:url(data:font/woff2;base64,{F[k]}) format("woff2");unicode-range:{u};}}\n' for k,(n,s,w,x,u) in R.items())
css=open('f1-mock.css').read(); body=open('f1-mock.body.html').read(); js=open('f1-mock.js').read()
open('f1-mock.html','w').write(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>F1 cadence-strata — falsification mock</title>
<style>
{faces}
{css}</style></head><body>
{body}
<script>
{js}
</script></body></html>
''')
EOF
```

## 7 · WHAT THE MOCK IS NOT

Real Safari on `perf-rig-iphone16`. The keypad inset is *simulated* (`--keyboard-inset` set to
336px directly), so what's proven is the **geometry** — that a tray anchored to
`calc(var(--keyboard-inset) + env(safe-area-inset-bottom) + 0.5rem)` clears the band by 8px and
keeps 44px targets. What is **not** proven is that iOS Safari publishes a truthful inset
mid-entry; that is `useKeyboardViewport`'s shipped `visualViewport` path and the one remaining
device row in spec §Prototype slice 4(a). The mock also carries no live SVG filters, no boil
beat, and no Vue — it is a geometry and motion rig, not a soul rig.

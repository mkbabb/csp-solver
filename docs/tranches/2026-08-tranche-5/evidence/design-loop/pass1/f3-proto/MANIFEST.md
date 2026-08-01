# F3 PROTOTYPE — MANIFEST

Pass 1 · PROTOTYPE lane · family F3 "one sheet, every width".
Source of truth: `../f3-spec.md` §PROTOTYPE SLICE (ordered items 1-3) + §FAMILY SUCCESS TEST.
**The project tree was not modified.** Every real file appears here as an `.orig` copy and an
`.f3` copy; `real/f3-spike.diff` is the unified diff between them at real repo paths.

---

## ARTIFACT LEDGER

| artifact | status | how |
|---|---|---|
| `real/scene.f3.css` | **RUNS** (parsed + transpiled) | `postcss.parse` OK (23 rules / 4 at-rules); `lightningcss` OK vs `safari ≥15, ios_saf ≥15, chrome ≥110, firefox ≥110` — **0 warnings**. Rendered live in the mock (WebKit). |
| `real/GameScene.f3.vue` | **RUNS** (compiles) | `@vue/compiler-sfc` `parse` OK · `compileScript({inlineTemplate:true})` OK (43 bindings, was 19) · `compileTemplate` 0 errors · TS syntax 0 errors. Harness: `measure/check-sfc.mjs`. |
| `real/useKeyboardViewport.f3.ts` | **RUNS** (compiles) | TS syntax 0 errors. Its `anchorPx()` maths run live in the mock. |
| `real/f3-spike.diff` | SPEC-ONLY (a diff) | 342 lines, 15,429 B; applies at `web/frontend/src/games/shared/{scene.css,GameScene.vue,useKeyboardViewport.ts}`. |
| `mock/f3-sheet.html` | **RUNS** — open it in a browser | 34,350 B, fully self-contained (tokens, √φ ladder, the 3-pass `stroke-light`/`stroke-dark` filters, board, sheet, physics, a rig HUD). Zero network. `file://` works. Rig buttons: closed / half / full / keyboard / theme. Console API: `window.__f3`. |
| `measure/measure.mjs` | **RUNS** | `node measure.mjs` — headless **WebKit** (playwright `webkit-2311` from the frontend's own `node_modules`), 393×745 @ dsf3, `isMobile`+`hasTouch`. Writes `results.json` + 7 PNGs. 0 page errors. |
| `measure/loc.mjs` | **RUNS** | `node loc.mjs` — net-LOC + the ≥1024 byte-identity audit. Writes `loc.json`. |
| `measure/check-sfc.mjs` | **RUNS** | `node check-sfc.mjs` — SFC/TS compile gate. |
| `measure/results.json`, `loc.json` | data | outputs of the above. |
| `measure/shot-{light,dark}-{closed,half,full}.png`, `shot-light-half-keyboard.png` | rendered evidence | 7 WebKit screenshots at iPhone-16 geometry, both themes. |

**Not built (deliberately out of the ordered slice):** the template unification (spec D5),
`DrawerTab edge="bottom"` as a real component (D6 — the mock transposes it in CSS to prove the
geometry), the storage codec (D9), `useSheetDetents.ts` as an extracted composable (D2 — the spike
inlines it in `GameScene`, verbatim shape), the desktop zone reorder (D4/owner row 1), the e2e recuts.

---

## FALSIFIER VERDICTS (headless WebKit, 393×745)

| falsifier | verdict | measured |
|---|---|---|
| **F-a** filter re-raster under a per-frame parent transform | **SURVIVES** (channel half) | 400px paced drag, 40 `pointermove`s / 40 rAF frames / 538ms → **70.5 fps**; `.control-panel-filtered` layout box **constant at 335.81×545.28** across every frame; **0** attribute mutations on the filtered node; `will-change: transform` intact; 40 distinct `transform` values vs **1** distinct `translate` and **1** distinct `--sheet-rest` (zero per-frame var writes). |
| **F-b** keyboard anchor | **SURVIVES** | keyboard 336px → `--vv-height` 745→409; revealed band `[161, 409]` vs keyboard top 409 → clears exactly; **yielded 336px by ANCHOR with the `translate` channel byte-unchanged**; revealed height preserved 248px; at `full` with the keyboard up: top 64 (on-screen), 345px revealed; dismiss restores top 497 ⇒ `anchorResetsClean`; detent preserved. |
| **F-c** `run()` settle from a live drag pose | **SURVIVES** | exactly **1** animation, `cubic-bezier(0.32, 0.72, 0, 1)` **@520ms**, `fill: none`, `composite: replace`, keyframes `["translateY(200px)", "translateY(0px)"]`; **onset discontinuity 0.00px** (rest landed `48px→248px` in the same tick as `run()`); 39 frames, **0 non-monotone**, **0px overshoot**, **0px jump at the `fill:none` drop**; inline `transform` cleared at settle. No `reverse()` anywhere. |
| **F-d** iOS 26 `offsetTop` non-reset | **NOT MEASURABLE HERE** | headless WebKit never leaves a stale `offsetTop`. The proposed cure is written and running: `anchorPx() = min(layoutHeight, vv.offsetTop + vv.height)` — the clamp is load-bearing twice (anchor stays on-screen; a stale offsetTop can't push it below the fold). **Owner E-row 4 / `perf-rig-iphone16` only.** |

### One genuine spec falsification, cured in place

**Spec D4's half detent (14rem / 224px) does not fit its own payload.** Measured at 224px: the play
zone overflows the revealed band by **17.5px** — the action row (Clear/Fill/Solve/Share) falls below
the fold, `allInVv: false`. The spec's "~196px budget / 180px content" arithmetic omitted that the
**48px tongue shares the band**. Measured fit: **248px = 15.5rem** → `playZoneFitsRevealed: true`,
`allInVv: true`, `all44: true`, board still fully visible, still zero document scroll. The family is
untouched by this; one token changes. (The rig exposes `window.__f3.setHalf(px)` to re-derive it on
any geometry — this number is iPhone-16-portrait-specific and should be re-measured per device class.)

---

## FAMILY SUCCESS TEST — 6/6 (with the 248px half)

1. **Closed** — `scrollHeight 745 ≤ clientHeight 745` (**zero scroll**); tongue **48px ≥ 44** floor, fully in view; board and masthead both fully in view; 257.4px of slack between board bottom and tongue top at this geometry (the board is width-bound, not height-bound, on iPhone-16 portrait — so D8/C2's height guard is **not binding here**; it earns its keep on short/landscape viewports only).
2. **Half** — revealed 248px; board fully visible and **not** occluded (`boardOccludedBySheet: false`); all 9 play controls (pen/pencil/erase · Undo/Redo/Hint · Clear/Fill/Solve/Share) inside the viewport, **every one ≥44×44** (measured 44×45); zero document scroll.
3. **Drag** — transform-channel mutation only; the filtered card's layout box never moves (see F-a).
4. **Settle** — the one glass curve `cubic-bezier(0.32, 0.72, 0, 1)` @520ms, read off the live animation (see F-c).
5. **Keyboard** — see F-b. `ensureVisible` untouched.
6. **One instance** — 1 `.control-panel-filtered`, 1 `#controls-drawer`, 1 `.drawer-tab`, **1** inner scroller (`#pane` — C7's re-cut premise, "one contained inner scroller", holds literally); `aria-expanded` `false`→`true` across closed→half; pane `inert` at closed. **0 page errors.**

Measured zone heights (WebKit, 393px wide): marks row 48 · play tools 45 · action row 45 ·
zone-play **179** · zone-stage 191 · zone-prefs 126 · tongue 48 · full detent **628** (= `--vv-height − 4rem` clamp).
Spec D4's per-row estimate (70/58/52 = 180) was 1px off the measured zone total (179) — the estimate
was good; only the tongue accounting was wrong.

---

## ≥1024 IS UNTOUCHED (mechanically audited, `loc.json`)

- `scene.css`'s `@media (min-width: 1024px)` block is **byte-identical** between `.orig` and `.f3`
  (2,063 B, string-compared). The audit-4 fiction, the `translate:`-channel park rule, both
  `drawer-gesturing` promotions: unchanged.
- `GameScene.vue`: the only *edit* to an existing line is the `.scene-controls` class list,
  `hidden lg:flex lg:flex-col lg:items-start` → `flex flex-col items-stretch lg:items-start` —
  **identical computed style ≥1024** (flex · column · items-start). Everything else is an addition,
  plus `v-if="false"` on the stacked mount and the `#controls-drawer` id/ref/inert/keydown preserved
  on the same node (so `drawer.spec.ts`'s ≥1024 anchors keep resolving).
- `useFlipGlide.ts`: **not opened.** `useControlsDrawer.ts`: **not opened.**

---

## NET-LOC (measured, `loc.json`; non-blank non-comment lines)

| file | before | after | +code | −code | net code |
|---|---|---|---|---|---|
| `src/games/shared/scene.css` | 176 | 259 | 69 | 0 | **+69** |
| `src/games/shared/GameScene.vue` | 130 | 273 | 109 | 6 | **+103** |
| `src/games/shared/useKeyboardViewport.ts` | 160 | 186 | 10 | 2 | **+8** |
| **spike total** | | | **188** | **8** | **+180** |

(all lines incl. comments: +262 / −10 = +252)

**The spike is additive-only and does NOT demonstrate the spec's "≈break-even, target ≤0".** Every
deletion the spec banks is in the files the ordered slice defers. Measured deletion surface, so the
projection is honest rather than asserted:

- `GameControlPanel.vue`: the `v-if="mobile"` template fork spans **lines 330-528 = 199 lines**; the
  `/* Mobile layout */` CSS block spans **930-973 = 44 lines**; 17 `showTabs`/`expandedPanel`/
  `valueLabel`/`mobile-heading`/`heading-value` references. Deletion ≈ **−243**, plus ~+15 for the
  three zone wrappers ⇒ ≈ **−228** (spec estimated −200).
- The `mobile` prop plumbing: **24 prop-specific references across 15 files** — the spec's
  "13 files / 47 refs" over-counted refs and under-counted files by 2. Deletion ≈ **−24**.
- `App.vue`'s `--keyboard-inset` padding rule (`:552-561`): **−8** once the stacked scene is gone.

⇒ shipping-cut projection ≈ **+180 − 260 = −80 code lines**, *before* the spike's inline machine
grows the features it defers (storage codec, merged inert, Esc, `aria-expanded`, the bottom tab's
click-suppression, PRM branch — spec D2 budgets +160 for `useSheetDetents.ts` vs the spike's ~103).
Honest band: **−80 … +20**. The spec's "≤0" is **plausible, not proven**; a CRITIQUE row.

---

## ENGINE FACTS WORTH CARRYING FORWARD

- **The channel split is what makes the FLIP settle exact.** Individual `translate:` applies before
  `transform:`, so the drag writes a pure *delta* on `transform` and never reads or fights the rest
  pose. At release the rest pose lands on `translate` and `transform` is released to identity **in
  the same tick** `run()` starts, whose `from` keyframe is exactly the pre-release delta ⇒ measured
  **0.00px** onset discontinuity. No `reverse()`, no retarget, no phantom base.
- **`--sheet-rest` is discrete by construction**: 1 distinct value across a 40-frame drag. Vaul's
  recalc finding is avoided not by discipline but by the shape of the machine.
- The glass curve's attack is genuinely swift: **166px of a 200px travel in the first frame pair**
  (696.13 → 530.57 → 526.40 → 522.89). Anything that samples "2 frames in" and expects a small delta
  will mis-read a healthy settle as a jump — the first harness pass did exactly that. The valid F-c
  probe is *continuity at onset* + *monotonicity* + *the `fill:none` drop*, never magnitude.
- Drag arms at the first move past slop: measured **12.5px** on 12.5px steps (≥ the 10px floor, so
  the peek hold has already self-cancelled — spec D7's arbitration needs no peek edits).

## LIMITS OF THIS EVIDENCE

- Headless WebKit exposes **no paint/raster timeline**, so F-a is proven only on the *channel* claim
  (no layout mutation, no attribute churn, no var writes). "The 3-pass filter does not re-raster" is
  a **rig claim** — `perf-rig-iphone16`, hardware Safari, owner E-row.
- 70.5 fps in headless WebKit is a *scripted* cadence (one move per rAF), not a thumb.
- The mock has no Fraunces/Patrick Hand webfonts (no font pipeline), so every measurement here is
  geometric px, never glyph-metric. Row heights on device will differ by a few px — re-derive the
  248px half against the real faces before it becomes a token.
- `env(safe-area-inset-bottom)` resolves to 0 in headless WebKit; the home-indicator inset is
  untested. First consumer in the estate — rig row.

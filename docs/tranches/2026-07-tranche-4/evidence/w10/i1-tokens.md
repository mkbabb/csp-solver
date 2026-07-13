# T4-W10 · Lane I1 — the style layer (--ease-* tokens + the laminate glass)

**HEAD 766aa068** (`T4-WU`). Implements the C1 census ledger (`c1-easing.md`): mint the
house easing family as `--ease-*` CSS custom properties, convert every `<style>`-layer
`cubic-bezier` literal to `var(--ease-*)` value-preserved, re-point the answer-key laminate
off the retired overshoot spring onto the one glass curve. This wave RE-POINTS references —
it never re-times (every duration + control point unchanged; the sole curve change is the
laminate arrive, the wave's whole point). `drawerGlide` stays TS-only.

---

## 1. Conversion ledger — 10 curves, 41 CSS-layer occurrences → var(--ease-*)

Minted in `assets/index.css` `@theme` §EASING (base, theme-invariant — curves don't change
light/dark), byte-preserved from the literals they replace.

| token | curve (byte-preserved) | role | consumer sites | conversion |
|---|---|---|---|---|
| `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | easeOutQuint — write-in/reveal/grow | 10 | mechanical |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | material standard — show-hide | 9 (1 dev) | mechanical |
| `--ease-springPop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | backOut overshoot — icon/toggle pop | 6 (1 dev) | mechanical |
| `--ease-accelIn` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | easeInCubic — accelerate-away exit | 4 | mechanical |
| `--ease-fadeOut` | `cubic-bezier(0.32, 0, 0.67, 0)` | easeIn flat-tail — solver-dim fade-out | 3 | mechanical |
| `--ease-ghostDraw` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | easeOutCubic — pencil-ghost glyph draw | 2 | mechanical |
| `--ease-drawOn` | `cubic-bezier(0.33, 1, 0.68, 1)` | easeOutCubic' — pencil stroke draw-on/controls | 2 | mechanical |
| `--ease-loaderScrub` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | easeInOutCubic — loader continuous scrub | 1 | tokenized (see §2) |
| `--ease-anticipatePop` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | backInOut — anticipate + overshoot reveal | 2 | mechanical |
| `--ease-glassGlide` | `cubic-bezier(0.32, 0.72, 0, 1)` | the glass glide — laminate lay-down | 2 | RE-POINT (see §3) |

Consumer total **41** (matches census; the two laminate arrive sites moved from the
`springPop` literal onto `glassGlide` — hence springPop consumers = 6, not 8). `drawerGlide`
(`0.32, 0.72, 0, 1`) remains the sole TS-`v-bind` curve in `pencilConfig.ts` (canonical home).

Per-token consumer counts verified post-sweep:
```
--ease-noteWrite 10   --ease-standard 9   --ease-springPop 6   --ease-accelIn 4
--ease-fadeOut 3   --ease-ghostDraw 2   --ease-drawOn 2   --ease-loaderScrub 1
--ease-anticipatePop 2   --ease-glassGlide 2   → total 41
```

## 2. Decisions

- **STAY-LITERAL: zero.** No curve was genuinely role-ambiguous. The one borderline
  (`--ease-loaderScrub`, single-use, ScribbleLoader-private) was **tokenized** — the census
  leaned token for ledger completeness and the role is clear (not a mis-name). Result: zero
  `cubic-bezier` literals survive in any `.vue` `<style>` layer.
- **Naming reconciliation (census C4 conflict).** The spec's laminate gate names the
  easeInCubic leave curve `--ease-laminateLeave`, but that literal is **shared** across three
  components (laminate leave, ScribbleLoader out-phase, DarkModeToggle track). Minting a
  laminate-scoped name for a shared curve is the mis-name the census flags. Per "implement
  exactly the census ledger," it mints as ONE role token **`--ease-accelIn`** covering all
  four sites. The spec alias is recorded inline in the token comment.
- **`[dev]` FilterTuner sites tokenized too.** `FilterTuner.vue` (2 sites) is dev-gated
  (`import.meta.env.DEV`), dead-code-eliminated from prod — but tokenizing keeps the gate
  probe clean (zero literal survivors) and the tokens resolve globally in dev. No prod impact.
- **The two-layer rule is documented** beside `MOTION.curves` in `pencilConfig.ts` (the TS
  half: JS/`v-bind` consumers → `MOTION.curves`; CSS half: `<style>` consumers → `--ease-*`).
  The glass curve lives in both layers (byte-identical control points), disjoint consumer sets.

## 3. The laminate joins the glass — RE-POINT (π/DELTA)

`AnswerKeyLaminate.vue` (re-located at HEAD: arrive `:235-236`, leave `:226-227` — both +4
from the spec's `65425697` anchors):

- **arrive / `.is-shown` lay-down** `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot, cp₂=1.56>1)
  → **`var(--ease-glassGlide)`** — the audit-4 monotone glass curve. **280ms preserved.**
- **leave** `cubic-bezier(0.55, 0.055, 0.675, 0.19)` → `var(--ease-accelIn)` — legit
  easeInCubic exit, **tokenized not re-timed** (200ms preserved).

**DELTA — `laminate-velocity-trace.json`** (WAAPI probe driven by the SHIPPED
`--ease-glassGlide` token read off the :4488 dist; scale 1.02→1.0 sampled every 5ms):

| | curve | minScale | overshoot frames | start pose | end pose | duration |
|---|---|---|---|---|---|---|
| **pre-wave** | `0.34, 1.56, 0.64, 1` | **0.998044** | **35** (t=105–275ms, dips under 1.0) | 1.02 / op 0 | 1.0 / op 1 | 280ms |
| **post-wave** | `.32, .72, 0, 1` (glass) | **1.0** | **0** (monotone) | 1.02 / op 0 | 1.0 / op 1 | 280ms |

Overshoot frame **present pre-wave, absent post-wave**; **start/end pose + 280ms duration
unchanged**. π: `laminate-open-filmstrip-{light,dark}.png` (0/140/280ms) — 0ms scale 1.0200/op 0,
140ms scale 1.0009/op 0.95 (monotone descent, never < 1.0), 280ms scale 1.0000/op 1.00.
Dist confirms the shipped bundle: `AnswerKeyLaminate-*.css` carries `2× var(--ease-glassGlide)`
(arrive) + `2× var(--ease-accelIn)` (leave), zero raw cubic-bezier.

## 4. Gate probes

```
# PROBE A — cubic-bezier literals in .vue <style> layers (expect ZERO survivors):
$ grep -rho 'cubic-bezier([^)]*)' web/frontend/src --include='*.vue'
  → (no output)  exit=1   ✅ zero survivors (loaderScrub tokenized too)

# PROBE A' — ALL remaining cubic-bezier literals in src:
$ grep -rn 'cubic-bezier(' web/frontend/src | grep -vE 'index\.css:2[0-9][0-9]:'
  → web/frontend/src/pencil/config/pencilConfig.ts:158:  drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)"
    ✅ only the TS-v-bind drawerGlide (canonical home) survives; index.css defs are the token source

# PROBE B — the full minted --ease-* set (born-RED probe returned EMPTY at HEAD):
$ grep -rnE -- '--ease-[a-zA-Z-]+:\s*cubic-bezier' web/frontend/src/assets/index.css
  → 10 definitions (index.css:272–281)   ✅ the full set minted
```

## 5. Parity — reduced-motion AE=0 (the value-preserving bound)

`parity-capture.mjs` re-run against the :4488 dist (default theme key `vueuse-color-scheme` —
this lane did NOT rename the key; that is a separate lane, so the boot key matches the C1
baseline exactly, no `KEY=` override needed). **All 8 surfaces byte-identical to the C1
baselines (full 64-char sha256 diff empty):**

```
board self-AE0=true  full self-AE0=true  for all 4 pairs
sudoku-light   board 5f527a21…  full d6617857…   ✅ == baseline
sudoku-dark    board a1c8e60d…  full 928744ee…   ✅ == baseline
futoshiki-light board ae77b9ef… full d5c85f6e…   ✅ == baseline
futoshiki-dark board 7991707b…  full 723a53c0…   ✅ == baseline
```
**AE=0 on all four game×theme pairs, board + full.** The easing sweep is value-preserving; the
laminate re-point does not touch the settled capture (the laminate is a K-peek surface, off in
the default pose). Baselines restored intact (overwritten with byte-identical content).

## 6. Battery + e2e/goldens

| gate | result |
|---|---|
| `vue-tsc -b --force` | PASS (exit 0) |
| `npm run test:unit` | **271 passed** / 21 files |
| `npm run lint:eslint` | clean (exit 0) |
| `npm run lint:knip` | clean (exit 0) |
| `npx prettier --check src/` | All matched files use Prettier code style |
| `npm run build` | ✓ built (dist ships the 10 tokens; minifier strips leading zeros, values numerically identical) |
| default e2e vs :4488 dist | **63 passed** (visual-golden + throttled-void ignored per config) |
| visual goldens vs :4488 (darwin) | **4 passed** — no golden moved |

## 7. Files touched (21 src)

`assets/index.css` (mint 10 tokens + 2 consumer sites), `pencil/config/pencilConfig.ts`
(two-layer rule doc), `pencil/sheet/AnswerKeyLaminate.vue` (glassGlide arrive + accelIn leave)
+ 18 mechanical-swap files: `games/shared/{DifficultyTally.vue, scene.css}`,
`games/{sudoku,futoshiki}/…/{SudokuBoard,FutoshikiBoard,SolverErrorNote×2,SudokuCell,FutoshikiCell}.vue`,
`pencil/chrome/{MarginNote,ScribbleLoader,CompletionVignette}.vue`,
`pencil/chrome/AttributionCard/AttributionCard.vue`,
`pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue`,
`pencil/chrome/icons/{FillForcedIcon,DiceIcon,SolveIcon}.vue`,
`pencil/celestial/DarkModeToggle.vue`, `pencil/dev/FilterTuner.vue`.

Scratch config (additive, not committed): `web/frontend/playwright.verify-i1.config.ts`
(webServer-less, :4488 — owner's :3000 untouched). Harness added:
`evidence/w10/laminate-probe.mjs`.

**Out of lane I1 scope (other W10 lanes):** defineModel, `:ref` hoist, flourish inject,
theme-key rename, the four a11y gates. Untouched here.

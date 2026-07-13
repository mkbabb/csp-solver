# T4-W9 · P1 (A-1) — the progress border · evidence

Lane P1 (the progress-border, Part (a) ROWs 1–3). Base SHA `7e03c5dc`. Battery green:
`vue-tsc -b` 0 · `test:unit` 216/216 · `lint:eslint` 0 · `lint:knip` 0 · `prettier --check`
(the five touched files clean) · `build` 0. Golden/visual captures against the **built dist**
(`vite preview` :4189); the rAF-chain probe against a dev instance (:4190) because the
`rafInstrumentation` it names is `import.meta.env.DEV`-gated and stripped from the dist.

## The mechanism (as shipped)

- `gridPaths.ts` — `generateFrameTraceFrames(viewBox, seed, frameCount, frameBoil, grain)`:
  the SAME frame ring as the grid (shared `FRAME_X_PAD=12`/`FRAME_Y_PAD=0` constants, seed 42,
  roughness 0.5, segments 6, `frameBoil`) with the grain **baked into geometry** (the
  HandDrawnOutline grammar, §Grain bake reused verbatim) → filterless static poses.
- `HandDrawnGrid.vue` — gains `:progress` (`[0,1]`, default 0). `frameCount` trace poses,
  own sibling layer, opacity-swapped on the **same** `boilFrame` beat as the frame; painted
  last (over the graphite). `pathLength=1000`, `dasharray 1000 1000`, `strokeDashoffset
  1000·(1−progress)`. A visually-hidden multi-root `role=progressbar` mirror.
- Both boards — one `fillProgress` computed (`filled non-given / (totalCells − givens)`, over
  `values`, never the beat) + `:progress="fillProgress"`. The Futoshiki diff is prop wiring +
  the twin computed only — **zero new render code**.
- `index.css` — the sixth crayon `--color-progress-ink` (violet, two-tier) + the hand-off
  `.solve-success .progress-trace { opacity: 0 }`.

## Born-RED grep (base SHA — no board-fill indicator exists)

`grep -rn "progress-trace|progress-ink|--color-progress|progressbar|filledFillable|
generateFrameTraceFrames" src/` → **none**. The only `strokeDashoffset` uses are the grid
draw-in/erase (`usePathAnimation.ts`) and per-cell glyph draw-in — none tied to board FILL.

## Contrast ledger (ROW 2 · born-RED, recomputed at merged HEAD over the LIVE tokens)

WCAG 1.4.11 non-text floor is 3:1. Backgrounds are the live tokens: light `--grid-line-color`
`hsl(0 0% 15%)` (#262626) / `--color-card` `hsl(48 12% 99%)` (#fdfdfc); dark `--grid-line-color`
`hsl(48 10% 80%)` (#d1cfc7) / `--color-card` `hsl(24 6% 7%)` (#131211).

| Theme | ink | vs grid-line (opaque / @0.95) | vs card (opaque / @0.95) |
|---|---|---|---|
| light | `#8b5cf6` | **3.57 / 3.35** | **4.16 / 3.85** |
| dark  | `#7c3aed` | **3.65 / 3.48** | **3.28 / 3.07** |

All eight figures ≥3:1. Non-blue by construction: ink hue 258°/262° (violet) vs
`--color-focus-sketch` #3a7bc4 hue 212° (blue) — 46–50° apart; a focused board never shows two
blues. The two-tier direction INVERTS the crayon "glow at night" doctrine on purpose — the trace
rides the FRAME LINE (dark in light theme, light in dark), so the ink goes lighter over the dark
frame and deeper over the light one. Browser-resolved ink confirmed live: light `rgb(139,92,246)`,
dark `rgb(124,58,237)`.

## Gate table — born-RED → CLOSED

| Gate | born-RED | measured close | capture |
|---|---|---|---|
| **A-1a** border shows fill | no board-fill indicator (grep empty) | ½-fill → `strokeDashoffset` **500** (dark, 23/46) / **508.8** (light, 28/57 = 49%); `pathLength=1000`, `dasharray "1000 1000"`. Trace covers top+right = half-perimeter, clockwise from top-left | `half-fill-light-sudoku.png`, `half-fill-dark-sudoku.png` |
| **A-1b** zero steady raster | — | trace **filterless** (`traceHasLiveFilter=false`); at 59% idle over 5s the rAF-chain count is **≤1** (chainMax 1) = the W8 frame idle profile; scheduler subscribers **5** (unchanged — the trace reuses the grid's `boilFrame`, enrolls no new subscriber). A fill mutates one `strokeDashoffset` custom value, a computed over `values` — not the beat | probe (dev :4190) |
| **A-1c** twin is free | — | both boards show the identical trace; Futoshiki 40% (4/10) `dashoffset` **600**, Sudoku 39% `dashoffset` **608.7** — same component, diff = prop wiring + twin computed, **zero new render** | `fill40-light-sudoku.png`, `fill40-light-futoshiki.png` |
| **A-1d** PRM + hand-off | no trace | PRM (`reduce`): `transition-duration` **0s** — offset snaps to its correct static value, beat frozen. `no-preference`: `stroke-dashoffset 0.24s, opacity 0.5s`. Real solve: `.solve-success` present, trace `opacity` **0** (bows out), aria "board 100% filled" — gold owns the win | `prm-half-light-sudoku.png`, `solve-gold-light-sudoku.png` |
| **ink contrast** | x5's blue collided with the focus ring | violet pair, integers banked above; both themes ≥3:1 over grid-line AND card | the light+dark ½-fill crops |
| **honesty (ROW 3)** | — | `role=progressbar`, `aria-valuetext` **"board N% filled"** at 39/40/49/50/100% — never "correct"; FILL counts wrong digits (the '1'-spam fill), the app grades correctness only on Solve | measured on every capture |

Note on A-1d "frame gold": the `.solve-success .grid-line` gold recolor is the existing rule
(unchanged by W9). At the baked-bitmap steady state the gold moment is carried by the star, the
gold box-shadow, and the rainbow answer; the trace's job is to **stop competing** — confirmed
`opacity 0` at the real graded win.

## Captures (all < 150 KB)

- `half-fill-light-sudoku.png` — violet #8b5cf6 top+right over graphite, dashoffset 500-class
- `half-fill-dark-sudoku.png` — violet #7c3aed over the light-grey frame + dark paper
- `fill40-light-sudoku.png` / `fill40-light-futoshiki.png` — the free twin, same trace
- `prm-half-light-sudoku.png` — static, correct offset, no tween
- `solve-gold-light-sudoku.png` — trace gone, the gold moment owns the frame

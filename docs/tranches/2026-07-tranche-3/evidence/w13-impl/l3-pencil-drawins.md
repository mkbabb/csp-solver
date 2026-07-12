# T3-W13 impl lane l3 — §4 pencil draw-ins (4.0–4.3), landed

Fable + frontend-design skill invoked. Baseline d0893614, edits HMR'd into :3001 (server untouched). All four sub-beats implemented per the wave text + b5 §3.0's primitive verbatim; both critique-lane kills that touch this lane (flourish gate #13, PRT honesty #15) honored.

## What landed

### 4.0 — `.pencil-draw-on`, the global primitive
`web/frontend/src/assets/index.css` (new unlayered section between `@layer utilities` and the R3 coarse-pointer block). b5 §3.0 CSS verbatim: `stroke-dasharray: 1` / `dashoffset 1→0` keyed to `pathLength="1"` on consuming paths (W8 approximate-length class sidestepped, zero JS), 8% opacity ramp for the round-linecap start dot, `cubic-bezier(0.33, 1, 0.68, 1)` (easeOutCubic), PRM-instant arm in the primitive itself (`animation: none; opacity: var(--draw-opacity, 1)`). Unlayered deliberately so no unlayered scoped SFC declaration can outrank it. Consumers parameterize via `--draw-dur`/`--draw-delay`/`--draw-opacity` inline.

### 4.1 — hint = a one-cell solve reveal + the flourish gate
- `useSudoku.ts` `hintCell` (was :250-269) and `useFutoshiki.ts` twin (was :240-245): `animatingCells.value = new Set([key])` — the existing reveal path runs whole (`createGlyphDrawIn` @ `DRAW_IN_PRESETS.glyph` 350ms, solver ink, grain suppressed during the tween, PRM branch, murmur enrollment). Zero new timing constants.
- Flourish gate: `HandwrittenGlyph.vue` gains optional `flourish?: boolean`; the old `:179` `if (props.isSolved) scheduleFlourish()` is now gated on `props.flourish`, with `registerForMurmur()` as the gated else (b5 §3.1 — hinted ink IS solver ink, it murmurs). Threaded `:flourish="celebrating"` board → cell → glyph in BOTH games (SudokuBoard/SudokuCell, FutoshikiBoard/FutoshikiCell). Optional prop leaves the chrome consumers (HandwrittenLogo, FutoshikiCaret — never solved) untouched.

### 4.2 — peek marks write inside the kept ripple
`SudokuCell.vue` + `FutoshikiCell.vue` mark paths: `pathLength="1"` + `pencil-draw-on`, inline `--draw-dur: 160ms`, `--draw-delay: ${marks!.indexOf(v) * 20}ms` (candidate ORDER — compact). The 250ms container fade KEEPS (the graphite haze; container owns the tone, `--draw-opacity` stays 1). The `SudokuBoard.vue:87-148` idle-chunk gate is byte-UNCHANGED.

### 4.3 — the laminate key writes through the milk
`AnswerKeyLaminate.vue` key paths: `pathLength="1"` + `pencil-draw-on`, `--draw-dur: 180ms`, `--draw-opacity: 0.9`, `--draw-delay: ${80 + ((cell.pos * 31) % 7) * 40}ms` (the wave's noise formula, CSS-value-per-node). `keyFade` (:209-217) DELETED; `.key-glyph` keeps only its geometry; the scoped PRM `.key-glyph` rule dropped (primitive-inherited instant at 0.9). Lay-down/lift transitions unchanged.

## Verification evidence (all under this directory)

Probes: `probe-l3.mjs` (9×9 + futoshiki + PRM + solve-keep), `probe-l3-16.mjs` (16×16 sweep); raw JSON in `probe-results.json`, `probe16-results.json`. Headless chromium, 1440×900 @DPR2, against :3001.

| Check | Result |
|---|---|
| H hint draws in solver ink over 350ms | dashoffset 76→0 traced across ~30 frames (t=26ms off=76 → t≈380 settled; completion clears to `none/0` at t=833 sample), `stroke="url(#solver-ink)"` every frame. Screenshot `hint-middraw-dpr2.png` (the 7 mid-stroke, rainbow ink) |
| NO flourish on a lone hint | d-change watch over 4s: ZERO changes in the flourish window (onset would be `beat2StartMs` 1350 + wavefront ≈1.4s, running to ~2.6s); the only burst is 2532–3131ms = one 600ms wiggle at the 2500ms murmur window — the b5-specified murmur enrollment, not a flourish |
| Solve reveals beat-identical | solve trace: d-changes from 1415ms (=1350 + wavefront, 2×600ms flourish cadence) — beat-2 intact; e2e solve/celebration specs green |
| K-hold marks stagger | mark paths `animationName: pencil-draw-on, 0.16s, pathLength=1`; mid-write sample at t≈100ms shows sibling marks at distinct offsets (0.1446 vs 0.2723 — the 20ms candidate-order stagger in flight). 16×16: row sweep 45→227ms (~12ms/row) composing with in-cell writes — `peek16-wavefront-dpr2.png`. (This 16×16 generation propagated to 1 candidate/cell, so its delay histogram is all idx-0 — the stagger formula is exercised by the 9×9 multi-candidate cells) |
| Laminate writes through the milk, 80–320ms | 57 key paths, `pencil-draw-on 0.18s`, delay buckets exactly {80,120,160,200,240,280,320}ms (7 noise buckets); at t≈100ms key offsets all still 1 (the milk lands first, writes follow). `peek-midwrite-dpr2.png` (red glyphs mid-stroke), `peek-settled-dpr2.png` |
| PRM instant everywhere | reducedMotion:'reduce' context — hint: `dash none/off 0` at t=120ms (createGlyphDrawIn instant branch); marks: `animationName none, opacity 1, off 0`; key: `animationName none, opacity 0.9, off 0` (primitive-inherited). `prm-peek-dpr2.png` |
| Futoshiki twins | hint dashoffset 90→0 over ~350ms in solver ink; mark paths carry `pencil-draw-on` + `pathLength=1` |
| Build / lint / e2e | `vue-tsc -b && vite build` clean; `npm run lint:eslint` clean; **e2e 43/43 passed (20.1s)** |

## Deviations
None from the wave text. Two notes for the gate lane:
1. **Failed-solve flourish**: cells filled by a solve graded 'failed' previously flourished (`:179` fired on bare `isSolved`); the wave-specified gate (`celebrating` requires `solveState === 'solved'`) closes that too. In-fiction correct (no gold star on a failed grade) and a direct consequence of the specified gate — flagged, not a deviation.
2. **PRT 256-path trace** (gate row "draw-ins", crit-design kill #5): the full-key PRT arm trace is the gate lane's certification item per the wave's gates table; not run here. The stagger-widen fallback stays banked.

## Changed files (exact, repo-relative)
- web/frontend/src/assets/index.css
- web/frontend/src/pencil/glyph/HandwrittenGlyph.vue
- web/frontend/src/pencil/sheet/AnswerKeyLaminate.vue
- web/frontend/src/games/sudoku/composables/useSudoku.ts
- web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue
- web/frontend/src/games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue
- web/frontend/src/games/futoshiki/composables/useFutoshiki.ts
- web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue
- web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue

No git add/commit run (orchestrator commits pathspec-form at finalize).

— lane l3, Fable, 2026-07-11.

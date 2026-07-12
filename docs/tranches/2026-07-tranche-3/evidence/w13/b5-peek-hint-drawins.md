# W13 lane b5 — peek/hint draw-ins (finding 3)

Design lane, Fable + frontend-design skill. Read-only audit of d0893614 live at :3001 (Chrome DevTools CLI probes; the claude-in-chrome extension was disconnected, so traces ran through `chrome-devtools evaluate_script` against a fresh page — the dev server untouched).

## 1. What appears INSTANTLY today vs what draws in — audited

Everything on this page is supposed to arrive as writing. Three surfaces don't.

### 1.1 Hint (H) — instant pop, zero animation. CONFIRMED live.

Frame-by-frame trace (16 rAF samples after dispatching `h` on a focused empty cell, 9×9):

```json
{"cell":"1,2","samples":[{"t":9,"dash":"none","off":"0"},{"t":16,"dash":"none","off":"0"}, …, {"t":78,"dash":"none","off":"0"}]}
```

The solver-ink glyph (`stroke: url(#solver-ink)` confirmed) sits at `strokeDasharray: none / strokeDashoffset: 0` on its first painted frame. It pops fully formed.

Root cause, two links:
- `useSudoku.ts:250-269` — `hintCell` writes `values` + `solvedValues` but never touches `animatingCells` (the reveal set; solve's path assigns it at `useSudoku.ts:210`). So `isRevealed(pos)` (`SudokuBoard.vue:539-540`) is false for the hint cell.
- `HandwrittenGlyph.vue:193-204` — the non-revealed branch order: the quick 150ms user-draw runs only `if (!props.isGiven && !props.isSolved)`; a hint cell has `isSolved === true` (it's in `solvedValues`), so it falls through to the instant-show at `HandwrittenGlyph.vue:201-202` (`strokeDasharray = 'none'; strokeDashoffset = '0'`).

Futoshiki twin has the identical structure: `useFutoshiki.ts:240-245` (`hintCell`), `FutoshikiBoard.vue:315-320` (the H handler).

### 1.2 Peek laminate key glyphs — flat fade, deliberately "pre-printed". CONFIRMED live.

Trace at K+400ms (9×9, 46 blanks): `keyGlyphAnim: "keyFade-41bb021b 0.15s"`, `keyGlyphDash: "none"`. The teacher-red answers arrive as a 150ms flat opacity fade — `AnswerKeyLaminate.vue:202-217`, comment self-declares: "pre-printed: flat 150ms fade, no draw-in, no stagger". No stroke draw-on anywhere in the laminate.

The laminate OBJECT motion is right and stays (audit §4): lay-down 280ms back-out `cubic-bezier(0.34,1.56,0.64,1)` scale 1.02→1 (`AnswerKeyLaminate.vue:189-196`), lift 200ms easeInCubic — the erase-family asymmetry (`AnswerKeyLaminate.vue:183-187`, `LIFT_MS=200` at `:35`).

### 1.3 Peek marks — container fade only, no per-mark draw-on. CONFIRMED live.

Trace: `marksAnim: "marks-fade-in-d0f8c37b 0.25s"`, `markGlyphDash: "none"`. Each cell's `.pencil-marks` block fades in as one 250ms opacity unit (`SudokuCell.vue:265-289`); the individual mark paths (`SudokuCell.vue:212-219`) carry no dash, no stagger, no filter — they materialize as a block.

The row ripple (the T3-W8 idle-chunk gate, `SudokuBoard.vue:87-148`) is real but machine-paced, not designed. Traced on 16×16 (`?size=4`, 142 mark cells / 309 mark paths):

```
row 1 @ 31ms → row 8 @ 102ms → row 16 @ 185ms   (~10ms/row — requestIdleCallback firing every frame on an idle machine)
```

So the "ripple" today is a ~185ms mount sweep whose cadence is whatever `requestIdleCallback` gives you. 9×9 gets no ripple at all (`MARKS_CHUNK_MIN_BOARD = 10`, `SudokuBoard.vue:94,137`): all 46 mark cells mount at once.

## 2. The reusable primitive — what already exists

- **JS draw-on**: `createGlyphDrawIn` (`glyphAnimations.ts:44-78`) — stroke-dashoffset length→0 on the shared boil chain, easeOutCubic, PRM-instant branch at `:53-58`, dasharray cleared to `'none'` on completion (the W8 approximate-length fix). Preset: `DRAW_IN_PRESETS.glyph = 350ms / easeOutCubic` (`pencilConfig.ts:325-330`). This is the board glyphs' arrival — the grammar the owner is pointing at.
- **The reveal path in the glyph**: `HandwrittenGlyph.vue:162-180` — `isRevealed` → grain-static suppressed for the tween (`grainOn = false`, L28 F1), draw-in at `noiseDelay`, grain restored `onComplete`. One filtered re-raster per glyph total.
- **What does NOT exist**: any CSS draw-on primitive. Marks (309 paths at 16×16) and key glyphs (46-200+) must not become 300 `createSequenceSubscription`s — that's scheduler load with no benefit for fire-and-forget one-shots.

## 3. Spec

### 3.0 New shared primitive — `.pencil-draw-on` (CSS, global pencil layer)

One unscoped keyframe + utility class in the pencil CSS layer (scoped SFC keyframes hash per-component — trace showed `keyFade-41bb021b`, `marks-fade-in-d0f8c37b` — so a shared primitive must live global, e.g. alongside the index.css pencil tokens):

```css
.pencil-draw-on {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: pencil-draw-on var(--draw-dur, 160ms) cubic-bezier(0.33, 1, 0.68, 1) var(--draw-delay, 0ms) both;
}
@keyframes pencil-draw-on {
    from { stroke-dashoffset: 1; opacity: 0; }
    8%   { opacity: var(--draw-opacity, 1); }
    to   { stroke-dashoffset: 0; opacity: var(--draw-opacity, 1); }
}
@media (prefers-reduced-motion: reduce) {
    .pencil-draw-on { animation: none; opacity: var(--draw-opacity, 1); }
}
```

Load-bearing details:
- **`pathLength="1"` on the consuming `<path>`** — the browser normalizes dash coordinates to the declared length, so `dasharray:1 / dashoffset:1→0` is EXACT regardless of the path's true length. This sidesteps the whole W8 approximate-length defect class (`glyphAnimations.ts:37-43`) with zero JS: no reset, no `'none'` clearing, no resting dash-gap.
- **The 8% opacity mask** — with `stroke-linecap: round`, `dashoffset === dasharray` leaves the start-point cap protruding as a dot before the stroke moves; the one-beat opacity ramp hides it.
- **Easing** easeOutCubic-equivalent bezier — same family as every draw-in preset (`pencilConfig.ts` `timing: "easeOutCubic"` throughout).
- **PRM instant** in the primitive itself — consumers inherit it; matches the existing arms (`SudokuCell.vue:291-295`, `AnswerKeyLaminate.vue:231-241`, `SudokuBoard.vue:137`).

Consumers parameterize via `--draw-dur` / `--draw-delay` / `--draw-opacity` inline (the mark and key cells already carry inline styles per node).

### 3.1 Hint (H) — write in as solver ink does on solve

Reuse beat-1 wholesale; the hint IS a one-cell solve reveal.

- `hintCell` (`useSudoku.ts:250-269`, twin `useFutoshiki.ts:245`) additionally assigns `animatingCells.value = new Set([key])` — mirroring the solve path's wholesale assignment at `useSudoku.ts:210`. Consequences, all free:
  - `isRevealed` → true → `HandwrittenGlyph.vue:162-180` runs: grain suppressed during the tween, `createGlyphDrawIn` at `DRAW_IN_PRESETS.glyph` (350ms, easeOutCubic), solver-ink stroke already resolved first in `strokeColor` (`HandwrittenGlyph.vue:55-59`).
  - `noiseDelays` (`SudokuBoard.vue:196-215`) computes delay 0 for a singleton set — the hint writes immediately on keypress.
  - PRM: `createGlyphDrawIn`'s instant branch (`glyphAnimations.ts:53-58`). Nothing extra.
  - No celebration risk: `celebrating` requires `solveState === 'solved'` (`SudokuBoard.vue:226`) and `hintCell` forces `'idle'` (`useSudoku.ts:264-267`).
- **Flourish gate (required)**: `scheduleFlourish` fires off `isRevealed && isSolved` INSIDE the glyph (`HandwrittenGlyph.vue:179`) with no solve-vs-hint signal — a lone hint would crest a 2×600ms flourish at t≈1.35s, detached from any celebration. The celebration is a moment, not a state (`pencilConfig.ts:344`), and a hint is "a reveal, not a user edit" (`useSudoku.ts:249`) — no gold star. Thread the board's existing `celebrating` derivation down as a `:flourish` prop (SudokuBoard → SudokuCell → HandwrittenGlyph, twin in futoshiki) and gate `HandwrittenGlyph.vue:179` on it. Solve reveals keep beat-2 byte-identical (`celebrating` is true there); hints stop at the written glyph.
- The hint cell still joins the murmur pool on settle (the instant path already does at `HandwrittenGlyph.vue:204`; the reveal path's flourish `onDone` did — with the gate, `registerForMurmur()` is the gated branch's else). A hinted glyph murmurs like any solver ink — correct: it IS solver ink.
- Replay note: `animatingCells` persists until the next board op (reset at `useSudoku.ts:80,105,166,210,289`), so an HMR/remount replays the hint draw-in — same deliberate behavior as solve reveals (`SudokuBoard.vue:217-219`).

**Feel**: H → the answer writes itself into the cell in 350ms of solver ink, exactly as the solve wave writes each cell. One grammar, one primitive, zero new timing constants.

### 3.2 Peek marks — per-mark draw-on inside the ripple

The marks are the solver thinking in the margins (`SudokuCell.vue:258-264`) — thinking should be written, not stamped.

- Each mark `<path>` (`SudokuCell.vue:212-219`) gains `pathLength="1"` + `class="pencil-draw-on"`, with inline `--draw-dur: 160ms; --draw-delay: calc(idx * 20ms)` where `idx = marks!.indexOf(v)` — candidate ORDER, not slot value, so delays stay compact (a 3-candidate cell spans 0-40ms, never 0-300ms). Candidates are ascending (`usePencilMarks.ts:70-72`), so the pencil enumerates 1, 2, 3… left-to-right through the mini-grid — the classic convention, written in the writing order.
- Keep the 250ms container fade (`SudokuCell.vue:269`) — it's the graphite haze the marks write into; the compounding (container fading to 0.5 while strokes draw at full) reads soft, not doubled. Container opacity stays the mark tone-setter (0.5 / 0.75 contrast arm, `SudokuCell.vue:268,298-302`); `--draw-opacity: 1` on marks (the container owns the fade).
- **Ripple pacing: keep the idle-chunk mount gate unchanged** (`SudokuBoard.vue:87-148`). Its job is perf (bounding per-frame mounts — the ~2,700-node hitch it was built for); the traced ~10ms/row sweep now COMPOSES with the per-mark draw-on: row N's marks are mid-stroke as row N+1 mounts — a genuine top-down writing wavefront instead of rows of instant blocks. 9×9 (no ripple) still gets the in-cell write-on — the grammar lands at every size.
- Worst-case settle, 16×16: last row mounts ~185ms + 15-candidate in-cell tail 280ms + 160ms stroke ≈ 625ms; typical (2-6 candidates) ≈ 400ms. Well inside a hold gesture; the first marks are writing within ~50ms of the propagate round-trip landing.
- PRM: primitive-inherited instant + the existing all-rows-at-once bypass (`SudokuBoard.vue:137`) — marks are simply there, as today (`SudokuCell.vue:291-295` extends to the paths).
- Futoshiki twin: identical change in `FutoshikiCell` (marks markup mirrors sudoku's).

### 3.3 Laminate key glyphs — the red pen writes through the milk

Replace `keyFade` (`AnswerKeyLaminate.vue:209-217`) with the primitive. Design fiction shifts one notch: not a pre-printed key laid down, but the teacher's red pen filling YOUR blanks through the laminate — in-family with the teacher-red conflict circle.

- Key glyph `<path>` (`AnswerKeyLaminate.vue:151-160`): `pathLength="1"` + `pencil-draw-on`, `--draw-dur: 180ms` (a red pen is quicker than graphite), `--draw-opacity: 0.9` (the current keyFade target — the milk still dims it).
- **Stagger, CSS-only noise**: `--draw-delay: calc(80ms + ((pos * 31) % 7) * 40ms)` computed inline per keyCell (they already carry inline styles, `AnswerKeyLaminate.vue:144-149`). 80ms lead lets the milk land first (lay-down is 280ms); 7 noise buckets over 0-240ms echo beat-1's Fisher-Yates scatter without a JS timeline; board-size-independent (46 glyphs at 9×9 or 200+ at 16×16 PRT — same window). All strokes started by ~320ms, settled by ~500ms — the key is fully readable well inside any hold.
- Lay-down/lift transitions: UNCHANGED (§1.2 — the object grammar is right). Lift has no reverse-erase: glyphs leave with the laminate's 200ms opacity, per the erase-family asymmetry.
- Re-peek replays the write-in (the laminate fully unmounts after `LIFT_MS`, `AnswerKeyLaminate.vue:77-81`) — correct: each peek re-lays the object. Net added time-to-full-key vs today ≈ +220ms; if the owner finds repeat-peeks sluggish, the 80ms lead and 40ms bucket width are the tunables.
- PRT/contrast opaque arm (full printed key, `AnswerKeyLaminate.vue:41-53,105-130`): same treatment — PRT is not PRM; 256 concurrent unfiltered CSS dash animations are paint-only (see §5). PRM arm: primitive-instant at 0.9, extending `AnswerKeyLaminate.vue:231-241`.

### 3.4 Laminate reveal grammar — audit verdict

| Element | Today | Verdict |
|---|---|---|
| Lay-down | 280ms back-out, scale 1.02→1 + opacity (`:189-196`) | KEEP — the physical flourish |
| Lift | 200ms easeInCubic (`:183-187`) | KEEP — erase-family fast-out |
| Boil freeze | `acquireHold('answer-key')` on lay, release after lift (`:68,79,91`) | KEEP — and it's the perf headroom §5 spends |
| Key glyphs | 150ms flat fade (`:209-217`) | REPLACE — §3.3 |
| Marks container | 250ms fade (`SudokuCell.vue:269`) | KEEP — §3.2 rides inside it |
| Marks ripple | idle-paced rows (`SudokuBoard.vue:87-148`) | KEEP as mount gate — §3.2 |
| PRM/PRT arms | instant / opaque full-key | KEEP — extend to the new keyframe |

## 4. Timing table (the spec's numbers)

| Surface | Today (traced) | Spec | Primitive |
|---|---|---|---|
| Hint glyph | instant (dash none @ t=9ms) | 350ms solver-ink draw-on, delay 0, easeOutCubic; no flourish | `createGlyphDrawIn` via `animatingCells` reuse |
| Peek mark (each) | 250ms container fade only | 160ms draw-on, +20ms per candidate index | `.pencil-draw-on` CSS |
| Marks ripple | ~10ms/row idle sweep (185ms full 16×16) | unchanged (mount gate) | — |
| Key glyph (each) | 150ms flat fade | 180ms draw-on to 0.9, delay 80 + ((pos·31)%7)·40ms | `.pencil-draw-on` CSS |
| Laminate lay/lift | 280ms / 200ms | unchanged | — |
| PRM (all) | mixed | instant everywhere | primitive-inherited |

## 5. Perf budget — coordination with b1

- **All new motion is one-shot, and it stays live** — no pre-rastering. The grain-hoist class of fix (tranche-1: 4 pre-rastered layers, opacity swap, −74.3% raster) targets PERPETUAL filters; these draw-ins fire once per gesture and end. b1 should treat them as out of scope for any hoist.
- **Zero filter cost on marks + key glyphs**: neither carries a filter (`SudokuCell.vue:212-219`, `AnswerKeyLaminate.vue:151-160` — plain strokes, no `grain-static`). CSS dashoffset interpolation on unfiltered paths is plain paint, no feTurbulence re-raster, no compositor promotion needed.
- **Zero scheduler load**: CSS animations, not 309 `createSequenceSubscription`s — the 16×16 peek (traced: 142 mark cells, 309 mark paths) adds no boil-chain subscribers. The subscriber floor stays at ambient (chains=1/subscribers=10).
- **The peek runs against a frozen page**: `acquireHold('answer-key')` stops the boil for the whole gesture (`AnswerKeyLaminate.vue:68`) — the draw-ins spend raster budget exactly when the page's steady-state cost is at its minimum. This is the opposite regime from finding-1/4's idle tax; b1's steady-state work and this lane's one-shots don't compete.
- **Hint cost = one solve-reveal glyph**: the existing L28 F1 discipline (grain off during tween, one filtered re-raster on settle, `HandwrittenGlyph.vue:162-180`) — already paid on every solve; a hint pays it once for one cell.

## 6. Change inventory (for the implementing wave)

1. Global pencil layer: `.pencil-draw-on` + keyframe + PRM arm (§3.0) — one home, three consumers.
2. `useSudoku.ts` `hintCell` + `useFutoshiki.ts` `hintCell`: assign `animatingCells = new Set([key])`.
3. `SudokuBoard.vue` / `FutoshikiBoard.vue` → cell → `HandwrittenGlyph.vue`: thread `:flourish="celebrating"`; gate `HandwrittenGlyph.vue:179`.
4. `SudokuCell.vue` / `FutoshikiCell.vue` mark paths: `pathLength="1"`, `pencil-draw-on`, inline `--draw-delay` by candidate index.
5. `AnswerKeyLaminate.vue` key paths: `pathLength="1"`, `pencil-draw-on`, inline noise delay; delete `keyFade`; extend the PRM block.

No new timing constants outside the primitive's defaults and the two inline formulas; the hint reuses `DRAW_IN_PRESETS.glyph` untouched.

— lane b5, Fable, 2026-07-11. Traces: chrome-devtools CLI against :3001 (9×9 default + `?size=4` 16×16); probe pages only, server untouched.

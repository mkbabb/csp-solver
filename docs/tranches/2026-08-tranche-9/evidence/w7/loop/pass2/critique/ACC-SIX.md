# ACC-SIX — the sixth crayon · pass-2 CRITIQUE

Adversarial, non-author. Read the diff in `.claude/worktrees/wf_8630d340-e56-42` (11 tracked
files, +528/−80, plus `countTape.test.ts`), looked at both cited frames, and re-measured on my
own server — 127.0.0.1:4238 out of the prototype worktree, private vite `cacheDir`, a scratch
playwright config with no `webServer`, chromium + webkit, killed and removed on return. HEAD's
arm ran on a second private server (127.0.0.1:4239) out of the main tree, read-only. My
instruments are banked at `ACC-SIX/probe/`, their readings at `ACC-SIX/readings/`, one crop at
`ACC-SIX/frames/`. Nothing under `r0/` or `pass1/` was touched; the prototype worktree is as
its lane left it (11 M + 1 ??).

**Convergence: 62%. Verdict: ADVANCE** — the palette half is done and bankable; the section
cure is RED by its own gate and the tape's central claim is false on a shipped board size.
Neither is a missing primitive: I measured the replacement mechanism working in both engines
(below), so pass 3 has a path, not a research problem.

## What I re-measured, and what agreed

| row | prototype | mine | verdict |
|---|---|---|---|
| user-ink light, on card / background | 4.64 / 4.53 | 4.63 / 4.54 (own sRGB calculator, tokens off the sheet) | AGREES |
| user-ink dark | 7.70 / 7.86 | 7.71 / 7.87 | AGREES |
| trace @.95, light / dark | 3.36 / 3.85 · 3.46 / 3.07 | 3.35 / 3.84 · 3.46 / 3.08 | AGREES, and ≥3 |
| red-ink bare / hovered, light | 4.99 / 4.69 | 4.98 / 4.68 | AGREES, and ≥4.5 |
| solver-ink-2 as text | 5.60 / 10.14 | 5.58 / 10.16 | AGREES |
| #6AABEB @.9 on the LIGHT card | 2.17 (spec said 3.89) | 2.17 | the prototype's correction stands |
| G0 at one write of twenty | chromium 3.16 % · webkit 19.66 % | chromium 691 violet px in ONE run · webkit 2,719 px in 3 column-runs / 4 row-runs (≈5.4 % vs 21.4 % of the ring), identical computed `stroke-dasharray: 3965.63px` and `stroke-dashoffset: 3767.35px`, no `pathLength` | RED, independently |
| G5 at 900×450, webkit | reported "0 / 0 / 16, both engines" | 15 / 23 / 39 device px — and the lane's OWN bank says 16 / 24 / 40 | the report understates its bank |
| π on unclaimed chrome | not run | `.board-wrapper`, `.sudoku-cell` ×81, `.icon-btn` ×9, the masthead and the a11y node are byte-identical HEAD vs proto | CLEAN |

HEAD's own numbers for context: the pen was 5.06:1 on the light card and is now 4.63 — the hue
lock buys kinship by spending 0.43 of contrast. Still AA, but the margin is 0.13 and the owner
should be told that, not just "4.64 ≥ 4.5" (U-10).

## The five findings this critique owns

**1 · The proposed next cure WORKS, and nobody built it.** The prototype leaves G0 red with a
candidate ("slice the pose polyline at bake time, render a partial `d`") marked unmeasured. I
drove both forms on the live board without touching the product (`probe/cure.crit.ts`):

| p | dash chromium / webkit | slice chromium / webkit |
|---|---|---|
| 0.05 | 691 / 2,719 (3.94×) | 689 / 693 (1.006×) |
| 0.25 | — / 6,074 | 2,908 / 2,934 (1.009×) |
| 0.50 | — / 6,764 | 6,222 / 6,312 (1.014×) |

The slice paints the same arc in both engines to within 1.4 %, and at p = 0.05 it equals
chromium's *correct* dash reading (689 / 693 vs 691). G0's 2-point bound is reachable. The dash
arm's later cells are polluted (Vue restores its `:style` on the 8/s beat), which is why only
the slice column is quoted as a result.

**2 · "Occlusion is 0 for its whole life by arithmetic" is false on a shipped board size.** The
arithmetic was done for one board: 9×9, 20 writable. A 4×4 sudoku has FOUR writable cells, so
the first write is 25 % of the board and the clockwise front is already round the top-right
corner. Measured at the desk, light, both engines (`probe/tape-arms.crit.ts`, crop 1): violet
under the tape 209 / 259 / 258 px chromium and 220 / 264 / 266 px webkit at fills 1 / 2 / 3.
Not an edge case — 4×4 is offered on sudoku, futoshiki and kenken. The closed form the lane
banked (`W(1 − 4·f_max) ≥ inset + tapeWidth`) is right; its `f_max` is `TAPE_FILLS / writable`,
and on a 4×4 the left side is negative at every viewport.

**3 · Two lifecycle holes, both live in both engines.** (a) THE STALL: a board left at two
fills keeps the tape — still reading `2 of 20 on the board` 4.2 s after the second write, when
the lift window is 2.6 s. The rest timer is armed only at `filled >= TAPE_FILLS`, so a player
who writes twice and thinks keeps a 121 × 23 px band over the board's corner indefinitely.
(b) THE RE-LAY: write 1, clear it, write again — `1 of 20 on the board` is taught a SECOND time
on the same deal. `taught` is set at the rest, not at the lay-down, so the code's own "a new
deal is the only thing that un-teaches" holds only for a deal that reaches three fills. The
unit file covers the post-rest case and not this one.

**4 · The tape's own π is undeclared.** It sits on 2,719 px² of two live cells and 464 px² of
one glyph's box at the desk, over the board's top rule, at 0.83 alpha (both engines, identical
to the pixel). The lane measured the masthead overlap and the trace occlusion and never the
board surface the tape actually covers. And its own print discipline stops short: the diff adds
`.progress-trace` to the print blacken list, then leaves `.count-tape` rendering under
`media: print` in both engines. Under forced-colors chromium the tape becomes
`rgba(255,255,255,0.83)` with black text — readable, but nobody looked.

**5 · A degenerate `poseLengths` paints a FULL gauge.** `poseLengths` returns 0 for any `d` it
cannot parse (fewer than two points, or a curve emitter), and the template writes
`stroke-dasharray: 0px 0px`, which disables dashing — so an empty board would show a complete
violet ring. The old `pathLength` normalisation failed the other way (nothing drawn). There is
no born-RED row on the degenerate case, and the dasharray expression has no `?? 0` while the
offset beside it does.

## Checklist

- **the elegant-reduction trap** — HIT, and the family says so: "drop `pathLength`, dash in
  real units" is the deletion, and then the hard part (WebKit's paint) is still there. G0 RED.
- **unverified gestalt** — HIT, narrowly: two engines × two themes × three viewports were
  looked at, and the board size that breaks the claim was not.
- **the pixel it moves that it did not declare** — HIT twice: the cells and glyph box under the
  tape (finding 4), and the four `.washi-tag` boxes, which the lane declared as "clip-path and
  transform DIFFERENT, box equal to the hundredth" without running the census. I ran it: the
  bounding boxes move up to 0.55 px in height and 0.39 px in y. Declared π, wrong magnitude.
- **gates that cannot fail** — HIT: G9's alias law is a `console.log` section, not an exit
  code. `check-theme-tokens` prints three ALIAS-ONLY tokens where HEAD printed none and exits
  0 either way.
- **masked fallbacks** — HIT: `poseLengths → 0` (finding 5); `filled ?? 0 / fillable ?? 1`
  (carried from HEAD's `progress?`); `--washi-head-right, 0`.
- **the constraint it forgot** — HIT: the print/forced arm for its own new chrome.
- **legacy aliases** — CLEAR. `--color-blue-ink` is gone per the chair; the three answer rungs
  are a named ramp with per-theme consumers, not a third name for one colour.
- **consumer-less substrate** — CLEAR. Every minted token and constant has a consumer in the
  same diff (`tapeRestMs`, `traceFillMs`, `traceWinMs`, the rungs, the two glow tokens,
  `FRAME_X_PAD`'s export).
- **spec-cites-itself / vacuous convergence** — CLEAR. The ratio ledger is measured on painted
  bytes and matches an independent calculator; the gates red at HEAD by construction.
- **the generic default** — CLEAR. No cream-and-terracotta tells; the tape is paper furniture
  in the estate's own washi idiom, lower case, no eyebrow, no arrow.
- **AA / filterBudget / M16 / W2 / the decided history** — CLEAR, checked: all four 1.4.11 rows
  ≥3 and the text rows ≥4.5 on my own numbers, both themes; `filterBudget` 9 exact on the built
  dist (lane's census, 12/12 both engines); `check-copy-register` 0 unadmitted and the literal
  carries no `%` or `/`; W2's mechanics untouched (the tape is `pointer-events: none`, z 3,
  under every piece of page chrome, and the phone tab is at the other end of the board);
  `lint:motion` 34/34, `check-live-regions` 10 unchanged, `check-theme-selectors`,
  `check-ink-pressure`, `check-font-coverage` (46 codepoints, no re-cut) all exit 0 in the
  worktree; 26 tests pass in the touched directories. Laws 19 and 20 are AMENDED, not broken,
  and the amendment is written where the law lives — but law 20's new half ("chrome names the
  rung, never the stop") has no instrument, and `--color-solver-ink-2` now points at a chrome
  token, which is the direction r0's law was written to forbid. That wants a gate or a
  disposition, not an argument.

## Strengths

- The sentence is one sentence and the numbers carry it: off-anchor share 64.29 % → 0.13 /
  0.09 light and 49.15 % → 2.21 / 2.28 dark, kinship 0.0° / 0.3°, and not one new colour byte
  (all three rungs already shipped).
- The two inline `rgba(196,181,253,…)` literals are gone and the painted filter carries the
  resolved token — visible in my own HEAD/proto census diff, not just in the lane's 5/5 runs.
- The confirm's ground died on a measurement (4.49 / 4.20 under AA) instead of on taste, and
  the compound hover selector keeps the red where the estate's boxed-control rule would have
  erased it.
- The chair was obeyed to the letter: `FRAME_PAD` at HEAD (§6.2), the focus-ring token read and
  never written (§6.1), r0 untouched with the kinship instrument MOVED as a diff, and the
  defective inline-literal row replaced with the claim it was written for rather than re-worded
  to pass.
- The lane reds its own headline gate and publishes the mechanism. That is the behaviour the
  loop is for.

## The exact open gaps

1. G0 is RED: the section cure does not change the painted gauge in WebKit (691 vs 2,719 px at
   one write of twenty, identical DOM) — close it by baking the slice (`probe/cure.crit.ts`
   shows 1.006× engine agreement) and re-running the four declaration arms.
2. The tape occludes the trace on a 4×4 board from fill 1 (209–266 px, both engines, desk) —
   close it with a lay-down condition on `writable` (or `TAPE_FILLS` scaled to the deal), and
   re-run the arm at 4×4, 9×9 and 16×16.
3. The tape never lifts when a deal stalls below three fills (measured at 4.2 s, both engines) —
   close it by arming the rest on a dwell after any fill, and pin it as a unit row.
4. The lesson is taught twice on one deal after an undo to empty (both engines) — close it by
   setting `taught` at the lay-down, and pin the pre-rest undo as a unit row.
5. The tape's board π is unmeasured: 2,719 px² of two cells and 464 px² of a glyph box at the
   desk — close it by declaring the cell overlap with a number, at every viewport, or by
   lifting the tape off the cells.
6. `.count-tape` has no print or forced-colors arm; it prints, in both engines — close it in
   the same block that blackens `.progress-trace`.
7. `poseLengths` returning 0 disables dashing and paints the whole ring — close it with a
   born-RED unit on a degenerate pose and a guard that fails to "nothing drawn", never "all".
8. G9's alias law cannot fail: three ALIAS-ONLY tokens where HEAD had none, and the script
   exits 0 — close it by giving the alias law an exit code with the named ramp admitted, or by
   striking the gate.
9. Law 20's amendment ("the anchor hue may be named, chrome names the rung") has no instrument,
   while `--color-solver-ink-2` now reads a chrome token — close it with a probe or an owner
   disposition.
10. The goldens were not run (cell-light's declared delta, grid-corner-light at HEAD's pad,
    non-board 0 px); R6's heading census and R3's wobble census were not re-read; the
    controls-card four-tag computed-style census was not run (I ran the bounding-box half:
    ≤0.55 px, which contradicts "equal to the hundredth").
11. The ratio ledger and the 5/5 glow runs were measured on the DEV server; only the filter
    census ran against the built dist — close it by re-reading both rows off the dist.
12. `check-prod-shake`, `check-golden-bytes`, `check-support-floor`, `check-unit-count`, `knip`
    and `eslint` were not run in the worktree.
13. The 16×16 arm is unmeasured: a three-digit count widens the tape and nobody has looked at
    `3 of 200 on the board` against a 16-column board.
14. G4's fourth arm is unread (webkit dark returned no `svg path` under `.guard-leave
    .guard-face`) — close it by selecting the outline's own node instead of a bare `svg path`.

## Crops

`frames/1-tape-on-the-front-4x4-desk-light-chromium.png` — 330 × 130, 11.4 KB: a 4×4 board at
ONE write of four, desk light chromium. The violet front runs the whole top edge and passes
under the tape that reads `1 of 4 on the board`. This is the claim the top-right anchor was
chosen on, falsified in one picture; every other reading in this critique is a number.

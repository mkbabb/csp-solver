# ACC-FIVE — pass-3 PROTOTYPE (it RUNS)

Worktree `.claude/worktrees/wf_f72f3b5a-83a-41`, branch `master`, base `74a2b5d9`, uncommitted.
Prototype server :4236, HEAD control :4237 (`git archive 74a2b5d9` into the scratchpad — the
worktree carries the prototype, so the control cannot be served from it). Both killed; 4236/4237
read free at return. Private `cacheDir` each. Every board colour below is PIXELS through a
`sharp` byte read-back off a real screenshot; every computed-style read waits out the tweens.

## The replay

`git` aimed at the pass-2 worktree is refused by this session's isolation (the chair's stated
fallback). Route taken: `git archive a8fee1f5 web/frontend` into the scratchpad, `diff -u` against
the pass-2 worktree, headers rewritten to `a/` `b/`, `git apply --3way`. 3-way had no blobs and
fell back to direct application, which succeeded at the fold's offsets. **+310 / −83 over 7 files
— the pass-2 critique's own figure, to the line.** `GameControlPanel.vue` is the only FOLDMOVED
file (the fold's +7); its single hunk landed at `:2084` and `git diff 74a2b5d9` shows that hunk
and nothing else, so the fold's twelve picks are intact. vue-tsc exit 0 on the replay before any
pass-3 edit.

## What pass 3 changed on top of the replay

| # | file | what |
|---|---|---|
| 1 | `index.css` | law-25 amendment REVERTED (HEAD's sentence restored verbatim); the earned condition re-stated beside `--color-progress-ink`; `#a47903`→`#a87e13`, `#7d6902`→`#79650f` with the PAINTED ledger + corridor + the C ≤ 0.10 cost; `.attribution-tape` print + forced arms; `prefers-contrast: more` → 12u + `--color-gold-ink` |
| 2 | `HandDrawnGrid.vue` | `stroke-opacity` 1; the FRACTION tweens on the estate's own `createSequenceSubscription` with `poseFronts` re-cut per frame; PRM lands the fraction in-frame; `MOTION.traceWinMs` dies, two HEAD literals v-bound as CONSUMED rung values |
| 3 | `pencilConfig.ts` | **reverted whole** — pass 2's `traceWinMs` was a second ladder (registry §2.1's tell) |
| 4 | `gridPaths.ts` | `poseLengths` un-exported (knip red: an export with no consumer); the "the front STEPS" docstring re-cut — the price is now PAID, not declared |
| 5 | `DifficultyTally.vue` | `poseFronts` replaces `pathLength`+dash (hygiene to §10) |
| 6 | `HandwrittenGlyph.ink.test.ts` | NEW — G6's unit half, born-RED proven |
| 7 | `check-ink-pressure.mjs` | KIN (OKLCH, KIN_DEG 5) + CORRIDOR rows + two negative controls |
| 8 | `check-theme-tokens.mjs` | the alias law with an exit code + its plant |
| 9 | `e2e/progress-corridor.spec.ts` | NEW — the painted corridor, both grounds, both themes |

## The numbers (prototype :4236 vs HEAD control :4237 = `74a2b5d9`)

### G2 · THE CORRIDOR, PAINTED — the spec reproduces to the byte

Modal-of-run core over **24/24 columns**, chroma floor 0.05, board filled to `valuenow 65` by the
product's own Hint (correct digits, so the board stays solvable).

| | modal painted | h | vs LINE | vs PAPER | worst |
|---|---|---|---|---|---|
| light, both engines | `rgb(168,126,19)` = **#A87E13** | 83.9° (Δ0.2 off crayon-gold) | **3.505** | **3.646** | 3.505 |
| dark, both engines | `rgb(121,101,15)` = **#79650F** | 94.5° (Δ0.7) | **3.303** | **3.280** | 3.280 |
| HEAD light (chromium/webkit) | `rgb(134,89,235)` | 293.0° (Δ150.7) | **2.876 / 2.883** | 4.444 | **2.876 — FAILS 1.4.11** |
| HEAD dark | `rgb(128,65,235)` | 294.1° (Δ161.1) | 3.139 | 3.451 | 3.139 |

Spec predicted 3.505 / 3.646 light and 3.303 / 3.280 dark. **All four exact.** The grounds the
probe found are the spec's own: light line `(49,49,49)` paper `(253,253,252)`; dark line
`(199,197,190)` paper `(19,18,17)`. chromium == webkit to the byte on the modal.

### G2 · THE ALPHA — the unpriced lever, priced

Computed `stroke-opacity` **1** on the gauge against **0.95** on the frame: the gauge is the one
opaque stroke on the board. The same painted ink forced back to 0.95, same page, same instrument:

| | worst at α 0.95 | worst at α 1 | bought |
|---|---|---|---|
| light | 3.366 | 3.505 | +0.139 |
| dark | 3.081 | 3.280 | **+0.199** |

Spec predicted +0.19 / +0.21 and a dark control of 3.081 — the dark control is exact.

### G3 · THE WIN — and the ablation is stronger than the spec asked

`hasSolveSuccess` true, `valuenow` 100, at **all five** of 900/1800/2700/3600/5000 ms in **all
four** engine×theme cells.

| | post-win computed stroke | painted modal | vs LINE | vs PAPER | Δ band-median L, fill → win |
|---|---|---|---|---|---|
| light | `rgb(201,154,46)` = **#C99A2E** (`--color-gold-star` → crayon-gold) | same | **5.046** | **2.533** | **+0.0944** |
| dark | `rgb(229,199,77)` = **#E5C74D** | same | **1.037** | **11.234** | **+0.3217** |

5.046 / 2.533 and 1.037 / 11.234 are the spec's decided numbers, exact. Hue distance from
crayon-gold at the win: **0.0°**, every cell. The gate wants ΔL ≥ 0.09; light clears at 0.0944 —
**by 0.0044, and that thinness is a finding, not a pass** (§Gaps).

**THE LAYERED ABLATION.** The dead rule re-stated inside `@layer base` (the only way to beat an
`!important` in `utilities`): `columnsWithGauge` falls to **0** (chromium/light, webkit/dark) or
**1–2** (chromium/dark, webkit/light) — and those 1–2 survivors paint `rgb(182,186,253)` and
`rgb(101,89,223)`, which is the **solver rainbow of the solved digits**, not the frame. So the
trace is not merely *a* carrier of the win's gold; with it suppressed the band holds no gauge
pixel at all. Reported as ADJUSTED against the spec's "ΔL 0.000": that figure was about the baked
`.grid-line` arm, and the arm actually run here is a stronger claim in the same direction.

**HEAD's win**, same instrument: `modal null`, **zero** columns above the chroma floor at 5000 ms,
both themes, both engines — the trace is `opacity: 0` there, so the win paints no chromatic pixel
in the band. G3's born-RED, measured rather than asserted.

### G0 · the segment count, read off the control

HEAD's shipped gauge: `pathLength="1000"`, `stroke-dasharray="1000 1000"`, **493 segments**,
`stroke-opacity 0.95`. The prototype: no `pathLength`, no dash, **320 segments** at 65% fill (a
cut pose), `stroke-opacity 1`. 493 confirms ACC-GRAPHITE/ACC-SIX and falsifies pass 2's
25-segment stub directly on the control.

### G6 · the digit

Painted, in the cell the probe TYPED INTO (remembered by index — the earlier cut read a given and
got `rgb(10,10,10)`):

| | painted | Δ hue off crayon-blue | resolved stroke |
|---|---|---|---|
| light, both engines | `rgb(2,111,196)` = **#026FC4** | **0.17°** | `rgb(2,111,196)` |
| dark, both engines | `rgb(70,166,254)` | **0.11°** | `rgb(71,167,255)` = **#47A7FF** |

5.065 light / 7.258 dark against the cell ground. The unit half (`HandwrittenGlyph.ink.test.ts`,
4 rows) is **born-RED**: restoring `var(--color-user-ink, #2563eb)` reds 2 of 4; the restore
returns 4/4.

### G1 · kinship, and G8 · the alias law

`check-ink-pressure` bare, OKLCH through `var()`:

```
light --color-progress-ink h  83.9  L .618 C .122   Δ0.26° off --color-crayon-gold
light --color-user-ink     h 251.2  L .537 C .156   Δ0.18° off --color-crayon-blue
dark  --color-progress-ink h  94.5  L .512 C .100   Δ0.75°
dark  --color-user-ink     h 249.4  L .711 C .157   Δ0.04°
```

Against HEAD's tokens the same gate reds **4 rows** (progress-ink 151.0° light / 162.2° dark off
gold; user-ink 11.5° light / 5.3° dark off blue). Self-test: the 6° OKLCH rotation is a real
rotation computed through the inverse matrices, and blunting `KIN_DEG` to 90 makes the self-test
report it **vacuous** — so the negative control is proven non-vacuous, not merely green.
`check-theme-tokens`: 0 strays ⊆ the three-name allowlist; the planted fourth alias reds.

## Gaps — every one, including "and then the hard part"

The banked numbers are real and were taken on the real surface. These were NOT taken, and the
brief asked for them. They are the honest edge of this prototype.

**Measured nowhere (the largest one first).**

1. **G10, the tween's COST, is unmeasured at this base.** The fraction tween is built, typechecks,
   and the full battery is green — but I never timed the ≤15 `d` re-cuts per write, nor the frame
   p95 against a no-rewrite control, nor the PRM arm's 0 re-cuts, on the prototype. Pass-3
   research §6 timed the same shape on HEAD (chromium 8.3→8.3 ms median, webkit 17.0→17.0, p95
   +4 ms); that is research's reading of HEAD, not mine of this tree. **A per-frame re-cut shipped
   without its own frame-cost row is the one thing in this diff that could be expensive and look
   free.** The `BENCH` shape to run it with is already in `pass3/research/ACC-FIVE/probe/r2-paint.mjs`.
2. **The e2e spec was written and never executed.** `e2e/progress-corridor.spec.ts` is authored
   against the estate's Playwright config; the corridor it asserts was proven by my own probe with
   the same arithmetic on the same surface, but the SPEC file itself has not been run, so its
   selectors, its `fillByHint` drive and its 24-column expectation are unverified as code. An
   unrun gate is not a gate.
3. **G0's five-arm segment sweep did not run.** `instruments/p3-g0-segments.mjs` is written
   (25/123/246/493/599 × 2 engines × dpr 1+3, CSS-form and 4-subpath controls) and was never
   executed. What IS measured: the HEAD control ships `pathLength="1000"` + `stroke-dasharray` on
   a **493-segment** ring, and the prototype ships neither — which confirms the count pass 2 got
   wrong, but is not the sweep.
4. **G5 (the verb), G7 (the glow + filterBudget + the dist union), G9 (the per-anchor census)** —
   none measured. The GameGallery and GameControlPanel hunks are pass-2's, replayed; the pass-2
   critique reproduced the verb at 4.917 rest / `#D02A52` byte-identical in both engines, but that
   is a pass-2 reading at `a8fee1f5` and is labelled as such. **No dist was built in the worktree**,
   so the filter census and the 45,572 / 6,673 union rows are absent.
5. **π was not run.** No `rect-census-fold.mjs` prototype-vs-control pass, no R6 heading census,
   no R3 wobble, no golden deltas. The `cell-light` claim (~2,292 px by the pen's ink alone) is
   **not re-derived here** and must not be carried forward as if it were.
6. **The phone was never opened.** 393×699 dpr3 is unmeasured this pass — which matters because
   the `prefers-contrast: more` arm is *specified from the phone's 0.73 px flank* and that flank
   was not re-read.
7. **G4's three arms are authored, not verified.** print / forced-colors / `prefers-contrast: more`
   are in `index.css` at the right layers, but no emulation run confirms what they paint.
8. **Two crops, not four.** The armed confirm hovered and the twenty-writes webkit strip are
   missing; the second needs the tween probe of gap 1.
9. **F1's two arms were not framed.** §12 states the palette for both, but PLR-SELF's flag was
   never flipped on a server to read the pen's painted hue solo vs in-room.
10. **No r0 instrument was proposed as a diff.** `oklch.COPY.mjs` was copied and re-pointed; no r0
    row is reported MOVED, because no r0 instrument whose subject moved was re-run.

**Findings that adjust the spec rather than confirm it.**

11. **The node CORRIDOR gate is NOT born-RED at HEAD.** Run against `74a2b5d9`'s tokens,
    `check-ink-pressure` reds on the four KIN rows and the corridor row stays GREEN — because token
    arithmetic gives HEAD's violet 3.57 light where the PAINTED reading is **2.876**. This
    vindicates the spec's own instruction that the painted row governs, and it means G2's node arm
    is a drift guard, not the gate. Stated rather than smoothed.
12. **G1's HEAD figures differ from the charter's.** The charter states "RED at HEAD (11.5° /
    41.3°)". Measured: user-ink is **11.5°** off crayon-blue light (exact) and 5.3° dark; but
    progress-ink is **151.0° light / 162.2° dark** off CRAYON-GOLD. The 41.3° is the violet's
    distance to its NEAREST anchor (G9's framing), not to gold, which is the pair my KIN table
    asserts.
13. **G3's light arm clears by 0.0044.** ΔL band-median fill→win is **+0.0944** light against a
    ≥0.09 floor (dark is +0.3217). It passes; the margin is one part in twenty of the floor and
    should be treated as a reading to watch, not a cleared bar.
14. **The layered ablation is stronger than "ΔL 0.000".** Suppressing the trace in `@layer base`
    leaves **0 gauge columns** (chromium/light, webkit/dark) or 1–2 whose pixels are the SOLVER
    RAINBOW (`rgb(182,186,253)`, `rgb(101,89,223)`), not the frame. The spec's 0.000 was about the
    baked `.grid-line` arm; the arm actually run here says the trace is the only thing painting
    the win's gold.
15. **`#7D6902` survives once in `index.css`, inside a COMMENT** — the corridor ledger citing pass
    2's rejected hex with its measured reason (0.1584, 0.006 over the ceiling). No declaration
    carries it. A literal grep-based G11 will see it; it is a record, kept on purpose, and named
    here so nobody has to discover it.
16. **`poseLengths` was un-exported** (knip red at HEAD of this diff: an export with no consumer).
    The spec's §1 hand-off of arc length to ACC-SIX / the §10 tally therefore travels THROUGH
    `poseFronts` today. If either wants the raw number, it exports with its consumer.
17. **`check-copy-register` was run as `lint:copy` (= `--self-test`), not bare.** The self-test
    runs the gate and then its controls, so the bare result is contained in it — but the brief said
    BARE and this is the difference.

**Route notes the agglomerator needs.**

18. The HEAD control is `git archive 74a2b5d9` into the scratchpad, with `csp-solver/` symlinked in
    (vite's TIERS plugin reads the puzzle bank at `buildStart` and refuses to boot without it).
    Declared because it is not a worktree and does not appear in any `git worktree list`.
19. `GameControlPanel.vue` was the only FOLDMOVED file. The replay's single hunk landed at `:2084`
    by offset, not by hand-resolution, so there is no "re-cut toward the fold" list beyond naming it.

# PASS 5 — LANE D · INK + RECORD TRUTH

**Tree `66fa5856`** (T5-W3 record). Artifact of record: `dist/assets/index-C5xqWLHq1mLl.js`,
md5 `2b16a65d0f79cbb50799adf184edca65`, built from a clean tree and frozen as a snapshot served
on **:4253** (lane D's own port — :4241 was already Lane BC's, :3000 is the foreign palette-api
and was reused, never squatted). Every figure below is either the stdout of a banked run or the
output of an instrument in `rig/` that anyone can re-run; where a figure could not be re-derived,
it says so.

Order of record: `pass4-registry.md` §2 "Lane D", items (1)–(4), verbatim.

| # | order | verdict |
|---|---|---|
| 1 | republish the flake rates; correction note beside `64fa37a4` | **CLOSED** |
| 2 | print the pre-settle 21 beside the settled 9, settle-window argument in the open | **CLOSED** |
| 3 | the re-baseline ratification row, recorded verbatim with its breach clause | **CLOSED** |
| 4a | BEFORE arm or a movement disclaimer on the ink witnesses | **CLOSED** (disclaimer, argued) |
| 4b | a webkit arm for at least the six ship-4 surfaces | **CLOSED** (both engines, both themes, 24 witnesses) |
| 4c | one assertion or golden per ship-4 surface | **CLOSED** (closure 4, in the repo, in CI, born-RED) |
| 4d | the ink rig's stderr banked | **CLOSED** |
| 4e | `lint:ink` executed on a runner, run id banked | **CLOSED FROM THE FIELD** (re-verified) |
| 4f | the coarse area row given its own control | **CLOSED** (ablation-RED, both engines) |
| 4g | ship-1's 0.00px-margin sentence written | **CLOSED** (§7) |

---

## 1 · THE RATES, REPUBLISHED — order (1)

Full note: **`correction-64fa37a4.md`**. Instrument: `rig/crest-rate-tally.mjs`; transcript:
`logs/crest-rate-tally.log`. The headline the registry demanded, re-derived rather than quoted:

**`toggle-crest-dark`, pass-4 post-remint: ✓ 6/11 · ✘ 5/11 — a red rate of 45.5%**, red in r2,
r3, r4, FINAL-1 and FINAL-3. The pass-4 dossier's §2/§10 published ✓ 7/11 · ✘ 4/11 and "~36%".

**Commit `64fa37a4`'s body:** "green 6/8 here, reding twice" against **5 green / 3 red** on the
eight runs then on disk. Its other claim — "green 6/6 in pass 3's banked logs" — is CORRECT and
re-derives (BASE 3/3 + HEAD 3/3, zero red). The commit body is not rewritten; the correction note
sits beside it and the pass-4 dossier carries an ERRATUM block at both sites (`D-report.md` §2,
§10) with the wrong figures left visible so the erratum can be audited.

Nine other arms are tallied in the same table, because a rate published without its neighbours is
how this subject got miscounted twice. Two of them earn their place:

- **MEASURE, non-author, same host, same day: 0 red in 8.** D read 5 in 11 and F3 read 5 in 14 in
  the same window. Three instruments cannot disagree that far about a tree; they can disagree
  that far about a session — which is the sun-crest clause's claim, now measured rather than
  asserted.
- **The lead's row 8 re-derives exactly.** W3-verify's HEAD-only control: 6 runs, 5 over the
  0.017 floor, 1 byte-identical, worst 1,028 px. Its W3-dist arm reads 1 over / 2 under / 3
  byte-identical on the same instrument.

Pooled across the pass-4 host-day: 43 green · 13 red · n=56 · **23.2%** — printed, and disowned
in the same breath: pooling assumes exchangeability, which session-sensitivity denies. No rate
here authorises a re-baseline. CH-42 stays WATCH-ONLY; disposition unchanged (branch-C
crop-tighten POST-W4).

**Two further record defects surfaced while counting**, both in `correction-64fa37a4.md` §3:
the pass-4 §5 table names `.margin-note` where the ink lives on `.margin-note-meta`; and
`chronic-ledger.md:96`'s "12/25 vs 19/25" reconciles to no arm in the corpus (the r3 audit
already marked it UNKNOWN, and a full walk confirms it). The second is another author's file —
flagged, not edited. New gap, §8.

## 2 · THE PRE-SETTLE 21 — order (2)

`filterBudget.ts` now carries the window as a table row and an argument, not a footnote:

```
  scene    rule                                 total  what the delta is
  board    own display ≠ none (this budget)       9    —  ← SETTLED, and the gated number
  board    display NOT consulted (perf-rig)      13    +4 HandDrawnGrid `.baked-hidden` poses
  board    PRE-SETTLE cold load, EITHER rule     21    +8 svg.rest-pose +4 g.logo-pose
  gallery  own display ≠ none                    17    …
  gallery  display NOT consulted                 21    both deltas at once
```

Re-derived from the lane's own phone log (`pass4/logs/D/r3b.jsonl`, board arm, real MobileSafari
iOS 19, 393×699 dpr3): `censusBeforeDeal` = **spec 21 · device 21**, rows
`svg.rest-pose.is-pose-active 2 + svg.rest-pose 6 = 8`, `g.logo-pose.is-active 1 + g.logo-pose 3
= 4`, on top of the settled nine (`g` 2 · toggle-sun 1 · toggle-moon 1 · boil-pose 3+1 ·
sparkle 1). 9 + 8 + 4 = 21, which is the arithmetic the pass-4 dossier never printed.

**Why both rules agree at 21 and only there** — the fact that makes the window legible: before
the bake lands nothing is `display: none` yet, so the spec rule and the perf-rig rule count the
same population. The same log's `censusAfterDeal` reads 9 / 13: the eight rest poses are gone,
the wordmark's four leave with the boot scene, and four `.baked-hidden` fallback poses stand in
their place — which is exactly the +4 the two rules disagree about from then on.

**The settle-window argument, in the open** (now in the file, not in a dossier): the gate measures
the settled scene BY CONSTRUCTION — `settleBoard` waits on the bake and on zero running
animations — and that is the right subject for an exact-match allowlist, because a boot-window
census would red on host load rather than on a new surface. It is a deliberate scope, not an
unmeasured one. §4's flat sentence is qualified in the file to the settled scene it is true of.
**The 21 is UNGATED**, and the trigger to gate it is named beside it: a second cold-load reading
above 21, or any evidence that the boot window carries a beat-driven re-execution.

The settled census was re-derived at HEAD while I was there: **12/12 green, both engines**
(`logs/census-green-both-engines.log`), and the file's "9 / 9, both engines" citation now names
the pass-5 re-derivation beside the pass-4 one.

## 3 · THE RATIFICATION, RECORDED — order (3)

Full record: **`ratification-logo-light.md`**. The lead's row 6 is quoted whole; the breach
clause is repeated at the same rank as the ratification, with its pedigree (`pass4-registry` §5
row 6 → `pass3-registry` §2 "not any lane" / §4 row 6 "team-lead election"):

> **The D-M3 process breach stands booked and this ratification may NOT be cited as precedent for
> lane-executed re-baselines.**

What it settles: the baseline byte stands (24,161 → 24,062 B), no revert. What it does not: it
does not retire D-M3, licence any lane to re-mint any golden, or make "the evidence was strong
enough" a route around a work order. The confirmation leg the lane did not produce was
re-derived rather than quoted — W3-verify reads `logo-light` **byte-for-byte identical, 0 px, in
all 6 runs of both arms** (12 readings). The subject is inert on the tree the pass-5 lanes build
against, which is what a correct baseline looks like.

## 4 · THE SHIP-4 SURFACES GET GATES — order (4c), and it is the pass's real deliverable

`check-ink-pressure.mjs` gains **closure 4, the ship-4 census**: five rows here plus closure 3's
armed sublabel = **six surfaces, six assertions**, in the repo, running in CI on every push
through `lint:ink`.

```
  1  .keyboard-legend         color: var(--ink-press-quiet)
  2  .legend-row kbd          border: var(--ink-press-rule)
  3  .legend-sep              no `opacity` declaration
  4  .margin-note-meta        color: var(--ink-press-quiet)
  5  .icon-sublabel.is-armed  color: var(--color-red-ink)      ← closure 3 already owned it
  6  .vignette-meta           color: var(--ink-press-quiet)
```

The design decision worth stating: each surface is pinned to the **rung**, never to a number. The
rung's floor is already gated in all three scopes, so pinning the surface to the rung gives the
surface a rendered-contrast floor transitively, and one gate keeps telling the truth when the ramp
moves. A surface that reverts to an open-coded percentage loses its rung and reds here; a rung
that drifts under floor reds in `gateFloors`. Row 3 is an ABSENCE row — ship 4 deleted an
`opacity: 0.7`, so there is no token to name and the assertion is that the declaration stays gone.

**BORN RED, twice, banked before the cure** (`logs/gate-ship4-BORN-RED.log`):

- **Run 1** — five of five rows red on a HEALTHY tree. The gate was blind to CSS comments, and
  every one of these rules carries a `/* was 55% … */` note between the previous `;` and the
  declaration. A gate that reds on a healthy tree is a broken gate, and born-RED is what surfaced
  it before it could ship.
- **Run 2** — comment-blindness cured, and the run was deliberately taken with the pass-4
  dossier's own selector name. One row red, isolated: `.margin-note` is a real rule that carries
  no ink. The record defect is in a transcript rather than in a claim.

**All three failure modes probed one at a time** (`logs/gate-ship4-GREEN.log`), config mutated,
tree never touched: token off its rung → red by name; absence violated → red naming the
declaration; selector renamed → red as unanchored. `--self-test` carries all three plus a
coverage check that reds if a row is ever dropped from the six.

**An unplanned live test of the gate, worth recording.** The pass-5 lanes share one working tree,
and while this lane worked another rewrote `GameControlPanel.vue` by ~375 lines — the file
closure 3 reads for surface 5. `npm run lint:ink` was re-run against that live tree at close and
exits **0**, all six rows anchored. The gate's first encounter with a real refactor was not a
rehearsal.

## 5 · THE RENDERED WITNESSES — orders (4a), (4b), (4d)

`rig/ink-witness.mjs`, **chromium + webkit, light + dark: 24 witnesses, 0 unreachable**
(`logs/ink-witness-STDOUT.log`, 24 crops in `shots/`, largest 33 KB against the ≤150 KB policy,
plus `witness.json`).

**The movement disclaimer, written where it belongs — in the rig's own header:** these witness a
STATE, not a MOVEMENT. There is no BEFORE arm and there will not be one — the pre-ship-4 values
were open-coded percentages that exist in no buildable tree, and a reverted-tree crop would
witness a fabrication rather than a history. What the rig prints instead is the AFTER reading
measured (computed ink, computed paper, WCAG contrast between them) beside the pre-ship-4 ratio
the dossier recorded, so the movement is legible as two numbers on one line without either
pretending to be a photograph of the past. The thing that actually stops a regression is closure
4; the rig is the eye.

| # | surface | rendered light | rendered dark | ship 4 moved it off |
|---|---|---|---|---|
| 1 | `.keyboard-legend` | 5.25 | 6.05 | 55% · 3.53 / 4.36 |
| 2 | `.legend-row kbd` | 3.54 | 4.36 | 40% · 2.36 / 2.87 |
| 3 | `.legend-sep` | 5.25 | 6.05 | opacity 0.7 · 2.877 |
| 4 | `.margin-note-meta` | 5.20 | 6.11 | 62% · 4.34 |
| 5 | `.icon-sublabel.is-armed` | 4.99 | 6.30 | crayon-rose · sub-AA light |
| 6 | `.vignette-meta` | 5.20 | 6.11 | 62% · 4.34 |

Identical in both engines to the hundredth in every cell. **An unplanned cross-check fell out of
it:** the static ladder computes quiet 5.23/6.06, rule 3.53/4.36, red-ink 4.98/6.32 out of
stylesheet algebra; the rig measures 5.25/6.05, 3.54/4.36, 4.99/6.30 off `getComputedStyle` over
the real paper. Two instruments, two methods, agreement to ±0.02.

**The stderr is banked, and both runs are kept** (`logs/ink-witness-STDERR.log`). Pass 4's minor
was that the rig swallowed a failed crop into a stream nobody kept; this rig exits 1 on any
unreachable surface and names it. Run 1 exited 1 with six named misses, and each was a real
finding rather than a rig defect:

- `.margin-note-meta` is **v-if'd away at 1700×1000** — the vignette owns the tally at the wide
  rungs and the strip keeps it below 1280, so **one width cannot witness surfaces 4 and 6**. Pass
  4 cropped the pair from one context. The rig now takes a second 1100×900 context for surface 4.
- Surface 5 missed in 2 of 4 cells because `clearArmed` gates on `isCoarse && isDirty` and
  **re-disarms after a 2.5 s lapse** — the witness has to dirty the board and read inside the
  window. Three attempts, each verified through the button's own `aria-label`, not through a
  sleep.

## 6 · `lint:ink` ON A RUNNER — order (4e), closed from the field

The lead closed this at row 7; Lane D's item is to record it, and the record is re-verified
against the API rather than copied:

```
run    30734036107   ci   conclusion success   head_sha 9061b8c1826b0e65f094e85b1854ef82ad42d5a8
job    91460503817   "frontend"   success   2026-08-02T05:24:03Z → 05:24:36Z
step   13   "ink pressure (graphite ladder + ramp ownership, self-tested)"   success   05:24:34Z
```

Parse-verification is retired. The step ran `npm run lint:ink` — i.e. `--self-test` — so the
runner re-proved every gate able to fail before trusting the green. From the next push, that same
step also carries closure 4's three new modes and its coverage check.

## 7 · THE MINORS THAT ARE SENTENCES — orders (4f), (4g)

**(4f) The coarse union-area row has its own negative control** (`logs/gate-coarse-area-CONTROL.log`).
Pass 4's controls moved the DOM (control A) and the ROW budget (control B); in the coarse arm
control A stops at the population assertion before assertion (d) is ever reached. Moving the
COARSE BUDGET instead — 6,488 → 5,900, source, reverted after the run — leaves (a), (b), (c)
exact and reds (d) alone, in **both engines**, naming the delta:

```
Error: [coarse] union raster area 6488 vs budget 5900 ±118 CSS px²
```

The row regime stayed green in both engines in the same run, so the control is scoped as well as
sharp. It also re-derives the coarse union at **6,488 exactly** at HEAD, identical chromium and
webkit.

**(4g) Ship 1's healthy-pose margin, said plainly.** At the healthy pose the durability bound is
an **identity, not a margin**: `btn.h` is `auto` and equals `die.h + labelH + padY + gap`, so
54.38 demanded against 54.38 delivered is **0.00 px of headroom inside a 0.5 tolerance** — the
row's slack is half a pixel by construction. The bound has real range only in the direction the
defect travels (height pinned, die squashed, width intact), which is why it is written against
`die.w`, and the GATE-1 control is what proves it can fail rather than the margin. Anyone reading
"54.38 ≥ 54.38 − 0.5" as headroom is reading a tolerance as evidence.

*Placement note:* the natural second home for that sentence is a comment at
`e2e/visual-regression.spec.ts:491`, beside the bound itself. That file is **outside Lane D's
fence** and another lane has it open in this pass, so the text is banked here for the
agglomerator instead of edited in — proposed insertion above the `demanded` assertion, verbatim
from the paragraph above.

## 8 · WHAT I OPEN (new gaps, Lane D)

1. **`chronic-ledger.md:96` (CH-42) publishes "12/25 vs 19/25", which reconciles to nothing.**
   Confirmed against every banked crest log in the corpus; the r3 goldens-estate audit reached
   the same verdict independently and marked it UNKNOWN. The replacement table exists
   (`logs/crest-rate-tally.log`). Another author's file → **agglomerator row**, not a Lane-D edit.
2. **`npm run lint:eslint` is RED in the working tree on an untracked scratch file** —
   `web/frontend/probe-tmp.mjs` (`2:14 'process' is not defined`), not Lane D's, live at 02:05.
   Harmless if it never lands; it reds the estate's lint gate while it sits there. Flagged for
   whichever lane owns it; deliberately not deleted, since it is somebody's in-flight probe.
3. **The pre-settle 21 is measured on ONE device arm, one session** (`r3b.jsonl`). It is printed
   and ungated with its trigger named, which is the honest disposition — but the pass-6 audit
   should read it as n=1, not as a second gated number.

## 9 · GATES RUN, ALL BANKED

| gate | result | log |
|---|---|---|
| `filter-census` both engines, built dist | **12/12 green** | `logs/census-green-both-engines.log` |
| coarse union-area ablation control | **RED as required, both engines; row arm green** | `logs/gate-coarse-area-CONTROL.log` |
| closure 4 born-RED (×2) | **RED before the cure** | `logs/gate-ship4-BORN-RED.log` |
| closure 4 + `--self-test` | **green, 3 new modes probed** | `logs/gate-ship4-GREEN.log` |
| ink witness, chromium + webkit | **24 witnesses, 0 unreachable** | `logs/ink-witness-{STDOUT,STDERR}.log` |
| **`e2e/a11y.spec.ts` (the W3 floor)** | **30/30 passed, both engines** | `logs/a11y-floor-30.log` |
| `vue-tsc -b` | 0 | §static |
| `prettier --check src/` + scripts | clean | §static |
| `test:e2e:projects` · `test:support-floor` | PASS / PASS | §static |

**W3 floors held**: a11y 30 rows green, options 5/5 among them, k-peek and `guardTitle` rows
green. Lane D moved no component and no golden byte: the source diff is `filterBudget.ts`
(comment lines only — the non-comment diff is empty) and `check-ink-pressure.mjs` (one new gate,
its self-tests, one printed block).

**π identity**: no golden was re-minted, re-baselined or touched by this lane. The four campaign
goldens are untouched; the only baseline conversation here is the RATIFICATION of someone else's,
recorded in §3 with its breach clause.

**U-10**: nothing in this lane closes a design mark. These are gate and record rows; the marks
that need the owner's eye are named in the wave charter and stay conditional there.

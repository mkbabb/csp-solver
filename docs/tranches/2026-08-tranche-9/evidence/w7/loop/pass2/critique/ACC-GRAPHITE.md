# ACC-GRAPHITE — pass-2 CRITIQUE (adversarial, non-author)

Critic: Opus 5, 2026-09-18. Read in this order: `pass2/CHAIR-RULINGS.md`, then
`pass2/synthesize/ACC-GRAPHITE.md`, then `pass2/prototype/ACC-GRAPHITE/README.md` and the whole
of `git -C .claude/worktrees/wf_8630d340-e56-40 diff` (14 files, +557/−151, pass 1 + pass 2).
Three frames looked at. Own instruments run on the prototype's own worktree, served on
**:4243** (private `cacheDir`), with the main tree's built dist served on **:4244** as the HEAD
control; both killed and both ports verified free. Readings under
`critique/ACC-GRAPHITE/readings/`, instruments under `critique/ACC-GRAPHITE/probe/`. The
worktree was restored to exactly its 14 modified files.

**Verdict: ADVANCE at 82%.** The family runs, it is measured harder than any pass-1 lane, and
its own prototyper refuted two of its headline claims rather than smoothing them. What keeps it
off 100 is not taste: three declared numbers do not match what paints, one shipped source
comment asserts a law this lane's own instrument killed, one decided-history row moved without
being reported, and the tally's central law has a discontinuity its gate is constructed not to
see.

---

## 0 · What I re-derived myself

| what | my reading | the prototype's | agrees |
|---|---|---|---|
| G-WASH `.cell-peer` nodes / sub-unit-opacity, 9×9 selection, 4 arms | 20 / **0**; 0 sub-unit nodes anywhere on the board | 20 / 0 | ✓ |
| painted wash, light / dark, both engines | `color(srgb 0.15 0.15 0.15 / 0.06)` · `color(srgb 0.82 0.812 0.78 / 0.06)` | identical | ✓ |
| live root tokens | `--color-crayon-blue` **empty**, `--color-focus-sketch` `#3a7bc4`, `--color-user-ink` `hsl(0 0% 15%)` / `hsl(48 10% 80%)` | identical | ✓ |
| tally paint | `stroke-dasharray: none`, `pathLength: null`, `stroke-width 10px`, `linecap butt`, pose `matrix(0.968…)`, `transition: opacity 0.5s` | identical | ✓ |
| `check-ink-pressure` bare · `check-copy-register` bare | exit 0 · exit 0 (0 dashes, 2 admitted jargon) | 0 / 0 | ✓ |
| `useSession.test.ts` + `DigitCell.test.ts` | 2 files / 63 tests, 0 failed | part of 66/812 | ✓ |
| **focused band, raw pixels, desk light** | **16.0 px** against a 6.0 px neighbour rule (**2.67×**) | peak 15.0 px, 1.97× the 7.63 px frame | ✗ see §1 |
| **tally subpaths at written = 20, desk light** | chromium **10**, webkit **20** — on the same build | "painted runs = k … k20 → 10" | ✗ see §2 |
| π rect census, 85/88 boxes, HEAD dist vs prototype | **0 production boxes move**; the only deltas are the dev tuner's own chrome and a 1 px shift inside `DIV.hover-card`, both artifacts of dist-vs-dev | not run | ✓ (with the caveat) |
| AA, computed from the shipped tokens (`probe/aa.mjs`) | see §4 — every pair clears, with room | asserted | ✓ |

---

## 1 · The ring is 40% heavier than the design declares

The spec's §2 derives the band arithmetically: *fused peak = inset + 12 = 22 u = 1.41× the frame
line; 10.76 px at 1280*. Principle (2) of the family is "weight is a RATIO to the frame line and
gated as one", so this number is load-bearing.

What paints, off a raw pixel strip through the focused cell's mid-height (`probe/verify.probe.ts`,
`readings/verify-desk-light-*.json`): **16.0 px** of continuous ink at the focused edge, against
**6.0 px** at the neighbouring interior rule — ratio **2.67**. The prototype's own diff-based
instrument, which subtracts an unfocused control, reads **15.0 px** and **1.97×** the 7.63 px
frame. Two instruments, two methods, one conclusion: the mark is 15–16 px where 10.76 was
declared.

Two consequences, neither of them cosmetic:

1. The prototype **brief** asks for `band 1.35–1.45×`; §9's gate G2 asks for `band ≥ 1.35×`.
   Measured 1.97× passes the floor and fails the range, and the README reports 1.97 under a
   GREEN without noting that the brief's band was the range. A gate that was a range in the
   brief and a floor in the gate table is a gate that cannot fail.
2. "1.41× the frame" is arithmetic, never a measurement, and it is the sentence the family sells
   the ring with. Whatever the agglomerator lands, the declared ratio has to be the painted one.

**G2 is RED at phone light, not AMBER.** The gate says "0 rivals within 10%". The prototype
measured 1 rival at 393 dpr3 light in *both* engines (8.66/8.33 chromium, 9.00 webkit) and wrote
AMBER. My own phone-light arms read 8.33 px (chromium) and 9.33 px (webkit) for the band against
3.67 px for the neighbour rule, consistent with theirs. The reading is honest; the verdict word
is not. A gate is green or it is red.

**And the crop does not show the claim.** `frames/ring-proto-phone-dark-chromium.png` is the one
frame that could prove "a pencil pressed twice, two edges wandering independently". What it
shows is a smooth, heavy, round-cornered rectangle that reads as a UI chip — `stroke-linejoin:
round` on a 12-unit stroke at phone scale fuses the wobble out of visibility entirely. The band
is unmistakably the heaviest mark on the board, which is the gate G2 asks about; the *sentence*
is not visible at the size the owner will meet it. That is an unverified gestalt, and it is
exactly what U-10's re-look has to be pointed at.

## 2 · LAW A has a discontinuity, and G3 samples around it

Law A is `slots = min(writable, floor(perimeter/70))` → 56 at any board whose frame holds it,
`m = ceil(writable/slots)`. At 9×9, `writable = 81 − givens`. `m` is 2 when writable ≥ 57 and
**1 when writable ≤ 56** — that is, at 25 givens or more.

This is not hypothetical. My four verify arms booted fresh HARD 9×9 boards and wrote 20 digits
into each. Chromium desk-light cut **10** subpaths; WebKit desk-light cut **20**; phone light
reversed it (chromium 20, webkit 10). Same build, same k, same board size — the only variable is
how many givens that particular puzzle dealt. At m = 2 the full board carries 29 ticks; at m = 1
it carries 56. **The same 9×9 shows a tally of twice the density depending on one given.**

The mark is identical either way — that part of Law A holds, and the generator proof (45.00 ink
units, aspect 4.50, subpath identity exact at four fill levels on three boards) is the strongest
single piece of evidence in this family. What does not hold is the spec's table, which states
"9×9 (57) slots 56 m 2 → 29 ticks" as *the* 9×9 row, and the gate, which pins one `writable` per
board size and therefore can never cross the boundary. G3 as written is a gate that cannot fail
on the one thing Law A can get wrong.

(My boundary probe `probe/law-a.probe.ts` degraded after its second trial — the app resumes
saved state across reloads, so `writable` collapsed and trials 2–7 are instrument pollution, not
readings. Reported as such. The finding above rests on the four clean verify arms, not on it.)

Two further tally rows the prototype states honestly and that stay open: at k = 20 desk **6
over-rule pixels survive** (phone: 168 chromium / 146 webkit), and the briefed per-column
clearance median over ≥ 200 columns with a tick-LENGTH floor was never built — what was measured
is "no tick ink lands on the rule at k = 3". At k = 20 on a phone, ink lands on the rule.
"Off the rule" is the whole reason `.progress-pose` moved to 0.968, so the instrument that can
price it is not optional.

## 3 · A shipped comment asserts a law this lane's own probe killed

G0 is the section's finding, carried by every colour family: *a `stroke-dasharray` declared as a
presentation attribute under `pathLength` is normalised once too often by WebKit — 0.228
chromium against 0.921 webkit.* The prototype ran it properly and it **did not reproduce**: four
declaration arms, two engines, two dprs, all within 0.003. What multiplies the painted share is
subpath count, and it multiplies it identically in both engines (4 subpaths → 0.859 / 0.859).
Reporting that against its own spec is the best thing this lane did.

And then the refuted law shipped anyway, in two places in the source:

- `HandDrawnGrid.vue:132-135` — *"Under `pathLength`, WebKit paints a `stroke-dasharray` given
  as a presentation ATTRIBUTE with the normalisation applied once too often … painted 0.228 of
  the ring in Chromium and 0.921 in WebKit — the same markup, four times the truth."*
- `gridPaths.ts:167` — *"normalised once too often by WebKit: the gauge this replaced painted
  0.228 of the ring in Chromium and 0.921 in WebKit off identical markup."*

The prototype's README says of `gridPaths.ts`: *"the 4×-in-WebKit claim replaced by what pass 2
measured"*. It was not; the claim is verbatim in both files at the tip of the worktree I read.
That is one false row in the return, and two comments that would ship a WebKit bug report the
estate's own instrument refutes. The cut-subpath argument survives intact without them — it is
exactness, plus §1's now-measured subpath mechanism — so the cure is a re-cut, not a re-design.

## 4 · The constraints, checked

**AA — clear, with more room than the spec thought.** Computed from the shipped tokens
(`probe/aa.mjs`; light card `hsl(48 12% 99%)`, dark `hsl(24 6% 7%)`):

| pair | light | dark |
|---|---|---|
| your digit (graphite) on card | **14.78** | **12.03** |
| your digit on the 6% unit wash | 13.21 | 10.79 |
| your digit on the 12% wash (`prefers-contrast: more`) | 11.74 | 9.39 |
| your digit on the selection body **composed over** the wash | **11.39** | 9.03 |
| clue (foreground) on card | 19.41 | 15.84 |
| ring / tally graphite over card (1.4.11 ≥ 3) | 14.78 | 12.03 |
| *[HEAD control]* blue digit on the crayon-blue 7% wash | *4.71* | — |

The graphite move is a large contrast **gain**: your own digit goes 5.07 → 14.78 in light, and
HEAD's blue-on-blue was sitting at 4.71, a fifth of a point above the AA floor. Two corrections
to the spec follow. (a) §3's argument for never composing the wash with the selection body —
"the digit's light headroom is 0.58 of a ratio and the 0.08 body already spends 0.50" — was
computed against the *blue* digit and no longer binds: composed, the graphite digit still reads
11.39. The one-ground rank may well be right on MRK-WASH's grounds, but this family's stated
arithmetic for it is retired. (b) §0 and §5 declare the authorship value seam at **1.19:1**; it
computes at **1.31 light / 1.32 dark**. Better than claimed, and still not re-derived at
citation.

**filterBudget** — `FILTER_BUDGET_TOTAL` is derived (`FILTER_BUDGET.reduce`), so the row's
deletion moves it to 8 mechanically; union 44,642 / coarse 5,743, both −930, re-derived on a
dist built inside the worktree, 12/12 in both engines. The L1 re-cut is a real diff
(`synthesize/ACC-GRAPHITE/instruments/law-probe-L1.diff`) that moves the *statement* 9 → 8 and
keeps "never grows", applied to a copy, r0 untouched, the row reported MOVED. This is chair §7
honoured exactly. **This is the strongest row in the family.**

**M16 / copy** — `check-copy-register` exit 0 bare, 0 rendered strings moved, 0 new glyphs. Clean.

**π** — zero box-model properties in the entire diff (the only `display:` hits are `none`/`block`
on the new SVG retrace path inside an existing per-cell `<svg>`). My rect census over 85/88
first-of-kind boxes against the main tree's dist moves **no production box**; the 12 that differ
are all inside the dev tuner's `DIV.hover-card`, which the dist does not build. The raster side
is the G8 census, 12/12. π holds — with one exception the lane did not declare, next section.

**W2's landed mechanics** — sticky tag, dock, bottom tab, tap-floor token: untouched. The only
`GameControlPanel` edit is the sparkle glow's deletion. Clean.

**The decided history** — see §5.

## 5 · Two rows that moved without being reported

1. **R6 law 39 is this design's subject and is not in the MOVED list.** `r0/r6-idiom-history/
   R6-census.md:125`: *"Focus rings are non-negotiable and visible — … the board's drawn
   `--color-focus-sketch` ring at stroke-width 7 / opacity 0.9 drawn on over 180ms."* This lane
   re-points that ring to `--color-pencil-graphite` at 12 + 12 units and opacity 1. The ring is
   still visible and still drawn on over 180 ms, so the law's *intent* survives and the change
   is almost certainly right — but a decided-history row whose named token, width and opacity all
   move is a MOVED row, and the return lists only L1 and the two R2 rows.
2. **The conflict ring grew and the spec says it did not.** HEAD `gameCell.css:290` is
   `stroke-width: 10`, one pass. The prototype makes tier 2×3 twelve units and adds a red
   retrace, so focused-and-wrong goes 10 u → a 22 u fused band. The spec's §2 table lists
   "focus+conflict 12+12 red" in the column headed **"other tiers — as shipped"**. It is not as
   shipped; it is this diff. The change is defensible (the tiers must stay ordered, and tier 2 is
   now 22 u), the chromatic budget survives it (G1's 10–20° bin is 726 px and the census moved
   +0.077 points against a ±0.1 gate), and it is still a pixel moved and declared unmoved.

Also outstanding, and honestly reported by the prototype: `--color-focus-sketch` is now the
estate's **only zero-consumer hex** (0 `var()`, 0 class), created by this lane's retirement of
the crayon that anchored it, and disposable only by §6; retiring the crayon collapses the kinship
anchor and reds R2 rows 1/2 on a token this lane may not touch; `e2e/visual-regression.spec.ts`
now asserts `crayon-blue === ""`, which is a cross-family reconciliation row. Three stale prose
sites the re-cut missed: `playerIdentity.ts:65` ("the local player keeps the incumbent blue —
nothing is bound", now false at the substrate this lane rewrote) and `e2e/multiplayer.spec.ts:190/
:218`. The e2e *assertions* are relational (`inks.theirs).not.toBe(inks.mine)`) and survive the
re-point; only the prose is stale.

## 6 · What is genuinely converged

- **The ground token.** One name, one value, outside `LADDER`, inside the one file
  `gateOwnership` allows, 20 stacking contexts → 0, painted bytes byte-identical to graphite@6%
  in both engines and both themes. I re-derived all of it. This is a primitive other families
  should take.
- **Law A's mark.** 45.00 units of ink and aspect 4.50 at every board size, subpath identity
  exact at k = 1/3/20/full on three boards and all four poses. The mark is invariant; only the
  *density* law (§2) is unfinished.
- **The budget row.** 9 → 8 with the union re-derived downward on a built dist and both r0
  instruments re-cut in the same breath, r0 frozen. Textbook.
- **The born-RED unit.** The ablation reds exactly one test — the adopt-after-join one — and
  leaves pass 1's before-join unit green. Two genuinely different regressions, proven different.
- **The refutation.** A lane that kills its own section finding and says so in its return is the
  control group this loop is supposed to have.

## 7 · Verdict

**ADVANCE, 82%.** The family is the right sentence for this product and the substrate under it
is real. It is not 100 and cannot be argued to 100: G2 is red at phone light by its own gate's
words, G3 cannot see the discontinuity that Law A's one variable produces, G10 was not run at
all, G4 was measured on one cell of the eight it asks for and the deck's declared delta was
carried rather than re-derived, the declared band is 40% under what paints, and a refuted law
is in the shipped source. Every one of those is closable inside a pass — none needs a primitive
this family does not have, so it is not a BLOCK; nothing here is a rewording or a constraint
violation, so it is not a RETIRE.

The two rows that belong to somebody else — §6's orphaned focus token and the kinship anchor —
should travel with this family to the agglomerator as *its* debts, not as excuses: this lane's
retirement created both.

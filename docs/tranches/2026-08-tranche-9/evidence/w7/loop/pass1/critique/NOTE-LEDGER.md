# NOTE-LEDGER — pass-1 adversarial critique

**Verdict: ADVANCE · convergence 72%**

I did not write the spec or the prototype. I read the diff whole
(`git -C .claude/worktrees/wf_e58b4764-0fc-54 diff`, 5 files, +355/−27), looked at all six
frames, re-ran the batteries, and put the build on my own server (`:4244`, `--force` against the
shared `node_modules/.vite`) to measure the rigs and the poses the prototype never opened.
Probes and readings: `critique/NOTE-LEDGER/{probe,readings,frames}/`.

---

## 1. What I verified myself

**The batteries, on the worktree.** `vitest run` — 66 files / 813 tests passed (the "Test Files"
line read, not the test count). `lint:copy` green (0 em dashes, 0 unadmitted jargon).
`lint:live-regions` green (0 regions born speaking). `lint:ink` green — with a caveat that is
finding G2 below.

**AA, recomputed from the composited paint** (`readings/C5-ink-*.json`, corrected by hand: the
probe's parser read `color(srgb 0.15 …)` as 0–255, so the banked ratios in that file are wrong and
these are the arithmetic):

| rung | light | dark |
|---|---|---|
| line two `--ink-press-quiet` over the paper | **5.18:1** | **6.14:1** |
| line one, teacher-red (the pose I caught) | 4.87:1 | 6.44:1 |

Both clear the 4.5 text floor in both themes, and they agree with the prototype's painted-byte
reading (5.17 / 6.07–6.13) to within a hundredth. Line two's core is never red or gold — the CSS
gives it a hardcoded `--ink-press-quiet` and no tone class, so it cannot be.

**L3/L4 extended to four desk rigs the prototype never opened** (`readings/C1-narrow-desk-*.json`,
both engines): 1024×768, 1024×640, 1100×700, 1280×800. Board y invariant, `scrollHeight` invariant
(768/640/700/800 at every depth), `blockFlexWrap: nowrap`, and line two's right edge sits
**111–394px INSIDE** the strip's right edge on every rig. The trailing berth holds where it was
never measured. Frame: `frames/1024x768-light-trailing-berth-chromium.png`.

**I closed the prototype's own open gap #2 — the dock sheet** (`readings/C9-dock-*.json`,
`frames/390x844-dock-open-over-two-lines.png`). At 390×844 with the column two deep, opening the
tongue and settling 1100ms: board y moved **0.00px** both engines, `scrollHeight` 844 unchanged,
line two's box identical shut and open (y 614.92, h 20.80), and the open sheet covers the WHOLE
strip — line one included. The column takes the incumbent's treatment under the sheet. Gap closed
GREEN; it is off my list.

**pi.** The diff touches no filter, no wobble, no hue. The only unconditional change outside the
new element is `position: relative` on `.margin-note-block` below 1024 (no offsets, a flex child —
moves nothing) and `250ms` → `var(--note-write-ms, 250ms)` at the same value. Goldens 4/4 DELTA
none against the worktree's own dist, budget/wobble/hue censuses identical to r0. pi is proven for
the surfaces this family does not claim.

---

## 2. Strengths

1. **It runs, in both engines, and it cures a landed defect with a mechanism rather than a patch.**
   The peer wipe dies because a digit is no longer a sentence, not because a new guard was bolted
   onto the null.
2. **The prototype found three product defects the spec could not** — the givens-family re-deal
   that reaches no margin arm, the FLIP sampling the colour of the sentence that displaced it, and
   the two-refusal stutter — each cured with its measurement banked. That is what a prototype is
   for, and the deal defect is a MODEL hole the whole wave inherits.
3. **L3 convicts the family's own first shape.** A gate that killed the in-flow draft on 13.59px is
   not a gate that cannot fail.
4. **Nothing was minted**: no token, no curve, no codepoint, and the third rung was rejected by its
   own sub-AA number rather than by taste.
5. **The ballot fired on its own measurement and was written into the stylesheet beside it**
   (332px strip vs 457.52px pair), stated as B6's split grammar rather than hidden.

---

## 3. Open gaps — each one a sentence that could be closed

**G1 · The nowrap cliff at 360.** The longest record the ledger can age is
`G goes nowhere else in this column` — **213.72px** (chromium) / **213.71px** (webkit), measured
with a Range over the text node (`readings/C7-nowrap-headroom-*.json`). At 360×740 the strip is
228px, so the headroom is **14.28px, 6.3%**, inside a `white-space: nowrap` box with no wrap, no
clip and no ellipsis: one longer sentence, or W7 §10's type scale, paints line two out of the strip
and into the tongue's column. The spec's "max 210.06px" understates the true longest by 3.66px, and
L10's tripwire measures only the 20.80px line box and the ribbon clearance. **Close it** by adding a
WIDTH row to L10 that sweeps the enumerable record vocabulary against the strip at 360 and reds
under 10% headroom.

**G2 · `lint:ink` GREEN is not evidence for line two.** `scripts/check-ink-pressure.mjs` asserts a
hardcoded list — "ship-4 census covers N of the **6** re-pitched surfaces" — and
`.margin-note-previous` is the seventh consumer of `--ink-press-quiet`. The gate cannot fail for the
family's own new surface. **Close it** by adding `.margin-note-previous` as census row 7, per the
file's own doctrine that each surface is pinned to the rung above.

**G3 · PRODUCT CURE 1 is still ungated.** Every new row in `GameBoard.receipt.test.ts` runs the
default `givenCells: new Set()` — the no-givens family. The re-deal defect the running surface
caught (givens present, `boardGeneration` bump, both lines standing over a board nobody had seen)
has no unit row, so it can regress with the battery green exactly as it shipped. **Close it** with
one row: `givenCells: new Set(["0","5","9"])`, `dealt: true`, generation bump, both lines `''`.

**G4 · The orphan deictic — a live claim wearing a record's clothes.** Measured, both engines
(`readings/C2-orphan-*.json`): arm a hint, `becauseCells` highlights **9** cells, line one reads
`5 goes nowhere else in this row`; type a digit elsewhere and the highlight drops to **0** while
the sentence stands; move the caret to another cell and it still stands. Webkit's pose is worse —
`only 8 fits here`, with no "here" on the board. The family's own ruling is "a ledger holds RECORDS
OF ACTS, never LIVE CLAIMS", and a deictic sentence whose referent has been erased is a live claim.
HEAD retracted on the null; this family created the pose by converting that retraction. **Close it**
by saying what "here" means once the highlight is gone — age the sentence when its referent dies,
or take the deixis out of the hint copy that may age.

**G5 · The aged record does not exist for a non-sighted reader.** Line two is `aria-hidden="true"`,
`user-select: none`, `pointer-events: none`, and `display: none` in every sub-1024 landscape pose.
One live region is right; what is missing is the other half of the sentence: a screen-reader user
hears the record once and can never recover it, so the peer wipe the family claims to cure is
uncured for them. **Close it** by naming the non-sighted recovery (W3's sr-only voice is the landed
idiom) or by stating in the spec that line two is a sighted affordance and the column is depth one
in the a11y tree.

**G6 · Phone landscape was never measured.** The ballot was priced at 900×500 only. At 844×390
(`readings/C4-landscape-*.json`, dsf3, touch) line two arrives mounted, with its text in the DOM,
`display: none` — and the page **already scrolls before line two exists** (`scrollHeight` 410 vs
`innerHeight` 390), so the fold argument that justified depth one does not hold in the pose it most
applies to. **Close it** by re-pricing the landscape ballot on 844×390.

**G7 · The desk berth's gestalt is verified only in the pose where a hue does the work.** The one
desk frame is red-over-graphite. The ledger makes line two ALWAYS graphite, so the common desk pose
is two pencil sentences sharing one baseline with 7.20px of air and no punctuation —
"the board is clear only 4 fits here" reads as one run-on utterance, and "newest first" is invisible.
I tried and failed to induce the graphite∥graphite pair in my budget (two hints in a row printed one
sentence, `readings/C8-graphite-pair-*.json`), so it is unverified by both of us. **Close it** by
screenshotting the graphite-over-graphite pair at 1280 and 1024 before the trailing berth is called
converged.

**G8 · L5's negative control cannot fail.** "A forced third line must not render" is structurally
impossible against a single `previous` prop; the gate asserts the component's arity, not a
behaviour. **Close it** by making the negative control a MODEL row (three records in, exactly two
strings out) or by deleting the clause.

**G9 · Two declared STATES have no frame.** The grade-leaves pose (line one `''`, line two standing
— a blank top rung over a quiet second one, out of flow with nothing above it) and the error card
over a two-line column (the prototype's own declared gap; I could not induce `solveState: 'error'`
either). **Close it** with two crops.

**G10 · The stutter cure is the prototype's, not the spec's.** Two clauses of behaviour in
`setMargin` — the same sentence is not the next sentence; the column never prints one sentence
twice — that the synthesis does not describe. **Close it** by adopting both into the spec, or the
duplicated rows in `logs/stutter-*.json` come back.

**G11 · The desk push is a horizontal slide that the spec does not declare.** The FLIP runs from
line one's rect to the mover's, and at ≥1024 the mover sits BESIDE line one, so the travel there is
lateral, not "one line box". Undeclared travel is pi. **Close it** by declaring and measuring the
desk's travel.

**G12 · `has-previous { flex-wrap: nowrap }` silently reverses a landed decision.** T4-P1 mark 6
wrote `flex-wrap: wrap` on the block so the TALLY could take a second line when it needs one; the
rule turns that off whenever a previous exists. Production never shows it (the tally is debug-gated,
`GameBoard.vue:886`), which is why nothing caught it. **Close it** by pricing the
verdict + tally + aged-line triple on the narrowest desk, or by scoping the nowrap to the previous.

---

## 4. Failure-mode checklist

| item | reading |
|---|---|
| vacuous convergence | CLEAR — L3 and L4 both convicted the family's own drafts. |
| spec cites itself | CLEAR. |
| **gates that cannot fail** | **HIT ×3** — G2 (the ink census is blind to the new surface), G3 (the cure the battery missed is still not in the battery), G8 (the third-line control is structurally impossible). |
| elegant-reduction trap | **HIT (soft)** — the declared residual ("a hint followed by silence stands at full pressure") is the easy half; G4 is the hard part underneath it, and it is not deferred, it is unnamed. |
| legacy aliases | CLEAR — the retraction is deleted, not renamed. |
| **masked fallbacks** | **HIT ×2** — `white-space: nowrap` hides the too-long sentence by painting it outside the strip (G1); `display: none` in landscape hides the pose the design does not handle (G6). |
| **unverified gestalt** | **HIT** — G7 (the common desk pose), G9 (two declared states, no frame). |
| consumer-less substrate | CLEAR — `MOTION.note` has exactly one consumer and it is the note. |
| generic default | CLEAR — nothing here reads as a template. |
| **pi** | **HIT (small)** — G11, the desk push's lateral travel; G12, a landed flex rule reversed. Otherwise pi is proven (goldens DELTA none, censuses identical, depth-0 geometry identical at four desk rigs). |
| constraint forgotten: AA | CLEAR — 5.18/6.14 recomputed independently. |
| constraint forgotten: filterBudget | CLEAR — the diff touches no filter; census 9 at 4×4, 9×9, 16×16. |
| constraint forgotten: M16 | CLEAR — `check-copy-register` green, no new string. |
| constraint forgotten: W2 mechanics | CLEAR — tongue, dock, strip berth all honoured; I re-measured the dock myself. |
| constraint forgotten: decided history (r0/R6) | MOSTLY CLEAR — R6 row 54 (one status region, one write-in, three tones) honoured; R6 row 30 (no new codepoints) honoured. G12 is the one landed decision reversed. |

---

## 5. Why ADVANCE and not something else

Not BLOCK: there is no missing primitive here. Every gap above is a measurement, a gate row, or a
sentence of spec — none of them is as hard as the problem.

Not RETIRE: nothing is violated. AA holds on both themes, M16 is green, the filter budget is
untouched, pi is proven where the family claims nothing, and the mechanism is a real one, not a
rewording of the incumbent.

ADVANCE, at **72%**. The prototype is running and honest, and it earned back three defects the spec
could not see. What it has not earned is the last quarter: three of its cited gates cannot fail for
the thing they were cited for, the family's own ruling ("records, never live claims") is broken by
the pose it created at G4, two declared states have never been looked at, and the phone's tightest
rig lives on 6.3% of width in a box that cannot wrap.

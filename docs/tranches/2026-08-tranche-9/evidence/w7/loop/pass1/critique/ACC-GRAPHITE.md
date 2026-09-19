# ACC-GRAPHITE — pass-1 adversarial critique

**Verdict ADVANCE · convergence 74% earned · 20 open gaps**

Written by a critic who wrote neither the spec nor the prototype. Everything below that carries
a number was either re-derived from the lane's own artefacts or measured again on the running
prototype by this lane's own instruments, banked at
`evidence/w7/loop/pass1/critique/ACC-GRAPHITE/{probe,readings}` (64 KB).

---

## 1. WHAT I DID

- Read the whole diff in the worktree (`git -C .claude/worktrees/wf_e58b4764-0fc-43 diff`,
  14 files, +441 / −141) — every file, not the summary.
- Looked at the frames: `ring-light-chromium`, `tally-k3-light` (and a 4× nearest-neighbour
  zoom of its first 150 px), `room-after-light`, `authorship-armA-light`.
- Re-measured on the running prototype, **both engines, both themes**, at 1280×800 dpr1:
  `probe/verify.probe.ts` → `readings/verify-{light,dark}-{chromium,webkit}.json`,
  `readings/pi-{chromium,webkit}.json`.
- Re-derived the two pixel analyses of the banked frames myself:
  `probe/frame-analyze.mjs`, `probe/tally-rowprofile.mjs`.
- Ran the estate's own gates in the worktree: `check-copy-register` (exit 0, 2 admitted,
  0 new), `check-ink-pressure` (exit 0, three scopes unchanged), `vitest run`
  (**Test Files 66 passed**, Tests 811 passed — read at the file line, per the standing trap).
- Attempted an independent test of the draw-on direction (`probe/drawon.probe.ts`, animation
  slowed to 4 s, perimeter arc count at 25/50/75 %). **Inconclusive** — see gap 2.

**Server note.** Every port in 4230–4249 was held by a concurrent lane at critique time
(`lsof`: all twenty). Rather than evict one, this critique reads the prototype lane's own
`127.0.0.1:4237`, which serves this worktree (verified: the served `index.css` carries
`--color-user-ink: var(--color-pencil-graphite)` and no `--color-crayon-blue`). A scratch
config, never the estate's default. Nothing was written to the main tree but this directory;
the worktree is byte-identical to how I found it (14 modified files, no additions).

---

## 2. WHAT IS TRUE — independently confirmed

| Claim | My measurement |
|---|---|
| The tally paints exactly k marks | `.progress-trace` `d` has **1 subpath after 1 write, 3 after 3**, chromium **and** webkit, light **and** dark; `stroke-dasharray: none`; stroke `rgb(38,38,38)` / `rgb(209,207,199)`; `.progress-pose` transform `matrix(0.984,…)`. The dash is genuinely gone. |
| The retired tokens are gone | `--color-crayon-blue`, `--color-focus-sketch`, `--color-progress-ink` all resolve to `""` on the live root in both engines and both themes. `grep` in `src/`: `crayon-blue` 0, `196, 181, 253` 0, `#2563eb` 0. |
| The ring is graphite, twelve, twice | Both `.cell-ghost-path` and `.cell-ghost-retrace` computed live: stroke = graphite, `stroke-width: 12px`, `stroke-opacity: 1`, retrace `display: block`, fill `none`. |
| AA / 1.4.11 | Ring ink over the **painted** paper: **12.05:1** light-chromium, **10.79:1** dark-chromium, **13.27:1** light-webkit, **10.79:1** dark-webkit. (The lane's 14.87 / 11.99 are over `--color-card`; over the board's own paper the numbers are lower and still far above the 3:1 non-text floor and the 4.5:1 text floor.) |
| filterBudget | `FILTER_BUDGET` rows sum to 4+2+2 = **8**; the sparkle's live `filter` computes to `none`. The budget moved **down**, which is the only direction that law travels. |
| M16 | `check-copy-register` 0 new, 2 standing admissions; zero rendered strings in the diff (comments and props only) — so zero woff2 re-cut. |
| It runs | 811/811 units in 66 files, in the worktree, from a cold run. |

The headline that matters is real: the family's centre — *colour on this board means who made
the mark* — is now enforceable, and the 24 `--color-user-ink` consumers were left alone while
the default moved. Three tokens, one utility class, two literals, two transitions and a filter
row die and **nothing is minted**. This is the most parsimonious patch in the round.

---

## 3. WHAT IS NOT CONVERGED

### 3.1 The centre is not legible (my measurement, not theirs)

A mid-row scan of the focused cell, at 1280, four readings:

| reading | left band | right band | clearance to the rule |
|---|---|---|---|
| light-chromium | 11 px | 12 px | ~3 px (separate 3 px rule run at 73–75) |
| dark-chromium | 11 px | **16 px** | **0** — band and rule are one continuous run to x 73, cell edge ≈ 74.7 |
| light-webkit | 12 px | **17 px** | **0** — continuous to x 74 |
| dark-webkit | 11 px | 12 px | ~3 px |

Two things fall out. First, **there is never more than one ink run per side**: the two passes
fuse completely, at every viewport and in both engines. The spec's sentence — "a pencil makes a
heavy line by going round twice" — is a weight mechanism, not something a reader can see. The
lane says this itself (its gap 2, "0.48 px gap"); my numbers say the gap is not 0.48 px of paper
but none at all at the sampled row. Second, the **+6.36 px clearance figure does not describe
what the mid-row paints**: in two of four desk readings the ring's outer band and the cell's own
rule are contiguous ink.

### 3.2 The one frame banked for G3 contradicts its own caption

`tally-k3-light.png`, captioned "three ticks for three written cells", paints **five** ink
blocks in its 300 px crop — x 4–36, 56–80, 100–124, 144–169, 202–232 (pitch ≈ 44 px, ink
≈ 25 px, duty 0.57 as designed). `frames-final.probe.ts` types a `5` into the mid cell for the
authorship frame at line 88 **before** it calls `type(3)` at line 165, so the frame is at k ≥ 4
and cannot be read as k = 3. The mechanism is fine — I verified it from the DOM — but the single
picture cited for the gate says something else, and a reader doing the owner's five-second read
will count five.

### 3.3 The tally is not off the rule to the eye

Row profile of the same crop: the frame line is at y = 14 (297 ink px, one run); the ticks
occupy y = 15–21, **contiguous with it**. Zoomed 4×, a tick reads as a thickened segment of the
top rule with a nub hanging below — which is the exact failure the family diagnosed in the
violet gauge ("a retrace of a rule IS a rule"). The 14.87:1 figure is measured on rows chosen
off the rule; the form the reader gets is a dashed thickening of the frame. `scale(0.984)` on a
~560 px board buys ~4.5 px of inward travel against a 5 px stroke — not enough to separate.

### 3.4 The room contradicts the family's own sentence

`room-after-light.png` shows three graphite 1s and one coloured 2, **all yours**, on one board.
If colour means who made the mark, a board on which your own hand is two colours is the thesis
failing on its own surface. The lane names the cause (`authorInk` reads `ledger.clock`; a solo
write never enters it) and does not take the cure. This is the elegant-reduction trap by its
proper name: "and then the hard part".

And the colour you get is a **red**: the walk starts at hue 0.0° and `--color-teacher-red` is
14.2° light / 12.2° dark. The frame shows it — your own 2, in the colour the board uses for
wrong.

### 3.5 The decided history has not moved

R6 law 9 reads "the live-filter population is EXACTLY 9", R6 §3.4 calls the budget "a wall W7
designs inside", `law-probe.mjs` L1 asserts 9 and R1 greps `--color-focus-sketch` inside
`.dark`. The plan says every 9 becomes an 8 and every retired subject is re-pointed; the
prototype did not do it. Until those move, π against the banked history is RED **by the
family's own act**, and G8's "exact match at 8" is a gate the record does not yet admit.

### 3.6 A masked fallback and a reactivity hazard

- `HandDrawnGrid.vue`: `const writable = computed(() => Math.max(1, Math.round(props.writable ?? 51)))`.
  51 is a guessed 9×9 given count. A caller that passes `progress` and not `writable` paints a
  confidently **wrong** tick count instead of nothing. Today there is one caller, so the default
  is dead weight that hides the case the design does not handle.
- `useSession.ts`: `selfInk` reads `inkIndex[me]`, and `inkIndex` is a plain `let` object, not a
  ref. The computed re-evaluates only when `present` or `selfId` moves — so the `k`-adoption
  path at :589 ("ink is the room's, not the page's") can re-index you without your own ink
  following. That is the same class of bug the lane caught at the same seam, one line away.
- `useSession.ts:315` still documents `ink` as "EMPTY for you, who keep the incumbent blue" —
  false on both halves after this patch.

### 3.7 Claims with no instrument behind them

- "The gallery zero-diff vs HEAD" was in the brief and is answered by no number and no diff. It
  also cannot be true: `PosterBoard.vue:196` passes `is-given` to `HandwrittenGlyph`, so every
  deck face's clue travels 5 → 6 units with the board's. (The T8-R13 still==board identity
  survives, because both move together — but "zero diff" does not.)
- The draw-on's reversed second pass is asserted in the spec, the CSS and three comments, and
  measured nowhere. My own attempt (animation slowed to 4 s, arcs counted round the cell
  perimeter at 900/1900/2900 ms) returned `inkedShare 1.0, arcs 0` at every sample in both
  engines — the sampler could not separate the passes, because the fused band plus the 0.08 fill
  leave no paper inside the loop. Inconclusive, and banked as such.
- The WebKit dash mechanism this lane pinned is handed back untested on **its own ring**:
  `.cell-ghost-path` and `.cell-ghost-retrace` are `pathLength="1"` + `stroke-dasharray: 1`, the
  same family of mechanism as the gauge it had to abandon.
- G4's 1.333 is two constants chosen to make the ratio, while the lane's own painted chamfer
  median reads **1.00** at desk light; `authorship-armA-light.png` shows no weight seam by eye.
  Arm B has no dark frame, so the owner's A/B at U-10 is light-only.

---

## 4. FAILURE-MODE CHECKLIST

| item | hit? | where |
|---|---|---|
| vacuous convergence | — | every gate has a RED-at-HEAD number |
| spec-cites-itself | **HIT** | the band law ("≥1.35× the frame line", "heaviest by ≥35%") and G4's 1.33 are satisfied by the same constants the patch sets |
| gates that cannot fail | partial | G4b passes on one number and fails on the other and asks the chair which the gate meant; G3's picture disagrees with G3's instrument |
| elegant-reduction trap | **HIT** | pre-room digits stay graphite, "cure exists, not taken"; index-0-vs-red handed to PAL-*/PLR-* |
| legacy aliases | clear | it deletes three, adds none |
| masked fallbacks | **HIT** | `props.writable ?? 51` |
| unverified gestalt | **HIT** | "twice round" fuses to one band (measured); the reversed draw-on never captured; the authorship seam asserted by stroke width, contradicted by its own painted median |
| consumer-less substrate | clear | `generateCellRetraceRects` and `tickMarksAlong` each have exactly one consumer |
| the generic default | clear | nothing added; this is a subtraction |
| the pixel it did not declare | partial | the join ring 0.984 → 0.968 and the clue 5 → 6 are declared but unscreenshotted on the deck and in a live room |
| the constraint it forgot | **HIT** | the decided history (R6 law 9 / L1 / R1 still at 9); AA, filterBudget (8, down), M16 and W2's landed mechanics are all clear |

W2's mechanics are untouched — I checked the dock, the tab and the tap-floor rules in
`gameCell.css` and `GameControlPanel.vue`: comments only.

---

## 5. STRENGTHS WORTH KEEPING WHATEVER HAPPENS

1. **The WebKit dash law**, proven by a controlled sweep on one path in one page: a dash period
   longer than its path paints once in Chromium and four times in WebKit. It condemns the
   *shipped* fill gauge and join ring at HEAD, not just this design.
2. **`tickMarksAlong`** — arc-length-cut marks along any baked pose. A primitive, not a fix.
3. **The read-order rule** for a computed over a lazily-imported module, with a unit that reads
   the roster *before* the join so the regression cannot come back quietly.
4. **"Pressure, not tone"** as the seam between your marks and the engine's (opacity 1 vs 0.5) —
   the only seam in the estate that survives a colourless board.
5. **The binned residue census**: every chromatic pixel named to a token or an exception.
6. It is a **net deletion** that raises no new constant, and it still moves five gates off RED.

---

## 6. WHY 74 AND NOT MORE

Zero open gaps is the price of 100, and there are twenty. The prototype runs and is measured in
both engines; the numbers that carry the headline are real and I reproduced the load-bearing
one. But the family's own centre — the hand that goes round twice, the colour that means an
author — is exactly the part that is unproven in the first case and self-contradicting in the
second, and one banked frame disagrees with the gate it was banked for. That is not a polish
deficit; it is the thesis, unclosed. ADVANCE: nothing here is a rewording, no constraint is
violated, and no missing primitive is as hard as the problem. Every gap below is a sentence a
pass-2 can close.

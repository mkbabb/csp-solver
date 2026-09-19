# NOTE-LEDGER — pass-2 ADVERSARIAL CRITIQUE

Critic did not write the spec or the prototype. Everything below that carries a number was
re-measured here, on the prototype's own worktree (`.claude/worktrees/wf_8630d340-e56-47`,
uncommitted diff, 7 files / +899 −41), served on **127.0.0.1:4237** with a private
`cacheDir` (`.vite-cache-critique`), chromium **and** webkit, server killed before returning.
Probe sources and readings: `critique/NOTE-LEDGER/{probe,logs}/` (68 KB).

**VERDICT: ADVANCE at 72 %.** The one pass-2 decision is earned and I confirm it. Two
behaviours the family calls GREEN are materially wrong on the real surface, and its own red is
real — I reproduced it to the pixel. Nothing here needs a primitive as hard as the problem, and
nothing is a rewording or a constraint violation, so it is neither BLOCK nor RETIRE.

---

## 1 · WHAT I RE-MEASURED, AND WHAT IT SAYS

| claim | the lane's number | mine | engines |
|---|---|---|---|
| L5 clearance to `#fold-tools`, two lines deep | **1.81 px** (floor 6.0) | **1.8125 px** on 360×740, 390×844, 393×699, 390×664 | both |
| the first painted box below the strip | `#fold-tools` | `#fold-tools` — I swept every ≥8×8 painted box; nothing is nearer | both |
| line-two box height, phone | 18.19 px | **18.1875 px** | both |
| L3 board `y`, depth 0/1/2 | invariant | **221.73 / 221.73 / 221.73** (chromium), **221.42 ×3** (webkit) | both |
| L4 `scrollHeight` at 390×844, depth 0/1/2 | 844 | **844 / 844 / 844** | both |
| painted AA, line two | 5.19 light / 6.12 dark | computed from the painted `color(srgb … / 0.68)` composited on the paper: **5.22 light / 6.11 dark** (rgb 106,106,106 on #fbfaf9; rgb 148,146,140 on #110f0e) | both |
| the tier's five declarations | tally's | 14 px · 18.2 px leading · 0.35 px tracking · `--font-hand` · 68 % alpha | both |
| filter census, depth 0/1/2 | budget probe 9/9/9 | my broader census (any computed `filter ≠ none`) **25 / 25 / 25 — unmoved** | both |

Mechanical estate, re-run bare (never through a pipe):

`npm run lint:ink` **exit 0** and it prints the new row —
`margin note 5.19 light / 6.12 dark ≥4.5 (--ink-press-quiet on --color-background; 17
discovered consumers …)`. `--self-test` **exit 0**. `check-copy-register` **0**.
`check-font-coverage` **0**. `check-live-regions` **0** (10 declared, 0 born speaking;
`MarginNote.vue:139` is the one region in the strip). `vue-tsc --noEmit -p tsconfig.json`
**0**. `vitest run GameBoard.receipt.test.ts GameBoard.notes.test.ts` → **Test Files 2 passed,
Tests 39 passed**.

> I hit the lane's own banked trap while doing this: `npx vitest … --reporter=basic | tail` put
> `EXIT=0` in my log over a run that never started (`ERR_LOAD_URL` on a reporter that does not
> exist). The lane banked the same bite through `;` on `tsconfig.app.json`. **Two lanes, one
> pass, same disease** — this belongs in the traps ledger as a wave row, not a lane footnote.

---

## 2 · THE TWO BEHAVIOURS THAT ARE NOT WHAT THE GATES SAY

### 2.1 THE HOUSE OVER-STRIKE — a still-true sentence dies (L11 GREEN is wrong)

`logs/C2-house-overstrike-{chromium,webkit}.json`, both engines, real surface:

- chromium: armed `8 goes nowhere else in this row` on cell 3; the row's open cells are
  {3, 5, 7}; I wrote **9** into cell **5**. Line one → `""`.
- webkit: same sentence on cell 13, open house {…, 9, …}; wrote **9** into cell **9**. Line
  one → `""`.

A 9 landing elsewhere in the row does not falsify "8 goes nowhere else in this row" — it can
only make it more true. The record was struck anyway, because the predicate is
`referent.some(inked)` over `openCells([cell, ...becauseCells])`: **any digit in any open cell
of the house**. The spec authorised it (`X goes nowhere else in this <house>` → the house), but
the spec's justification — "a deictic record is struck the moment its referent is written" —
does not hold for a house: a house does not stop existing when one of its cells takes ink. The
sentence's referent is the house *for a named digit*, and the record does not carry the digit.

Two consequences the return does not state:

1. **L2 is narrowed and the DIES row is half-reinstated.** The family kills "the peer-anywhere
   wipe as a visible defect"; what it ships is a *peer-in-the-house* wipe. On 16×16 a hidden
   single's house is 16 cells: a peer typing anywhere in up to 15 of them empties your column.
   The lane's L2 evidence (`A1-strike-*`) writes into cells 76 and 80, which are outside the
   house — it proves the safe case only.
2. **L11's gate cannot fail on it**, because the receipt row *asserts* it:
   `GameBoard.receipt.test.ts` — "a digit IN the house strikes the hidden single at depth one"
   sets `values["2"] = 7` against `4 goes nowhere else in this row` and expects `""`, with the
   reason `"the house took ink, so the argument is gone"`. The gate encodes the over-broad
   predicate as the specification, so the census grades the defect green.

**Closable in one field.** `hint.value` is at the same call site as `hint.cell` and
`hint.becauseCells`. Carry it, and split the arm: the *cell* arm stays `values[cell]` (correct
and narrow); the *house* arm becomes "that value now appears in the house". The receipt row
then needs its born-RED twin: writing a 7 into the row leaves `4 goes nowhere else in this row`
standing.

### 2.2 THE CANONICAL LOOP EMPTIES THE LEDGER (L1 GREEN is staged, not lived)

`logs/C1-canonical-loop-{chromium,webkit}.json`. The act sequence is the one every reader
performs: **ask for a hint, then do what it says.** Three rounds, webkit:

| round | armed | after writing the digit the sentence names |
|---|---|---|
| 0 | `9 goes nowhere else in this column` | line one `""`, line two `null` |
| 1 | `only 8 fits here` | line one `""`, line two `null` |
| 2 | `only 2 fits here` | line one `""`, line two `null` |

Probe verdict, banked: `THE LEDGER NEVER ACCUMULATES ON THE CANONICAL LOOP`. Chromium is the
same mechanism with one round differing only because the engine's hint landed on a cell other
than the focused one (round 2 there shows line two `only 9 fits here` being struck by a write
at a third cell).

The arithmetic is in `setMargin`: a push requires `live.text && live.kind === "record"`. The
strike leaves `{ text: "", kind: "empty" }`. So a fulfilled record cannot age — it is deleted,
and the next record has nothing to displace. **The family's headline behaviour is defeated by
its own pass-2 decision on the commonest act sequence in the product.** L1's GREEN is measured
on a staged pair (hint, then a refusal on a given) that no reader performs in that order.

This is the checklist's elegant-reduction trap exactly: "a deictic record is struck the moment
its referent is written" is elegant, and **then the hard part** — a write that *fulfils* a
record is not the same act as a write that *falsifies* it — is unconverged. `only 8 fits here`
followed by an 8 in that cell is the record at its most true; it is the line most worth
keeping. Closable: strike on falsification, AGE on fulfilment (the fulfilling write is
`values[cell] === hint.value`, which the same one field in 2.1 makes available).

---

## 3 · THE RED IS REAL, AND THE SPEC'S BERTH ARITHMETIC WAS WRONG TWICE

I reproduce **1.8125 px** against a 6.0 floor on all four phone rigs, both engines, and I
confirm the honesty of the measurement (`#fold-tools` genuinely is the nearest painted box
below; I swept for anything nearer and found none). The lane's reading of its own failure is
correct: the tier bought exactly the +2.61 px the spec derived, into a berth 6.0 px smaller
than the spec believed. The lane also reports the second arithmetic miss itself — 900×500's
honest clearance is 45.92 px, not the 6.50 the spec carried. Two wrong berth figures in one
spec is a spec-side row, not a build defect, and the disposition (4.2 px of strip air, which is
W2's pose to give, versus a leading change that breaks the tally mirror the whole decision rests
on) is the owner's/agglomerator's.

---

## 4 · THE LADDER IS A FORWARD DECLARATION, NOT A LANDED SEAM

`--motion-note` and `--motion-whisper` are **never defined anywhere** — grep over `src/`
returns only the four `var(--motion-…, <literal>)` reads and the comments that describe them.
So:

- Every CSS site resolves to its **literal fallback**, today and until §13's publisher lands.
- `MOTION.rungs.note` has exactly one consumer (the WAAPI push). **`MOTION.rungs.whisper` has
  zero consumers in `src/` or `scripts/`** — a minted constant nothing reads. Consumer-less
  substrate, by the checklist's own name for it.
- The diff's claim "one home per value, never a second copy in TS" is **false as landed**: 250
  lives in `pencilConfig.ts` and twice as a CSS fallback; 150 lives in `pencilConfig.ts` and
  twice as a CSS fallback. The literal count did not drop, it moved inside `var()` parentheses.
  Worse, the two homes can now **drift silently**: changing `MOTION.rungs.note` to 300 moves the
  push and leaves the write-in at 250 ms, and nothing reds.

This is not fatal — the fallbacks are byte-equal, so no pixel moves — but "the four 250 ms
literals DIE" is a DIES row that did not happen. Closable: publish the rungs as `--motion-*` on
`:root` in this same diff (six lines in `index.css`), or ship a drift assertion that reads both
homes.

---

## 5 · THE GATES THAT CANNOT FAIL

1. **`gateNote`'s discovery floor is one below the build it ships with.** `discovered: 16`,
   while `lint:ink` prints **17 discovered consumers** on this very build. The comment says
   "red when a consumer is deleted without its row moving with it" — it cannot: deleting
   `.margin-note-previous`'s `color` line takes 17 → 16 and Part B stays green. (Part A catches
   *that* particular deletion today only because NOTE-ERASE has not landed; once it has, either
   family's consumer can vanish silently.) One character: `discovered: 17`.
2. **L11's receipt row asserts the over-strike** (§2.1) — the gate for the pass's second
   decision is written from the implementation, not from the sentence's truth condition. That
   is the spec-cites-itself shape.
3. **L14 is satisfied by a zero-width box.** At ≥1024 line two is `flex: 1 1 0; min-width: 0;
   overflow: hidden; text-overflow: ellipsis`, so it never causes the wrap — and if the verdict
   plus a long tally consume the row, line two takes ~0 px and disappears with no ink outside
   any box. The measured headroom is comfortable today (line two gets 302.91 px at 1024 /
   330.16 px at 1280 against a 162.41 px tally), so this is a latent, not a live, defect; the
   gate simply has no lower bound on the width at which the aged record is still readable.

---

## 6 · THE GESTALT IS ASSERTED ON ONE ENGINE

All four crops are chromium. The numbers are both-engines throughout and I verified that, but
the *look* — the size step at the desk, the longest record at 360 coarse dark, the push, the
grade-leaves pose — has no webkit frame. Crop 1 is additionally confounded on colour by the
lane's own admission (the staging helper rewrote the text and not the tone, so line one paints
teacher-red where the spec's pose names graphite); I looked at it and the **size** step is
plainly legible, so the claim it is cited for survives, but the pressure step is unphotographed
in both engines. Crop 2 is the family's best evidence and it is honest: the ransom-note `D`
in a serif italic fallback is unmistakable in the frame.

---

## 7 · WHAT IS GENUINELY CONVERGED (and should be banked whatever happens to §2)

- **The tier is the house's, not the family's invention.** I checked it against the frozen
  decided history: R6's idiom census row `row caption` / `.zone-row-label` is *Patrick Hand ·
  14.048 px · 400 · 0.3512 px tracking · bare · 68 % alpha*. My painted reading of
  `.margin-note-previous` is 14 px · 0.35 px · 68 % alpha in `--font-hand`. The aged line lands
  on a rung the estate already speaks, which is a stronger defence than "it mirrors the tally".
- **The width decision is real and the numbers hold.** 4.99 % → 15.82 % headroom at 360 coarse
  is the difference between "one type re-floor from clipping" and a berth.
- **AA clears with room on both themes**, independently computed here from the painted
  `color()` composited over the paper, not read off the token.
- **π holds.** Board `y`, `scrollHeight` and my filter census are invariant across depth 0/1/2
  on both engines; the lane re-ran wobble (σ 1.443/1.145/0.092), budget (9/9/9), board-
  covisibility (8/8) and heading-voice against r0 and all read unmoved; nothing under
  `loop/r0/` or `loop/pass1/` was written; the R3-d diff is proposed, not applied.
- **Line two is a `paragraph`, not a hidden node**, and there is exactly one `role=status` —
  `aria-hidden` and `user-select: none` are dead, as the spec ordered. `check-live-regions`
  agrees at the source.
- **`gateNote`'s Part B is the best idea in the diff** (see cross-pollination), off-by-one and
  all.
- **The lane's self-reporting is exemplary**: it banked its own non-gate, its own compromised
  crop, its own wrong curve expectation, an unexplained double-push under PRM it declined to
  invent a reason for, and a red it could have buried in a berth argument.

---

## 8 · HOUSEKEEPING

- The lane's evidence dir is 452 KB and mine is 68 KB, but `pass2/` as a whole is now **12 MB**
  against the wave's 2 MB cap. Not this family's doing; it needs a wave-level sweep before the
  fold.
- A scratch playwright config **cannot live outside the package** — mine failed
  `MODULE_NOT_FOUND` on `@playwright/test` from `docs/…` and had to be copied into
  `<worktree>/web/frontend/.crit-probe/` (the lane's own `.ledger-probe/` is the same
  workaround, undeclared). Pass-3 housekeeping line, beside the lane's own finding that a
  scratch vite config carries the tree's **identity** (`fs.allow`), not just its cache dir.
- I removed my `.crit-probe/` from the worktree; the sources are banked under
  `critique/NOTE-LEDGER/probe/` and must be copied back into
  `<worktree>/web/frontend/.crit-probe/` to re-run. Server on :4237 killed, port verified clear.
- No commit, no push, nothing written outside `pass2/critique/NOTE-LEDGER*`.

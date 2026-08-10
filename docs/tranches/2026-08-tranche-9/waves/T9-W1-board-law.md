# T9-W1 — THE BOARD'S LAW

The board's invariants enforced at the model, and every failure path telling the
truth. Registry families F17 (P0) + F7 (P1). The cures land in shared code — one
mechanism, five games.

## 1.1 The given cell (F17, ballot B7)

Given clues can be typed over and erased today — both engines, first interaction
(A3's probe; V1's root-cause). This is not a missing guard but a DELIBERATE
mechanism: `applyCellValue` (useGameState.ts:409-418) demotes the given
(`givenCells.delete` → `overriddenCells.add`) — while the rendering, the aria
("given clue N") and the product's whole grammar say givens are fixed. B7 decides
the semantics; its default:

- **Givens inviolable.** The model refuses the write — `applyCellValue` returns the
  refusal, the cell SAYS it visibly (the house wiggle idiom) and audibly (the status
  region: "that's a given clue"), and the `overriddenCells` machinery retires whole
  (no dual path — the no-legacy edict).
- If the owner's word flips B7 (override is intended), the demotion becomes legible
  instead: the overridden cell renders as what it is, the aria names it, and undo
  restores the given (`originalGivenCells` already preserves the truth) — the current
  silent demote-and-erase dies either way.
- **The half-write bug dies under both outcomes** (V8's new P1, both engines): the
  in-place clamp is caret-dependent — `useGameCell.ts:160-161` commits
  `raw.slice(-maxLen)` over an input DigitCell lets hold one extra char, so with the
  caret parked at 0 the FIRST keystroke on a filled cell is swallowed while the
  given→overridden reclassification fires anyway. A clue demoted by a keystroke that
  wrote nothing is wrong under any semantics.

Born-RED at three layers: unit (the model refuses / labels truthfully), e2e (type
into a given on the live board), and the W3 occlusion probe's write half. All RED at
HEAD by measurement.

## 1.2 The conflict note names the violated unit (F7, A3's P1 — root-caused by V8)

A pure column duplicate reports "check row 2" — `conflicts.ts:96-100` BUILDS the
per-unit buckets (:47-84) and then discards them for `firstRow = min(row(key))`
(V8 proved live, both engines, with an independent duplicate audit; `aria-invalid`
marks the right cells while the note names the wrong unit). The cure is already half
paid for: the buckets survive to the formatter, which speaks the violated unit in
each game's vocabulary (row / column / box / cage / inequality / path).

- **The families with NO conflict derivation join the law** (V8's new P2): killer and
  kenken cage arithmetic and thermo chain ordering are absent from `findConflicts`
  entirely — only futoshiki injects an `extra` sink. Each family supplies its unit
  sink the way futoshiki already does; a failed solve on any family can name what is
  actually wrong.
- `formatHintNote`'s unknown-axis "house" jargon and its empty-string-axis break.
- The solver-error note's "ran out of steps" asserted for unclassified faults — an
  unclassified fault says something true instead.
- The hint path classifies solver rejections exactly as the deal path does (the
  T7-adjudicated class's second instance — same taxonomy, same copy register).
- **The hint note gains its falsy branch** (V8: solve notes DO clear on edit — that
  sibling claim was refuted; hint notes persist by their own mechanism — the
  `props.hint` watch has no falsy arm and the idle wipe is graphite-guarded,
  GameBoard.vue:616-629/:655). The retraction MECHANISM lands here; its design
  grammar (what dismisses a note, how it ages) is W7 §7's.

## 1.3 The wire tells the truth (F7, A6)

One malformed `st` frame poisons the Lamport clock to NaN permanently — the merge
precedes the guard, on a bare `as number`. The guard moves before the merge; a
malformed frame is dropped and counted, never merged. Unit row: feed the malformed
frame, the clock stays finite, the session stays sane.

## Gate spine

- Born-RED units for §1.1 (refusal or truthful labeling), §1.2 (column-conflict
  note; the axis holes), §1.3 (NaN poisoning) — every one red at HEAD.
- Born-RED e2e: the given-write probe; the conflict-note probe (plant column
  conflict → solve → read the note).
- M16 register on every new string; the zone-grammar census extended.
- π identity everywhere — this wave changes words and refusals, not paint. The
  wiggle idiom reuses the existing motion grammar (no new filter budget).

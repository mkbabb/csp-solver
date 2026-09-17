# S1 — THE GUARD'S UNIT TWIN · THE PROBE'S CONTRACT · THE SPEC'S FIGURES

Seal lane S1 of the T9 W3+W6 seal, 2026-09-17. Fence:
`web/frontend/src/pencil/chrome/GameGallery/GameGallery.a11y.test.ts`,
`web/frontend/e2e/spoken-controls.spec.ts`,
`docs/tranches/2026-08-tranche-9/waves/T9-W3-spoken-product.md` (dated notes only).
No commit, no push. Two out-of-fence source files were PLANTED and restored byte-for-byte
(sha verified, `S1-06`, and at lane close).

## 1 — The unit twin of the guard gate (`fold-FA2-1.md` / `fold-FA7-1.md`, both SPENT)

Born-RED on disk, banked before the edit: `Tests 3 failed | 14 passed (17)` (`S1-01`).
Row 3 confirmed COLLATERAL exactly as the handoff said — alone at the red tree it is
`1 passed | 16 skipped` (`S1-02`), and it went green on no edit of its own.

Both seams landed verbatim. `announced()` now reads the destructive VERB off `.guard-leave`
through `findAll(...)[0]?.text() ?? ''`, so a missing ribbon returns false rather than
throwing; the one-string row is re-keyed and retitled to the verb.

| run | verdict | file |
| --- | --- | --- |
| file, cured | `Test Files 1 passed (1)` · 17 tests | `S1-03` |
| plant `sayGuard(\`\`)` | RED 3/17 | `S1-04` |
| plant `sayGuard(\`Work is at risk.\`)` | RED 3/17 | `S1-05` |
| restored | 17 passed | `S1-06` |
| full battery | **`Test Files 66 passed (66)` · 810 passed** | `S1-07`, `S1-35` |

The handoff's warning was honoured: the title-echo plant is NOT used, because the verb is a
substring of the title in all three intents. The gate polices silence, not the double-speak.

## 2 — `firstEmptyCell` and the keystroke rows (`fold-prove-1.md`, SPENT)

The value-based helper landed as written. Beside it, both keystroke arms: a `5` typed with the
sheet SHUT must WRITE (then Backspace, restoring the empty square), and a `5` typed with the
sheet UP must leave the cell `''`.

Three born-REDs, not one:

- **The cure ablated** (`GameBoard.vue` `:inert="boardCovered || undefined"` → `undefined`),
  estate spec as landed: RED 4/4, both engines, both poses (`S1-13`).
- **The write assertion alone** — same ablation, off-estate probe with the focus assertion
  softened to a log so the run reaches the write: `a keystroke wrote into a covered cell`,
  `Expected "" / Received "5"`, 4/4 both engines (`S1-16`, probe at `S1-18`). The write half is
  load-bearing on its own, not shadowed by the focus half.
- **The OLD class-based helper on the CURED tree** — 12 of 16 RED over four repeats, every one
  at the new sheet-SHUT control: `Expected "5" / Received "7"`, `"2"`, `"1"`… (`S1-14`,
  `S1-15`). Cell 0 is a given on most deals and W1's B7 refuses its write, which is exactly the
  vacuous-green the handoff feared. The control is what catches it.

`.cell-native-input` mounts on all 81 cells before the row reads them, and the helper answers a
genuinely blank cell (index 0/1/2, deal-dependent, stable at t0/t300/t1300) — measured, because
a lazily-mounted input would have made the helper answer a given (`S1-29`, probe `S1-30`).

## 3 — The spec's occlusion figures, and a metric that was measuring its own cure

The chair's ruling landed as a dated **ADJUSTED** block at T9-W3 §3.1 (freeze law: appended,
original lines legible). Metric of record **CENTRE-UNDER-SHEET**, mechanism **MODAL**, P0 on
**81/81 focusable**. Re-derived at the seal tree rather than carried (`S1-27`, probe `S1-28`),
both engines identical:

| pose | centreUnderSheet | fullyUnderSheet | clearOfSheet | focusable shut | focusable up |
| --- | --- | --- | --- | --- | --- |
| 390×844 | 81/81 | 81 | 0 | 81/81 | 0/81 |
| 768×1024 | 63/81 | 54 | 18 | 81/81 | 0/81 |
| 820×1180 | 54/81 | 45 | 27 | 81/81 | 0/81 |

Reproduces the prove lane to the cell, and reproduces the chair's 81/63/54 and the 18/27 the
modal ruling names. The P0's 81/81 is the sheet-SHUT sweep; the cure reads 0/81 up at every
pose.

**Two findings the re-derivation forced, both landed:**

1. **Centre-under-sheet is GEOMETRIC, not a hit-test.** The note as first drafted said the
   metric is a hit-test and that `coveredCells` already took it. Both were wrong.
2. **The old hit-test census was measuring the cure.** `inert` removes an element from
   hit-testing, so `document.elementFromPoint` on a cured tree calls **all 81 cells covered at
   every pose, both engines** (`centreHitTestCovered` in `S1-27`; the prove lane's own control
   reads `inertIsBox: false`). The §3.1 premise — "the board really is painted out, measured
   rather than assumed" — was being satisfied by the cure it is meant to be independent of.

So `coveredCells` moved to the geometric predicate, gained a **sheet-SHUT control of its own**
(0 covered), and gained a `boardLaidOut` poll — a census taken mid-layout counts only the cells
that already have a box and answers about a third of the board, which is where the file
header's 59–62 / 47–46 / 40–42 came from. This lane reproduced that artifact by accident before
recognising it.

Plant-proof for the new control: a census that answers "covered" unconditionally reds 4/4, both
engines, at the shut control (`S1-31`, probe `S1-32`).

**This is the one place S1 went past the literal handoff text**, and it is flagged for the
chair: the chair ordered the file header aligned to the metric of record, which is not possible
while the helper measures something else.

## 4 — Verification, at the landed tree

All from `web/frontend`, bare. `S1-34` unless noted.

| gate | verdict |
| --- | --- |
| `npx vitest run --silent` | `Test Files 66 passed (66)` · 810 passed (`S1-35`) |
| `npx vue-tsc --noEmit` | EXIT 0 |
| `npm run typecheck:e2e` | EXIT 0 |
| `npm run typecheck:node` | EXIT 0 |
| `npx eslint` on the two lane files | EXIT 0 |
| `npx eslint .` (whole estate incl. `e2e/`) | EXIT 0 |
| `npm run lint` (prettier; `e2e/` never touched) | EXIT 0 |
| `check-copy-register.mjs` + `--self-test` | EXIT 0 |
| `check-live-regions.mjs` | EXIT 0 |
| `spoken-controls.spec.ts`, both engines | 13 passed / 1 skipped ×3 (`S1-36-a/b/c`) |

The one skip is the declared webkit clipboard holdout the file names at its own `test.skip`.

`GameGallery.a11y.test.ts` needed `prettier --write` after the edit (`src/` is prettier-covered);
the reflow is one call argument. `e2e/` was never run through prettier.

## 5 — Left open, deliberately

- **The unit floor.** Its blocker (the three RED rows) is gone and the battery is a clean
  census, so `check-unit-count.mjs` now fails on the stale floor alone: **661 → 689 owed**,
  stamped census 735 → 810 (`S1-37`). `scripts/census.stamp.json` is out of fence — handed over
  at `../handoffs/seal-S1-1.md`.
- **The double-speak row `fold-FA2-1.md` recommends** for this unit file's 3.2 describe. In
  fence and cheap, but NOT taken: it is a row addition nobody ordered at a seal, and it would
  move 810 to 811 under a restamp that is about to be taken. Chair's election, and the restamp
  should follow it rather than precede it.
- **Run 1's two webkit reds at 768×1024** (`S1-08`) were the 9-worker contention class
  PROVE-RECORD finding 5 documents: isolated, 1 worker, 3 repeats → 6/6 green (`S1-12`), and
  six subsequent full-file runs are clean.

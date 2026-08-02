# T5-W2 F2 — FUTOSHIKI ONTO THE FROZEN CONTRACT

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base**
`e63af853` (working tree carrying F1, uncommitted — the lead commits) ·
**charter** `../wave-open.md` · **template** `../f1/`

| File | What it holds |
|---|---|
| `00-before.txt` | the futoshiki dir at lane open — every file, `wc -l`, the 2.1e count |
| `10-after.txt` | the same census on this tree, plus the futoshiki unit lane in isolation |
| `20-probes.txt` | the twin kill list, the LOC delta, and the exit's registry greps |
| `30-slot-census.md` | the 2.1b census for futoshiki, cited to file:line — **and the three amendment requests** |

---

## What landed

Futoshiki is the **second game onto the contract, and the first to fill the clue seam**.
Where sudoku states `clues: null`, futoshiki states the whole thing — and that is what this
lane was really for: proving the seam sudoku could not exercise.

- `games/futoshiki/spec.ts` — the eight slots. `geometry: "latin"`, `requestVoice: false`,
  `gradeHint: false`, `furniture.cell` = the shared `DigitCell`.
- `games/futoshiki/clue.ts` — **the seam as data**: `caretFigures` (the edge-midpoint
  geometry), `constraintLabels` (the a11y clauses), `inequalityViolations` (the conflict
  extra), `encodeInequalities`/`decodeInequalities` (the wire head). Pure, board-size in,
  no refs — so the same four functions serve a live board, a canned poster and a unit test.
- `games/futoshiki/CaretOverlay.vue` — THE clue layer, lifted out of the dead board
  adapter's `#overlay` slot with its scoped CSS verbatim.
- `games/futoshiki/FutoshikiCaret.vue` — the glyph a single caret IS, moved up one level
  and otherwise untouched; the `FutoshikiBoard/` directory is gone.
- `games/futoshiki/clue.test.ts` — 14 assertions over behaviour that had **no test before**
  because it lived inside a board's script block.

**Dead:** `FutoshikiGame.vue` (178) · `FutoshikiBoard/FutoshikiBoard.vue` (318). **496 raw
lines**, and the futoshiki dir's non-test LOC falls **1,868 → 1,620 (−248)** net of the three
modules that landed.

Two things shrank by folding rather than deleting, and both are the wave's own thesis:

- `FutoshikiPoster.vue` **136 → 95**. Its caret math was a hand-copy of the board's, sitting
  in a file nothing compared against the original. Both read `clue.ts` now, so the still and
  the live board cannot print different carets.
- `solver/useSolver.ts` **193 → 182**. `toFlatInequalities`/`toPairs` were
  `clues.encode`/`clues.decode` under other names. One pair of functions serves the worker
  and the seam, which is what makes one protocol possible at 2.2.

## The exit, met

- **`npx vitest run --silent` — 31 files, 341 tests, 0 failed.** Whole tree, at lane close.
  This lane's share: `src/games/futoshiki` **4 files / 61 tests** in isolation, of which
  `clue.test.ts` is **14 new**.
- **twin kill list with `wc -l` before/after** — `20-probes.txt` §1–§3.
- **registry consumption gone-or-inert** — `20-probes.txt` §6. Futoshiki's ONE `@games/registry`
  import is `game.ts`'s, and `game.ts` is now declared a corpse in its own header: its single
  consumer is `gameRegistry`, which has zero production readers. It could not be deleted here —
  `registry.ts` imports it and `registry.ts` is fenced from this lane — and the exit's own
  wording ("gone-or-**inert** pending F4") is what that state is.

Also clean, unasked: `vue-tsc -b` reports **zero** futoshiki errors, `prettier` unchanged,
`eslint` clean, and `lint:boundary` carries **no futoshiki row** — futoshiki has never imported
a sibling game.

## The V1-STUB row does not apply here

The wave header rules "V1-STUB codec dies — one persistence serves all five", and futoshiki
carries **one of the two FULL codecs**. The SHA-identical stub tail is thermo's, killer's and
kenken's. `composables/useUrlState.ts` therefore stays exactly as F1 left sudoku's, plus one
line: `STORAGE_KEY` is exported so `spec.urlCodec.key` names it instead of mirroring it.

## Concurrency, declared

The four F2 lanes ran **on one working tree at the same time**. Three files are shared
ground and were merged, not owned: `cards.ts` (futoshiki's row only), `cards.test.ts` (the
migrated-rows ledger), and — mid-lane — the full unit run, which went red twice on sibling
lanes' in-flight states (thermo's row naming a deleted scene; killer's `spec.test.ts`
mid-edit) before settling green. Every whole-tree number in this directory is therefore a
JOINT number and is labelled as such; every futoshiki-only number is path-filtered and is
this lane's alone.

## For the lead — three amendment requests, and one interim

Full text, with the cure sketched at each site, in `30-slot-census.md` §Amendments. In brief:

1. **The clue VALUE never reaches `BoardHost`.** `GameShell` mounts it without `:clue`, so
   `spec.clues.props(props.clue, dim)` is called with `undefined`. Sudoku's `null` seam meant
   F1 shipped green without seeing it. **All four F2 lanes need this**; it is the barrier's
   headline row.
2. **`BoardHost` passes no conflict `extra`**, so a violated inequality is no longer circled.
3. **`BoardHost` never binds `constraint-label`**, so the clue vanishes from the accessibility
   tree — an **AX-baseline row** against wave-open §3's "must not silently cost any".

All three sit in `games/shared`, frozen to this lane. This lane did **not** reach around the
fence: no module-scoped "last mounted model", no `provide`/`inject` side channel. `spec.ts`
is written straight against the contract as fixed at open, and its `props` will throw on
mount rather than render a caret-less board — 2.4's FAIL-EXPLICIT law applied to the shell's
own hole. The three cures are banked ready: `clue.ts` already exports exactly the two
functions rows 2 and 3 need, in exactly the shapes `findConflicts` and `DigitCell` take.

**The interim, named:** until those land, futoshiki mounts into a throw. It is legal only
inside this workflow's sequence and must be gone before F3's π gate — which is the first gate
that would see it.

One consequence outside `src/`, taken because leaving it would have been worse than a
regression — it would have been a **silently inert test**: `e2e/gallery-deal.spec.ts:442`
held futoshiki's lazy chunk open by routing on `/FutoshikiGame\.vue/`. That module no longer
exists, so the route would have matched nothing and the test would have raced instead of
holding. It now routes on `/futoshiki\/spec/`, the module the card actually requests.
`e2e/throttled-void.spec.ts`'s header prose names the new loader too. No e2e was run — the π
gate and the behaviour battery belong to F3.

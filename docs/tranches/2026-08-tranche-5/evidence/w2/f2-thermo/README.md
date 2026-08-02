# T5-W2 F2 — THERMO ONTO THE FROZEN CONTRACT

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base** `e63af853`
(working tree carrying F1) · **tree** working, uncommitted — the lead commits.

The charter of record is `../wave-open.md`; the pattern of record is `../f1/`. This directory
is the thermo lane's evidence:

| File | What it holds |
|---|---|
| `00-before.txt` | the thermo dir at open — 14 files, 1,299 lines, the registry edge, the shared-tree unit baseline |
| `10-after.txt` | the twin-file kill list with `wc -l` before/after, the counts, and the greps |
| `20-barrier.md` | **the two shared defects this lane may not fix, with the exact patch** |
| `30-v1-stub-tail.txt` | the SHA proof that one persistence serves all five, and why the tail survives F2 |
| `40-slot-census.md` | the 2.1b census for thermo, cited to file:line |

**Three F2 lanes (futoshiki, thermo, killer/kenken) ran concurrently on one working tree.**
Every whole-tree number here is a shared reading and is named as such; the thermo-scoped
numbers are this lane's alone.

---

## What landed

**A Thermo-Sudoku declared as data instead of copied as components.**

- `games/thermo/spec.ts` (79 lines) — the union `GameSpec`, eight slots. `geometry: "boxed"`
  buys the sub-grid band, the box-peer adjacency and the √n tick count; `requestVoice` /
  `gradeHint` buy the request clause and the UI-13 whisper. The ONE genuine divergence is the
  `clues` seam: `ThermoTube` + its prop mapping + the wire codec pair, entire.
- `games/thermo/ThermoTube.vue` — now THE clue overlay, mounted straight into `BoardHost`'s
  `#overlay`. Flattened out of its per-component directory (the futoshiki lane's precedent for
  `FutoshikiCaret`).
- `games/thermo/spec.test.ts` — the successor to `game.test.ts`.
- `games/cards.ts` — the thermo row's `scene` becomes `load`, the F1 pattern, one line.

**Dead:**

| file | lines | why |
|---|---|---|
| `ThermoGame.vue` | 155 | `SudokuGame.vue` with the names changed — `GameShell` is the scene |
| `ThermoBoard.vue` | 255 | `SudokuBoard.vue` plus six lines of overlay — `BoardHost` is the board |
| `game.ts` | 53 | the `@games/registry` declaration — `spec.ts` is the contract |
| `game.test.ts` | 47 | asserted a `GameDefinition` shape that no longer exists |
| **510** | | against **182** written (`spec.ts` 79 + `spec.test.ts` 103) |

Thermo dir: **14 files → 11**, **1,299 → 997** lines; non-test **1,224 → 866** (−358, −29%);
the 2.1e per-game count **12 → 10** (the solver triple is F3's, not this lane's).

## Green

`npx vitest run --silent` → **31 files, 341 tests, 0 failed** (whole tree, all three lanes'
work resolved together). Thermo's own slice: `spec.test.ts` + `thermoWire.test.ts` +
`cards.test.ts` = 3 files, 18 tests. prettier clean over `games/thermo` + `cards.ts` +
`cards.test.ts`; `eslint src/games/thermo` clean; `vue-tsc -b` **0 errors**, whole tree.

**Not run, by charter:** build, goldens, playwright. π after the barrier is F3's.

`vue-tsc` was run because the unit lane structurally cannot see what it caught: flattening
`ThermoTube` out of its directory left a type-only `import … from "../types"` pointing at
nothing, and **341 tests passed over it** — a type-only import is erased at transpile, so no
runtime ever resolved the path. Fixed at `./types`. The F2 exit criteria stop at vitest, which
would have banked that green; the lesson is banked in `10-after.txt` with the barrier's own
instance of the same class (`App.vue:84` typechecks clean and cannot mount).

## Registry consumption — gone, not inert

```
$ grep -rn 'from "@games/registry"' src/games/thermo
  0 matches
```

`registry.ts` names thermo nowhere (its `gameRegistry` has held `{ futoshiki }` since F1);
`registry.test.ts:36` declares a LOCAL compile-time `thermoGame` stub of its own, never imported
from the game, which dies with the file at F4. The only remaining string "registry" under
`src/games/thermo/` is `spec.ts:18`'s obituary for the edge it replaced.

## π — what moved, and why nothing did

No golden was taken (F3's gate), so this section is a claim about the DIFF, not a measurement,
and it is written to be falsified there.

The one DOM change is the retirement of `ThermoBoard`'s `.thermo-clue-layer` wrapper. `BoardHost`
mounts `clues.overlay` directly into `#overlay`, so the wrapper has no author left. It carried
`position:absolute; inset:0; z-index:1; pointer-events:none` and `aria-hidden` — every one of
which `ThermoTube`'s own `<svg class="thermo-tube-overlay">` root already carries — over a child
that was itself `position:absolute; inset:0; width:100%; height:100%`. The wrapper's box and the
SVG's box are the same box (`inset:0` of the same `position:relative` `.board-wrapper`), so the
layer loses a node and keeps its rectangle.

The wrapper's ONE non-redundant rule was the F6 page-turn beat, and it moved verbatim onto the
SVG in `ThermoTube.vue`'s own scoped block — same property, same 200ms, same `--ease-fadeOut`,
same `.board-leaving` ancestor. Inert on `ThermoPoster`, which has no leaving state.

Everything else is a re-home: the same `GameBoard`, the same `DigitCell` (which `ThermoBoard`
already mounted since F1), the same `findConflicts` with the same `subgridSize`, the same
`${n} by ${n} thermo board, ${difficulty}` label — `BoardHost`'s `.toLowerCase()` and
`ThermoBoard`'s `DIFFICULTY_WORD` map agree on all three tiers — and the same fresh-board copy.

## For the lead

1. **TWO BARRIER ITEMS BLOCK EVERY MIGRATED ROW FROM MOUNTING.** `20-barrier.md`. In short:
   `App.vue:84`'s `loader: card.scene!` is now `undefined` for all four lazy rows, and
   `GameShell` binds no `:clue` while `ClueSeam` has no member that names where the live clue
   lives. Both are shared, both are identical for all four clued lanes, both are fenced from a
   lane, and both carry an exact patch in that file. Thermo is the first game with a non-null
   `clues`, which is why the second one surfaces here and could not have surfaced at F1.
2. **Amendment request, named cause, dated:** `ClueSeam` gains `from: (model) => TClue`. The
   four fixed members cannot express which model field carries the clue, and a generic shell
   cannot guess `thermometers` / `inequalities` / `cages`. Rejected alternatives, recorded: an
   excess property (does not compile) and provide/inject around the declared seam (a second path
   for a fact that has one).
3. **`persistKey` asymmetry, ratified not fudged.** Sudoku's row NAMES `sudokuSpec.urlCodec.key`
   because its spec is already in the main chunk; a lazy row that did the same would drag its
   spec out of its chunk to read one string. Thermo's row spells the literal and
   `cards.test.ts:82` pins the two equal, so they cannot drift while both live.
4. **Thermo gains a cold-start prewarm** it never had (`useSolver` exported no `prewarm`; a NOTE
   said it would return "when that scene lands"). That is `solver.prewarm`'s contract, not a
   per-game choice. One idle worker spin-up on select; no pixel.
5. **V1-STUB stays, and the proof is banked.** `30-v1-stub-tail.txt`: 28 of 28 tail lines
   identical across thermo/killer/kenken once the game's own noun is struck — one text written
   three times. Killing it needs `games/shared/persistence.ts`, which is fenced from this lane
   AND is wave-open 2.4d's owner-ratification row. The seam it will consume
   (`clues.encode`/`decode`) is landed and named.
6. **A measurement this lane got wrong once, and the correction.** The first stub-tail run
   normalised `thermo` before `thermometer`, mangled a doc comment to "meter", and reported the
   tails as divergent. The corrected instrument and the false negative are both in
   `30-v1-stub-tail.txt` — substitution order is load-bearing in that grep, and the next lane to
   run it should take the corrected form.

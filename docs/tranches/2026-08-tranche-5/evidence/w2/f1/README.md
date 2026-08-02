# T5-W2 F1 — THE SCAFFOLD + THE PROOF GAME

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-01 · **base** `f087a90d`
(clean) · **tree** working, uncommitted — the lead commits.

The charter of record is `../wave-open.md`. This directory is F1's evidence:

| File | What it holds |
|---|---|
| `00-before.txt` | the baseline at `f087a90d` — build, 4/4 goldens, 332 tests, 23 boundary errors, the structural counts |
| `10-after.txt` | the same gates on this tree, plus the behaviour smoke |
| `20-probes.txt` | the wave-open §2 probes, re-derived here, with the two instrument corrections |
| `30-slot-census.md` | the 2.1b census for sudoku, cited to file:line, and the two amendments |

---

## What landed

**One scene, one board, one cell, one cage, one table, one contract.**

- `games/shared/defineGame.ts` — the union `GameSpec` (8 slots), `BoardGrammar`, `ClueSeam`,
  `DealSpec`, and `GameModel`, the shell's read contract over the model. **It imports nothing
  from the table**, which is the whole TDZ cure.
- `games/shared/GameShell.vue` — THE scene, and the spec's sole consumer.
- `games/shared/BoardHost.vue` — THE board host; `GameBoard`'s one caller.
- `games/shared/DigitCell.vue` — THE cell. `SudokuCell` + `FutoshikiCell` die.
- `games/shared/CageOverlay.vue` — THE cage. `KillerCage` + `KenKenCage` die.
- `games/shared/selectors.ts` — the `SelectorBand` vocabulary the card and the drawer share.
- `games/cards.ts` — THE table, five rows, moved out of `registry.ts`.
- `games/sudoku/spec.ts` — the proof game. `SudokuGame.vue`, `SudokuBoard.vue`,
  `SudokuCell.vue` and `game.ts` are deleted; sudoku's residue is model, codec, technique,
  selectors, solver, poster, templates.
- `games/{killer,kenken}/clue.ts` — each game's corner-label mapping, so the live board and the
  poster print one thing.

Everything is green: build · `vue-tsc -b` 0 · **315 unit executed, 30 files, 0 failed** ·
prettier · eslint · knip 0 · golden-bytes · prod-shake · font-coverage · doc-truth 13/13 ·
**π 4/4** · 26/26 behaviour e2e across chromium + webkit on the built dist.

## π — the claim, and how it was taken

`npm run build`, then the four goldens against **the built dist** on a preview this lane owns
(`:4188`, killed after). The owner's dev server holds `:3000` and was never touched; the golden
config's `webServer` fallback would have spawned/reused a DEV server, which the golden discipline
forbids, so `PLAYWRIGHT_BASE_URL` points at the preview instead.

**4/4 passed. No baseline was re-minted; `e2e/goldens/` has no diff.** `cell-light` and
`grid-corner-light` are the two load-bearing surfaces this step rewrites, and both are stable —
which is the real claim: the cell that renders in `cell-light.png` is now a different module,
compiled under a different scoped-CSS hash, mounted through a different host, inside a different
scene, and it rasterises to the same pixels.

Two DOM contracts were preserved deliberately rather than discovered late:

- the family class (`.sudoku-cell` / `.futoshiki-cell`) — `index.css:699`'s `:focus-within`
  ring, `useKeyboardViewport`'s `CELL_SELECTOR`, and ~120 e2e assertions key on it. `DigitCell`
  derives it from `grammar.geometry`, which partitions the five games exactly as the two class
  names always did.
- the cage classes (`g.killer-cage`, `path.…-cage-boundary`) — `CageOverlay` emits a static
  hook class for its own CSS **and** the game's `${family}-cage-*` prefix for the estate.
  `--killer-ink` / `--kenken-ink` were declared as overrides and set nowhere, so folding them
  into one `--cage-ink` hook changes no pixel; the corner label's `sum` / `target` class names
  differed and are now `…-cage-label`, updated at their four assertion sites.

## Fences — held

`git diff --stat` on the three fenced surfaces:

```
src/games/shared/GameControlPanel.vue        — 0 changed lines
src/games/shared/GameScene.vue               — 0 changed lines
src/pencil/chrome/GameGallery/GameGallery.vue— 0 changed lines
```

Not one line, not even an import. `GameShell` mounts `GameScene` and `GameControlPanel` with the
same props and the same slot shapes the five scenes passed; `GameGallery` receives the same
`GalleryCard[]` shape from `cards.ts` that it received from `registry.ts`.

## The two instrument corrections (ruling + enforcing config, same commit)

Both were silent failures that would have banked a vacuous green.

1. **`eslint.boundary.config.js`** discovered a game by "a directory carrying `game.ts`".
   Sudoku's registration point is `spec.ts` now, so the generator dropped sudoku from the matrix:
   20/20 ordered pairs fell to 12/12 and **sudoku stopped being fenced at all**, while the error
   count read `18` off a smaller law. The discriminator now names both registration points; the
   second arm dies with `registry.ts` at F4. Matrix reads 20/20; count reads **17** (from 23).
   The CI lane's prose comment is corrected in the same change.
2. **`scripts/check-doc-truth.mjs`** derived its five-game list by grepping `id: "…"` rows out
   of `registry.ts`. The rows moved to `cards.ts`; the derivation found zero games and the
   `make-wasm-recipe` row went RED against the Makefile's honest "five families". Pointed at the
   table. 13/13 GREEN, re-run.

## Interim states, declared (legal only inside this workflow's sequence; gone by VERIFY)

- **`GameCard` mounts through a two-arm union**: `{ load }` for a migrated game (sudoku),
  `{ scene }` for one that has not folded onto the shell yet. Exactly one per row, enforced by
  the type and asserted in `cards.test.ts`. Each F2 lane swaps its row's `scene` for `load`; the
  union collapses to its first arm when the last one does. `App.sceneFor` carries the matching
  two arms and a comment naming the single arm it becomes.
- **`registry.ts` survives** with `GameDefinition`, its own `defineGame`, and a `gameRegistry`
  now down to `{ futoshiki }` — the declaration the four unmigrated games still hang on, per the
  charter's "registry.ts STAYS ALIVE until F4". Its half that was ever true (`GAMES`) has left.
  Two functions named `defineGame` coexist for the duration; the shared one is the contract, the
  registry one is the corpse. `registry.test.ts` says so and asserts the one remaining row.

## For the lead

1. **Amendment ×2 to the fixed table.** `solver` gained `prewarm` (the shell must warm a worker
   and the scenes that used to are gone); `deal` did NOT gain `prewarm` (it had no reader `eager`
   did not already serve — a boolean with one value across five games). Causes named and dated in
   `30-slot-census.md`. The wave's law says a defect in the table is an amendment with a cause,
   appended — this is that appendix.
2. **Slot-read census.** Sudoku banks **8/8 slots, 17 read expressions** (13 shell-side, 4
   table-side). Against `productionSlotReads`, F1 is one game of five: whichever figure §1.4(4)
   is settled on (25 as a floor, or the enumerated 40), sudoku is at or above its share. One
   honest gap is recorded rather than papered: `solver.nodeBudget` is read by the spec's own
   model factory, not by the shell, so the budget table has one home; F3 moves that read.
3. **BoardHost's clue-conflict seam is F2's first amendment request.** Futoshiki's conflict
   function adds inequality violations on top of the Latin band, and `ClueSeam` as fixed at open
   carries `{ overlay, props, encode, decode }` with nowhere for it. Sudoku needs nothing here,
   so F1 raises it rather than pre-solving it: F2's futoshiki lane will need either a fifth
   `ClueSeam` field or the conflict extra folded into `props`. Flagging early because the table
   fixes at open.
4. **Deleted test, named.** `sudoku/game.test.ts` asserted that `SudokuGame.vue`'s hand-inlined
   control sections equalled `sudokuGame.options(model)`. Both sides are gone — there is one
   list, read off `deal.options` — so the drift it guarded is now structurally impossible. That
   is why the executed count is 315 and not 332; every row of the delta is itemised in
   `10-after.txt`.
5. **Bundle dividend, unasked for:** main chunk 239.75 kB → 209.76 kB (gzip 88.12 → 78.21).

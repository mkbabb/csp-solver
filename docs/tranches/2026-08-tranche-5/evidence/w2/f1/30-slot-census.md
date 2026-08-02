# T5-W2 F1 — THE SLOT-READ CENSUS, SUDOKU

The gate (wave-open 2.1b): *every slot exercised by construction, not by convention.* At HEAD
sudoku read **nothing** — `SudokuGame.vue:57-73` hand-inlined its own control sections to dodge
the registry cycle, and the four slots its `game.ts` declared (`model`, `cellFurniture`,
`clueFurniture`, `solverPayloads`) had **zero** production consumers between them.

At F1 sudoku reads **8 of 8**. Every row below is a live expression on this tree, cited to
file:line, re-read at banking.

| Slot | Read at | What the read does |
|---|---|---|
| **model** | `GameShell.vue:56` — `props.spec.model()` | the one instantiation, at mount. Five hand-written call sites become one. |
| **grammar** | `BoardHost.vue:47` (bind) · `:66`, `:89`, `:101` (`geometry`) · `:76` (`requestVoice`) · `:80` (`noun`) · `:132` (`gradeHint`) · `GameShell.vue:136` (`geometry`) | sub-grid root, peer band, conflict band, grid a11y label, the "— you asked for medium" clause, the UI-13 whisper, the laminate's mini-grid. **8 reads, all four fields.** |
| **clues** | `BoardHost.vue:140` (`props`) · `:218` (the `#overlay` gate) · `:222` (`overlay`) | sudoku's `null` is read as a STATED ABSENCE: the overlay template does not render, and that branch is what makes the same host honest for the four games that do print furniture. |
| **furniture** | `BoardHost.vue:186` — `:is="spec.furniture.cell"` | the component the `#cells` slot mounts, ×`totalCells`. |
| **solver** | `GameShell.vue:73` — `props.spec.solver.prewarm()` | the cold-start warm on the first idle tick. `solver.nodeBudget` is read by the spec's own model factory (`spec.ts:41 → useSudoku`) so the budget table has ONE home; F3's `createSolverClient` moves that read into the shell too. |
| **urlCodec** | `cards.ts:118` — `persistKey: sudokuSpec.urlCodec.key` | the staging ledger's cold-start backfill source. One string, named by the card, owned by the spec — not mirrored. |
| **poster** | `cards.ts:119` → `GameGallery` via `App.vue:529` | the card's separate lazy chunk (the gallery draws five thumbnails without loading five specs). |
| **deal** | `GameShell.vue:60` (`options`) · `cards.ts:100`+`:116` (`sizes`) · `cards.ts:105` (`difficulty`) | the control sections, the picker's range sub-line, the picker's staging chips. |

**Count.** 8/8 slots live · **17 distinct read expressions** on the sudoku row · shell-side
(`GameShell` + `BoardHost`) **13**, table-side (`cards.ts`) **4**.

## Against the gate

`gates.json` W2 `registryFiction.productionSlotReads: 25` is a **floor over five games**;
wave-open §1.4(4) enumerates **40** under the union's shape (8 × 5) and leaves the lead the call
between restamping and holding 25 as a floor. F1 migrates one game, so it banks **8** — the
per-game share of whichever figure the lead fixes (8 × 5 = 40; the floor's per-game share is 5).
Sudoku is at or above both. The remaining 32 arrive one game at a time through F2.

## The one honest gap

`solver.nodeBudget` is not yet read by the shell. It is read once, by sudoku's own model factory,
which is why the budget table exists in exactly one place instead of two. Recording it as a
shell read would be a fabricated census row; recording it as unread would deny a live consumer.
It is a **spec-internal read**, named as such, and 2.2/F3 collects it when the one solver client
lands.

## Two amendments to the fixed table (named causes, dated 2026-08-01, F1)

**1 · `GameSpec.solver` is `{ nodeBudget, prewarm }`**, where wave-open §1.2 fixed
`{ nodeBudget }`. Cause: with the per-game scenes deleted there is no module left for the shell
to import `prewarm` from — both scenes did it by reaching into their own `solver/useSolver`.
The verb rides the slot it belongs to and dies there at F3, when `createSolverClient` builds it
from `id + grammar + clues` over the one client.

**2 · `DealSpec.prewarm` is NOT in the type**, where §1.2 carried `prewarm?: boolean` and §1.3
mapped `GameCard.eager` onto it. Cause: it had no reader `eager` did not already serve. Every
mounted scene warms its own worker on its first idle tick — the eager game at app mount, a lazy
game on select — so the flag would have carried ONE value for all five games while `eager` (read
by `App.sceneFor` to pick the main-chunk ride, and by the gallery's warm loop to skip it) carried
the real fact. Landing it would have been the config-flag disease the contract's own KISS guard
names, and a slot with no consumer is a slot the reconciliation should have deleted (§1.3's own
rule, applied to itself). `eager` stays on the card, where the chunking truth lives.

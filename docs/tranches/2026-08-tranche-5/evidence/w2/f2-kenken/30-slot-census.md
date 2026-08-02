# T5-W2 F2-KENKEN — THE SLOT-READ CENSUS

The gate (wave-open 2.1b): *every slot exercised by construction, not by convention.* At HEAD
kenken read **one** slot — `KenKenGame.vue:35` called `kenkenGame.options(kenken)`. The other
four its `game.ts` declared (`model`, `cellFurniture`, `clueFurniture`, `solverPayloads`) had
**zero** production consumers: the scene instantiated `useKenken()` by hand (`KenKenGame.vue:29`),
`KenKenBoard.vue:161` named `DigitCell` by hand, `:199` named `CageOverlay` by hand, and the
solver came in through `useKenken`'s own import.

At F2 kenken reads **8 of 8**. Every row below is a live expression on this tree, cited to
file:line, re-read at banking.

| Slot | Read at | What the read does |
|---|---|---|
| **model** | `GameShell.vue:56` — `props.spec.model()` | the one instantiation, at mount. |
| **grammar** | `BoardHost.vue:47` (bind) · `:66`, `:89`, `:101` (`geometry`) · `:76` (`requestVoice`) · `:80` (`noun`) · `:132` (`gradeHint`) · `GameShell.vue:136` (`geometry`) | the boxless sub-grid root (`latin` → side, so `HandDrawnGrid` draws no interior box), the row/col peer band, the cage-blind Latin conflict band, the grid a11y label, the suppressed request clause, the suppressed UI-13 whisper, the laminate's mini-grid. **8 reads, all four fields.** |
| **clues** | `BoardHost.vue:140` (`props`) · `:218` (the `#overlay` gate) · `:222` (`overlay`) | kenken's seam is non-null, so the overlay branch renders `CageOverlay` with the seam's own mapping. **One honest gap, §Gap below: the seam's `props` is handed `props.clue`, which `GameShell` never binds.** |
| **furniture** | `BoardHost.vue:186` — `:is="spec.furniture.cell"` | the component the `#cells` slot mounts, ×`totalCells`. `KenKenBoard.vue:161`'s hand-named `DigitCell` dies. |
| **solver** | `GameShell.vue:73` — `props.spec.solver.prewarm()` | the cold-start warm on the first idle tick — a verb kenken's `useSolver` did not even export until this lane's spec needed it. `solver.nodeBudget` is read by the spec's own model factory (`spec.ts:64 → useKenken`), so the budget table has ONE home; F3's `createSolverClient` moves that read into the shell too (the same gap F1 recorded for sudoku). |
| **urlCodec** | `spec.ts:65` ← `kenkenUrlState.STORAGE_KEY`, asserted equal to `cards.ts:198`'s `persistKey` by `cards.test.ts:74` | the board's key on disk. A LAZY row spells the string (the ledger backfill must read five boards without pulling five specs), and the test is what keeps the two from drifting. |
| **poster** | `cards.ts:199` → `GameGallery` via `App.vue` | the card's separate lazy chunk. |
| **deal** | `GameShell.vue:60` (`options`) · `cards.ts:189`+`:191` (`sizes`, via kenken's own band) · `cards.ts:194` (`difficulty`) | the control sections, the picker's 4×4/5×5/6×6 sub-line, the picker's staging chips. `spec.test.ts` pins that the sections' bands ARE `deal.sizes`/`deal.difficulty` by identity — one vocabulary, not two lists that agree today. |

**Count.** 8/8 slots · **17 distinct read expressions** on the kenken row · shell-side
(`GameShell` + `BoardHost`) **13**, table-side (`cards.ts`) **4** — the same census shape F1
banked for sudoku, which is the point: one shell, five games, no per-game arithmetic.

Against `gates.json` W2 `registryFiction.productionSlotReads` (25 as a floor; wave-open §1.4(4)
enumerates 40), kenken banks its **8**. Four games of five are in at this barrier.

## The gap, named rather than papered

`clues` is the only slot whose VALUE never arrives. `BoardHost.vue:140` spends `props.clue`, and
`GameShell` binds no `:clue` — F1 shipped green over it because sudoku's seam is `null`. Every
clued game hits it at once, and it is not fixable from inside `src/games/kenken/`: `ClueSeam` as
fixed at open has no member that can name the model field the live clue lives on (`cages` here,
`thermometers`/`inequalities` elsewhere), and a generic shell cannot guess.

The thermo lane raised the amendment first — `evidence/w2/f2-thermo/20-barrier.md`, a fifth
`ClueSeam` member `from: (model) => TClue` — and this lane **confirms it independently and adopts
its shape**. kenken's line, when it lands, is one:

```ts
from: (m) => m.cages.value,
```

`kenkenSpec.clues` is written to the table **exactly as fixed at open** (four members), so the
amendment is purely additive here. The seam is proved in isolation meanwhile: `spec.test.ts`
mounts `clues.overlay` with `clues.props`' own output — the erased pair `BoardHost` binds — and
round-trips every operator kind through `clues.encode`/`clues.decode`. That is the whole seam
except the one binding this lane may not write.

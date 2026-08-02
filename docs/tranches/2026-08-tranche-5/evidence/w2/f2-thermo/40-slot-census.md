# T5-W2 F2 — THE SLOT-READ CENSUS, THERMO

The gate (wave-open 2.1b): *every slot exercised by construction, not by convention.* At HEAD
thermo read **one** slot — `ThermoGame.vue:39`'s `thermoGame.options(thermo)` — and the four
others its `game.ts` declared (`model`, `cellFurniture`, `clueFurniture`, `solverPayloads`) had
**zero** production consumers between them: the scene hand-instantiated `useThermo()` at `:32`,
the board hard-imported `DigitCell` at `:14` and `ThermoTube` at `:15`, and the solver client
was reached through `useThermo` → `useSolver`, never through the declaration.

At F2 thermo reads **7 of 8 live, 1 pending the barrier**. Every row below is a live expression
on this tree, cited to file:line, re-read at banking.

| Slot | Read at | What the read does |
|---|---|---|
| **model** | `GameShell.vue:56` — `props.spec.model()` | the one instantiation, at mount. `ThermoGame.vue:32`'s hand-written `useThermo()` is gone. |
| **grammar** | `BoardHost.vue:47` (bind) · `:66`, `:89`, `:101`, `:201` (`geometry`) · `:76` (`requestVoice`) · `:80` (`noun`) · `:132` (`gradeHint`) · `GameShell.vue:136` (`geometry`) | sub-grid root, peer band, conflict band, the cell's family class, the grid a11y label, the "— you asked for medium" clause, the UI-13 whisper, the laminate's mini-grid. **9 reads, all four fields.** `ThermoBoard.vue:83-146` wrote all nine by hand. |
| **clues** | `BoardHost.vue:218` (the `#overlay` gate) · `:222` (`overlay`) · `:140` (`props`) — **the value the seam is propped WITH is not yet bound; see `20-barrier.md` §2** | thermo is the first game whose `clues` is non-null, so it is the first to reach the gap F1's `null` proof game could not surface. The overlay branch fires and mounts `ThermoTube`; `props(undefined, dim)` is what the missing `GameShell` binding costs. `spec.test.ts` proves the seam whole in isolation. |
| **furniture** | `BoardHost.vue:186` — `:is="spec.furniture.cell"` | the component `#cells` mounts, ×`totalCells`. |
| **solver** | `GameShell.vue:73` — `props.spec.solver.prewarm()` | the cold-start warm on the first idle tick. `solver.nodeBudget` is read by the spec's own model factory (`useThermo` → `useGameState`), so the budget table has ONE home; F3's `createSolverClient` moves that read into the shell. Same honest gap F1 recorded for sudoku. |
| **urlCodec** | `cards.ts` — the thermo row's `persistKey` and `spec.urlCodec.key` are pinned EQUAL by `cards.test.ts:82` | a lazy row cannot NAME its spec's key without dragging the spec into the main chunk, so the row spells it and the test forbids drift. Inside the game there is one source: `composables/thermoUrlState.STORAGE_KEY`, which `spec.ts:57` reads. |
| **poster** | `cards.ts:162` → `GameGallery` | the card's separate lazy chunk — unmoved. |
| **deal** | `GameShell.vue:60` (`options`) · `cards.ts:159` (`sizes`, via `sudokuSizes`) · `cards.ts:160` (`difficulty`, via `sudokuStaging`) | the control sections, the picker's range sub-line, the picker's staging chips. |

**Count.** 8/8 slots declared · 7/8 fully read · **17 distinct read expressions** on the thermo
row · shell-side (`GameShell` + `BoardHost`) **14**, table-side (`cards.ts`) **3**.

## Against the gate

`gates.json` W2 `registryFiction.productionSlotReads: 25` is a **floor over five games**;
wave-open §1.4(4) enumerates **40** and leaves the lead the call. Thermo banks **8 slots / 17
expressions**, at or above its share of either figure — the same shape F1 banked for sudoku.

## The two honest gaps, named rather than papered

1. **`clues`' value.** The seam is complete and proved (`spec.test.ts` mounts `clues.overlay`
   with `clues.props`' own output and gets one `g.thermo-tube` per thermometer); the LIVE clue
   does not reach it because `GameShell` binds no `:clue` and `ClueSeam` carries no member that
   names the model field. Shared, identical for all four clued games, fenced from this lane —
   `20-barrier.md` §2 carries the amendment request and its patch.
2. **`solver.nodeBudget`.** Read by the spec's own model factory, not the shell. Recording it as
   a shell read would fabricate a census row; recording it as unread would deny a live consumer.
   It is a **spec-internal read**, as F1 named it for sudoku, and 2.2/F3 collects it.

## One behaviour thermo GAINS, disclosed

`ThermoGame.vue` never prewarmed — `thermo/solver/useSolver.ts` did not export `prewarm` at all
(a NOTE at `:46-49` said the verb would be "re-added when that scene lands"). `GameShell` warms
every game's Worker on the first idle tick, so thermo now gets the cold start sudoku and
futoshiki always had. This is the slot's contract, not a per-game choice, and it is one idle
worker spin-up on select. No pixel, no new timing constant.

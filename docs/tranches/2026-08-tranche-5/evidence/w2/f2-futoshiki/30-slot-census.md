# T5-W2 F2 — THE SLOT-READ CENSUS, FUTOSHIKI

The gate (wave-open 2.1b): *every slot exercised by construction, not by convention.*

At HEAD futoshiki read **one** slot — `FutoshikiGame.vue:37` called `futoshikiGame.options(futoshiki)`,
and the other four its `game.ts` declared (`model`, `cellFurniture`, `clueFurniture`,
`solverPayloads`) had zero production consumers between them.

At F2 futoshiki reads **6 of 8** through the shell and the table, with two slots read
**spec-internally** for a measured reason and one of the six **blocked on a shared-surface
row this lane is fenced from** (§Amendments). Every line below is cited to the file it was
read on, this tree.

| Slot | Read at | What the read does |
|---|---|---|
| **model** | `GameShell.vue:56` — `props.spec.model()` | the one instantiation, at mount. |
| **grammar** | `BoardHost.vue:47` (bind) · `:66`, `:89`, `:101` (`geometry`) · `:76` (`requestVoice`) · `:80` (`noun`) · `:132` (`gradeHint`) · `GameShell.vue:136` (`geometry`) | `latin` picks the plain-Latin peer band and the no-box sub-grid root; `requestVoice:false` is what drops the difficulty word from the grid label AND the "you asked for" clause from the margin — one axis, where the board adapter spelled the two separately; `gradeHint:false` withholds the UI-13 whisper. **8 reads, all four fields.** |
| **clues** | `BoardHost.vue:218` (the `#overlay` gate) · `:222` (`overlay`) · `:140` (`props`) | futoshiki is the FIRST game to fill the seam sudoku states as `null`. The overlay mounts and the seam's `props` is called — but the CLUE VALUE it is called with is `undefined`, because no shell hands it. **Amendment 1.** |
| **furniture** | `BoardHost.vue:186` — `:is="spec.furniture.cell"` | `DigitCell` ×`totalCells`, taking `geometry="latin"` off the grammar — which is exactly the `.futoshiki-cell` family class the estate's ~120 e2e assertions and `index.css:699`'s focus ring key on. |
| **solver** | `GameShell.vue:73` — `props.spec.solver.prewarm()` | the cold-start warm on the first idle tick, where the deleted scene did it by importing its own `solver/useSolver`. `solver.nodeBudget` is read by the spec's own model factory (`spec.ts:51 → useFutoshiki → useGameState`), so the budget table has ONE home; F3's `createSolverClient` moves that read into the shell. |
| **urlCodec** | **spec-internal** — `spec.ts:52` binds `STORAGE_KEY` off `composables/useUrlState.ts:17`, which is the module that writes the board | one string, one source: the spec NAMES the codec's own constant rather than mirroring it. The card row spells the literal instead of reading the spec, and that asymmetry is chunking, not sloppiness (below). Its shell read (`createBoardPersistence`) arrives with the one persistence at 2.2. |
| **poster** | `cards.ts` row → `GameGallery`, which App hands `GAMES` (`App.vue:40`) | the separate lazy chunk — the gallery draws five thumbnails without loading five specs. |
| **deal** | `GameShell.vue:60` (`options`) · `spec.ts:54`,`:55` (`sizes`/`difficulty` into the sections) · the card names the same two bands off `ControlPanel/constants` | the control sections, the picker's range sub-line, the picker's staging chips. |

**Count.** 8/8 slots carry a value · **6/8** read by the shell or the table · **16 distinct
read expressions** on the futoshiki row, enumerated: model 1 · grammar 8 · clues 3 ·
furniture 1 · solver 1 · deal 1 = **15 shell-side** (`GameShell` + `BoardHost`), poster 1 =
**1 table-side**. The card's band references are NOT counted: it names
`ControlPanel/constants`' own exports, not the spec's `deal` slot (see gap 1).

## The two honest gaps, and why neither is papered

**1 · `urlCodec.key` and `deal.sizes`/`deal.difficulty` are not read off the spec by the card.**
Sudoku's row can name `sudokuSpec.urlCodec.key` because sudoku's spec is already in the main
chunk (it is the eager game). Futoshiki's is a LAZY chunk, and the staging ledger's cold-start
backfill reads five board keys and the picker draws five sub-lines *before any game is
selected* — so reaching into futoshiki's spec (or its codec module) from the table would drag
the lazy chunk into the main one to read two strings. The card therefore spells the key and
names the bands' own constants, which is the same measured reason `poster` sits on the card
row rather than in the spec body (wave-open §1.4.2). It resolves for all five at 2.2, when the
one `persistence.ts` owns the keys. The killer lane reached this conclusion independently and
`cards.test.ts` now pins the invariant that actually matters —
`spec.urlCodec.key === card.persistKey`, so the two can never drift.

**2 · `solver.nodeBudget` is read by the spec's own model factory, not by the shell.** F1
recorded this for sudoku and it holds identically here. Recording it as a shell read would be
a fabricated census row; recording it as unread would deny a live consumer. It is
**spec-internal**, and 2.2/F3 collects it when the one solver client lands.

## Amendments this lane REQUESTS of the fixed table (the lead's call, per the wave's law)

F1 raised the first of these ahead of time ("BoardHost's clue-conflict seam is F2's first
amendment request"). All three are outside this lane's fence — `games/shared` is frozen to
F2 — so they are banked, not taken. **All four F2 lanes need №1; futoshiki alone needs №2
and №3.**

### 1 · The clue VALUE never reaches `BoardHost`

`BoardHost.vue:37` declares `clue?: unknown` and `:140` calls `spec.clues.props(props.clue, dim)`.
`GameShell.vue:145-153` mounts `BoardHost` with `:spec`, `:model` and `:leaving` — and **no
`:clue`**. Sudoku's seam is `null`, so F1 shipped green without noticing; every game that
fills the seam gets `undefined`.

The clue is a LIVE model value (`useFutoshiki().inequalities`, the twin of thermo's `thermos`,
killer's/kenken's `cages`), and `GameModel` (`defineGame.ts:48-93`) has no slot for it. The
smallest sound cure is one read contract slot plus one bind:

```ts
// defineGame.ts — GameModel gains the one furniture ref every clue game already holds
clue?: ReadRef<unknown>;
```
```vue
<!-- GameShell.vue — the shell hands the seam its own value -->
<BoardHost … :clue="model.clue?.value" />
```

with each clue game re-labelling its furniture ref to `clue` in its composable's return (a
one-line change inside each game's own dir, which the F2 lanes can take once the slot exists).
**This lane did NOT reach for a workaround** — no module-scoped "last mounted model", no
`provide`/`inject` side channel around the declared parameter. `spec.ts`'s `props` is written
straight against the contract and will throw loudly if handed nothing, which is 2.4's
FAIL-EXPLICIT law applied to the shell's own hole.

### 2 · `BoardHost` has no conflict `extra`

`BoardHost.vue:88-91` builds `conflictsFn` as boxed→`subgridSize` / latin→plain, and never
passes `findConflicts`' third arm. `Adjacency.extra` exists (`conflicts.ts:30`) and is
documented as *"Futoshiki's printed `>`/`<` clues"* — the one game it was written for is the
one game that now can't reach it. Without it a violated inequality is no longer circled in the
teacher's red.

Banked ready: `clue.ts`'s `inequalityViolations(inequalities)` returns exactly
`NonNullable<Adjacency["extra"]>`, so the cure is `findConflicts(values, n, { extra })` with
the extra sourced off the seam — a fifth `ClueSeam` field (`conflicts?`) or a second return
key from `props`.

### 3 · `BoardHost` never binds `constraint-label`

`DigitCell.vue:56` declares `constraintLabel` (default `""`) and feeds it to
`useGameCell`'s `ariaSuffix` — the seam by which a clue folds into the two cells it touches.
`BoardHost.vue:184-215` binds twenty-odd props into `#cells` and **not that one**. Futoshiki's
carets are `aria-hidden` precisely because the constraint is supposed to be read on the cells;
unbound, the clue becomes invisible to AT entirely.

This is an **AX-baseline row**, not a nicety: wave-open §3 holds W2 to the AX-tree PRE-state —
"W2 does not *improve* a11y; it must not silently cost any."

Banked ready: `clue.ts`'s `constraintLabels(inequalities, dim)` returns the same
`Map<number, string>` the dead board adapter built, asserted in `clue.test.ts`.

**Until all three land, futoshiki's board renders without carets, without inequality conflict
marks, and without its clue a11y clauses — and `spec.clues.props` throws on mount.** That is an
interim of this workflow's own sequence, and it must be gone before F3's π gate, which is the
first gate that would see it.

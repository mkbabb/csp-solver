# E9 · R1 — the in-tree census (undo spine + destructive-action inventory)

Lane R1 of the E9 triumvirate. Baseline of record: last sealed commit `7e03c5dc`
(T4-W7 addendum). Live-tree warning honored: W8 (marks/modes) is mutating
`web/frontend` concurrently — files re-read mid-census changed under me
(`useFutoshiki.ts` grew its `useUserMarks` import between my Read and a later grep).
Every anchor below is tagged **[committed]** (git show HEAD) or **[in-flight]**
(working tree, uncommitted W8).

No source was edited. This file is the only write.

---

## 1 · THE UNDO TODAY — one shared delta machine, cell-values only

- **The machine** `web/frontend/src/games/shared/useUndoHistory.ts` **[committed]** —
  a single shared composable, D16 twin for both games. State: `undoStack:
  {pos,prev,next}[]` + an `undoIndex` pointer (`:24-25`). `UNDO_CAP = 128` (`:16`) —
  within the owner's 100–200 band but below its ceiling. **Already delta/pointer-based,
  NOT snapshot-based**: it records a per-cell `prev→next` triple, never a board. The
  owner's "don't store raw boards, pointers not boards" instinct is *partly already
  met* for value edits.
- **What it covers**: ONLY user cell-value writes. `setCell(pos,value)` is the sole
  recorder — `useSudoku.ts:176-180` / `useFutoshiki.ts:173-177` **[committed]**:
  `applyCellValue(...)` then `recordEdit(pos, prev, value)`. `recordEdit` no-ops when
  `prev===next` (`useUndoHistory.ts:29`).
- **What it does NOT cover** (blast surface for owner's "ALL user actions"): user
  pencil marks (W8, §6), erase-board, randomize, size-swap, difficulty, solve-fill,
  hint/reveal ink. Solve/reveal are *deliberately* not recorded (`inkReveal` comment
  `useSudoku.ts:311-312`: "NOT recorded on the undo stack"). Consequence: **undo cannot
  remove solver-filled or hint-revealed cells** — they persist through an undo (they were
  never stack entries), while the pre-solve user edits below them do rewind. An
  inconsistency the harden lane must rule on.
- **Depth bound**: fixed 128, FIFO drop of the oldest (`undoStack.shift()` at
  `:31`) — history is bounded but not deduped or indirected beyond the delta form.
- **Redo fork**: a fresh edit past a rewound pointer truncates the redo tail
  (`splice(undoIndex)`, `:28`) — standard linear-history semantics.
- **Race posture**: the machine is fully synchronous (single-threaded JS) — no locks,
  none needed *inside* it. The real interleave surface is async board-replacement vs a
  synchronous undo:
  - **Coarse undo/redo buttons are gated** by `:disabled="loading"`
    (`ControlPanel.vue:378-395` **[committed]**) — inert during solve/randomize.
  - **Keyboard ⌘Z / ⇧⌘Z is NOT gated** — `SudokuBoard.vue:334-345` **[committed]**
    emits undo/redo with no `loading` check (grep for `props.loading` in SudokuBoard:
    zero hits). So a keydown-undo *can* fire mid-`await` of solve/randomize.
    - mid-randomize `await getRandomBoard`: `values` still old → undo writes the old
      board, then the deal overwrites all cells + `clearUndo()` (`useSudoku.ts:213`)
      wipes the stack → undo effect silently lost, **no corruption**.
    - mid-solve `await solveBoard`: undo may set a cell to `prev`; the result merge is
      `if (values.value[pos]===0)` (`useSudoku.ts:247`) → solver fills it → benign
      resolution to the solver value, **no corruption** but a surprising interleave.
    - So: race-*safe* against corruption today, but not race-*clean* — the keyboard
      path bypasses the loading gate the buttons honor. KISS harden = gate the keyboard
      undo on `loading` too (or a generation guard).
- **The ≥44px affordance seam** (WM): `ControlPanel.vue` play-tools row `:377-405`
  (mobile) / `:531-559` (desktop) + CSS `.play-controls` `:724-736` **[committed]** —
  coarse-only (`@media (pointer: coarse)`), `.icon-btn` 2.75rem floor. Buttons emit
  `undo`/`redo` (`onUndo`/`onRedo`, `:219-224`) → `SudokuGame.vue:170-171` /
  `FutoshikiGame.vue:158-159` → `composable.undo()/redo()`. Futoshiki ControlPanel is a
  byte-twin (same `onUndo`/`onRedo`/`play-controls`, confirmed `:213-216`,`:368`,`:521`).

## 2 · THE DESTRUCTIVE INVENTORY — one guard exists (Clear, coarse-only), everything else bare

Every action that destroys board or history state, its trigger, current guard, blast radius:

| action | trigger surface | current guard | blast radius |
|---|---|---|---|
| **Clear/erase-board** | ControlPanel Eraser btn → `@clear` → `clearBoard()` | **the only guard** — two-tap arm/confirm, **coarse-only** (§ below) | blanks all cells + all bookkeeping sets + `clearUndo()` + `clearPersistedBoard()` + `dropBoardParam()` (`useSudoku.ts:130-148`). Futoshiki keeps inequalities (`useFutoshiki.ts:141-142`). **Wipes undo history.** |
| **Randomize/new-board** | Dice btn → `@randomize` → `randomize()` | **NONE** — `onRandomize` just `triggerRandomize()`+`emit` (`ControlPanel.vue:181-184`) | replaces `values`, all given sets, regrades, `clearUndo()` (`:213`), `dropBoardParam()`. Full board loss, no take-back. **The owner's headline hazard.** |
| **Board-size change** | OptionSelector → `@update:size`/`@update:board-size` → sets `size`/`boardSize` ref | **NONE** | `watch(size)` → `clearPersistedBoard()+initBoard()+randomize()` (`useSudoku.ts:451-455`; `useFutoshiki.ts:432-437`). **LIVE re-deal**, immediate, destructive, unguarded. |
| **Difficulty change** | OptionSelector → `@update:difficulty` → sets `difficulty` ref (`SudokuGame.vue:166`) | n/a | **NOT destructive today** — see §4. No watcher re-deals on it; picked up by the *next* Randomize. Already "next-game" arming in code, just not labeled so in the UI. |
| **Solve** | Solve btn / desktop key → `solve()` | NONE | fills every empty cell with solver ink (`useSudoku.ts:246-252`). Destructive to a blank board's blankness but reversible-ish: it only writes `===0` cells, and those cells are NOT on the undo stack (§1) — so **undo won't clear them**. |
| **Fill-forced / hint reveal (W7)** | H key / Hint btn → `hintCell` → `inkReveal` | NONE | inks one cell; not recorded on undo stack (`:311-312`). Low blast (single cell) but irreversible via undo. |
| **Permalink navigation** (`?board=`, `?size=`, `?game=`) | address bar / shared link → `resolveInitialState` at mount | fail-closed decode only (corrupt link → fresh deal, `useUrlState.ts` `decodeBoardParam`) | replaces the whole initial board; a *reload* on a stale `?board=` reproduces the shared board over storage (URL-wins). Not a button, but a state-destroyer. |
| **Theme toggle** | DarkModeToggle | n/a | **non-destructive** to board — visual only. Exclude. |

- **The Clear-confirm precedent (in-house confirmation mechanism to reuse)** —
  `ControlPanel.vue:186-210` **[committed]**, `onClear()`: `isCoarse.value && !clearArmed`
  → first tap sets `clearArmed=true`, arms a **2.5 s** `clearArmTimer` that disarms
  quietly; second tap inside the window clears. **Fine pointers keep one-click** (no
  confirm). No dialog machinery — it rides the transient-sublabel grammar: the label
  flips `Clear`→`sure?` in `--color-crayon-rose` (`:340-345`, `.is-armed` `:672-675`),
  aria-label flips to "Tap again to clear board" (`:335`). E2e pins it:
  `mobile-affordances.spec.ts:268-334` ("armed ≠ cleared", 2.5s window, re-arm on
  lapse). **This is the pattern the harden lane should generalize to Randomize +
  size-swap** (the owner's "conditional confirmation once data is input"). Note its gap:
  it's coarse-only and there is no *dirty* condition — it arms even on a blank board.

## 3 · DIRTY-STATE TRUTH — no derivation exists today

- **There is no `isDirty`/`pristine`/`hasUserInput` computed anywhere** in
  `web/frontend/src/games` (grep: only prose "pristine given" comments, no state).
  The Clear confirm fires unconditionally (not gated on "data input") — so the owner's
  "*after input of data*… confirmation" precondition is un-modeled today.
- **Where a dirty guard would read from** (all **[committed]** refs on each composable):
  the cleanest signal is the **undo stack non-empty** — `undoStack.length > 0` (an edit
  was made) — but it's not exported (only `undo`/`redo` are). Alternatives already on the
  surface: any non-zero cell not in `originalGivenCells` (a user write), `overriddenCells.size
  > 0` (a given was edited over), or `solvedValues` non-empty (solved). The e2e proxy for
  "board has content" is `.glyph-svg` count (`mobile-affordances.spec.ts:291`). Harden
  lane recommendation: expose an `isDirty`/`hasUserInput` computed (undo-depth OR
  overridden OR user-nonzero-cell), thread it as the confirm precondition.

## 4 · CONTROL SEMANTICS — size is LIVE, difficulty is already NEXT-GAME (both games)

- **Size (Sudoku `size` 2/3/4 → board 4/9/16; Futoshiki `boardSize` 4/5/6/7)**: LIVE
  re-deal. `watch(size, …)` (`useSudoku.ts:451-455`) / `watch(boardSize, …)`
  (`useFutoshiki.ts:432-437`) → clear + init + `randomize()` **immediately** on change.
  Destructive, unguarded. **[committed]**
- **Difficulty**: `@update:difficulty` sets the ref only (`SudokuGame.vue:166`,
  `FutoshikiGame.vue:154`). Sudoku's `watch([size,difficulty])` writes URL *only*
  (`useSudoku.ts:446-448`) — the *re-deal* watcher is `watch(size)` alone. **Difficulty
  changes do NOT re-deal**; the new value is consumed by the next `randomize()`
  (`api.getRandomBoard(size, difficulty)` `:191`). So in code it is *already* next-game
  arming — directly answering the owner's open question "should the difficulty button
  read as next-game": **it already behaves that way; only the UI framing lies.** This is
  the evidence for a "bake a game" staging surface: size + difficulty are both *inputs to
  the next deal*, except size *also* fires the deal as a side effect. Harden proposal
  seam: make size ALSO next-game (arm, don't re-deal) → size+difficulty become one
  staging pair, and Randomize/"Bake" is the single destructive commit → one confirm
  covers both.
- **Sudoku ↔ Futoshiki asymmetry (W6 residue)**: Sudoku persists difficulty to
  `?difficulty=`/localStorage (`useUrlState.ts` `VALID_DIFFICULTIES`, `PersistedBoard.difficulty`).
  **Futoshiki difficulty is runtime-only** — `useFutoshiki.ts:53-57` **[committed]**:
  "NOT yet threaded through `?difficulty=`/localStorage… resets to default each mount."
  Its `PersistedBoard` has no `difficulty` field (`futoshiki/useUrlState.ts:30-39`). Any
  undo/staging design that touches difficulty must reconcile this — futoshiki difficulty
  survives nothing today.

## 5 · STATE SHAPE + SIZE ARITHMETIC — deltas are ~KBs, raw snapshots are ~MBs at 16×16

- **Board state shape** (per composable, **[committed]** except marks): `values:
  Record<string,number>` (`totalCells` keys, `0`=empty); three `Set<string>`
  (`givenCells`, `originalGivenCells`, `overriddenCells`); `solvedValues:
  Record<string,number>`; `animatingCells: Set<string>`; `boardGeneration: number`;
  Futoshiki adds `inequalities: Inequality[]` (`[number,number][]`). W8 adds two mark
  stores **[in-flight]** (§6): `cornerMarks`/`centerMarks: Record<string, number[]>`.
- **`PersistedBoard` (the localStorage/URL snapshot shape)** — `useUrlState.ts:17-26`
  (sudoku) / `:30-39` (futoshiki). This is the honest "full snapshot" unit.
- **Measured bytes (JSON.stringify of a representative PersistedBoard)**:
  - sudoku **9×9 ≈ 959 B**; sudoku **16×16 ≈ 3034 B** (~3 KB); futoshiki **7×7 ≈ 712 B**.
    (16×16 = 256 cells is the max sudoku; futoshiki max is 7×7 = 49 cells.)
  - one `{pos,prev,next}` **delta ≈ 28 B** JSON (~40–80 B live heap w/ object overhead).
  - worst-case full `centerMarks` (16×16, every cell all 16 candidates) **≈ 11.9 KB**.
- **The sizing verdict for the algorithmics lane (200-entry honesty)**:
  - **Raw-snapshot history** (naïve): 200 × 3 KB ≈ **~600 KB** JSON at 16×16 (live heap
    materially larger with Set/object overhead). This is exactly what the owner says to
    avoid.
  - **Delta history** (today's machine, extended): 200 × ~50 B ≈ **~10 KB**. Two+
    orders of magnitude cheaper. The owner's "pointers/dedup/trie" is over-engineering
    *for value edits alone* — the delta already wins; the trie/tree only earns its keep
    once *marks* and *board-swaps* enter history (a board-swap can't be a cheap cell
    delta — it's a whole-board diff), where structural sharing / a pointer-to-prior-board
    genuinely saves. Recommend: keep value edits as deltas, model board-swaps as a
    tagged "snapshot" node holding a *reference* (generation id) into a small deduped
    board pool, not inline copies.

## 6 · WHAT W8 IS LANDING RIGHT NOW — a separate user-mark store, uncovered by undo (the seam)

- **New, untracked [in-flight]**: `web/frontend/src/games/shared/useUserMarks.ts`
  (+`.test.ts`, +`PencilModeToggle.vue`). Wired into BOTH composables in the working
  tree (git diff HEAD): `useSudoku.ts` import + `useUserMarks(boardGeneration)` block +
  6 exports (`+22` lines); `useFutoshiki.ts` twin (`+21`). **These are uncommitted W8
  edits sitting on top of sealed `7e03c5dc`.**
- **Shape**: `pencilMode: 'off'|'corner'|'center'` (Snyder, one surface two slots);
  `cornerMarks`/`centerMarks: Record<string, number[]>` (sorted candidate digits).
  Authoring seam: `toggleUserMark(pos, value)` — a no-op while mode is `off`; `value===0`
  erases both slots at the cell (`useUserMarks.ts:88-96`). A fresh board (`boardGeneration`
  bump on clear/randomize/size-swap) voids all notes; the mode survives
  (`watch(boardGeneration) → clearUserMarks()`, `:100`).
- **Deliberately its own store**, disjoint from engine `usePencilMarks` (peek-gated
  solver domains) — `useUserMarks.ts` header + the collision test pin it.
- **THE SEAM for the owner's "undo robust to ALL user actions"**:
  `toggleUserMark` is the single authoring entry — but it is **NOT threaded through
  `useUndoHistory`**: no `recordEdit` call, and the current undo machine's replay
  primitive is `applyCellValue` (a *value* writer), which knows nothing about mark slots.
  So today a mark toggle is invisible to undo. To honor "ALL user actions," the harden
  lane must either (a) generalize the history entry from `{pos,prev,next}` (value delta)
  to a tagged union `{kind:'value'|'corner'|'center'|'erase'|'board', …}` with a
  matching replay dispatcher, or (b) run a second parallel mark-history. Option (a) is
  the KISS/single-spine path and matches the owner's "trie/tree of edits" — one ordered
  edit log, heterogeneous nodes, one replay switch. The clean insertion point is
  `useUserMarks.toggleUserMark` ↔ `useUndoHistory.recordEdit`, mirroring how `setCell`
  already pairs `applyCellValue` + `recordEdit`.

---

### One-line answers to the owner's four named questions (evidence-backed)
1. **Does difficulty need an undo?** No standalone undo — it's already non-destructive
   next-game arming in code (§4); it needs *labeling*, not history.
2. **Should difficulty read as next-game?** It already IS next-game; only the UI implies
   live. Relabel.
3. **Bake-a-game staging surface?** Justified: size is the *only* live-destructive
   control among the size/difficulty pair (§4). Make size arm-not-deal → size+difficulty
   = staging inputs, Randomize/"Bake" = the single guarded commit.
4. **Trie/tree for edits?** Over-kill for value edits (deltas already ~28 B, §5);
   earns its keep only once marks + board-swaps join history as heterogeneous nodes with
   a deduped board pool.

# T4-WU · U1 — the history spine + race discipline (spec ROWs 1–2)

Lane U1 of workflow T4-WU. Base = the {W8, W9} sealed HEAD **`df013a36`** (verified
`git rev-parse HEAD`). Port 4388. DO-NOT-COMMIT honored — the tree is additive, HEAD
unmoved. Every anchor was re-located at HEAD before editing (W8 had moved things off the
spec's `ae2517c2` line numbers).

## Files touched (10 — all in-scope, none of U2's)

- `web/frontend/src/games/shared/useUndoHistory.ts` — the spine: tagged union log + replay
  dispatcher + content-hash board pool (rewritten from the `{pos,prev,next}[]` machine).
- `web/frontend/src/games/shared/useUndoHistory.test.ts` — 16 spine tests (the π).
- `web/frontend/src/games/shared/useUserMarks.ts` — `setMarkSlot`, `setUserMarks`, the
  `restoring` flag + its void-watch suppression (the restore-order seam).
- `web/frontend/src/games/shared/useUserMarks.test.ts` — +3 restore-seam tests.
- `web/frontend/src/games/sudoku/composables/useSudoku.ts` — history wiring, marks seam,
  hint-ink record, epoch parity, board entries (deal/clear/solve), restore-order.
- `web/frontend/src/games/futoshiki/composables/useFutoshiki.ts` — D16 twin (+ inequalities
  in the board blob).
- `web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue` +
  `web/frontend/src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` — `loading` prop +
  the keyboard-Z refuse guard.
- `web/frontend/src/games/sudoku/SudokuGame.vue` +
  `web/frontend/src/games/futoshiki/FutoshikiGame.vue` — `:loading` wired to each board.

NOT touched (U2's row): both `ControlPanel.vue`, `useUrlState.ts`, `watch(size)` staging.

## Born-RED proofs (each defect PROVEN live at base `df013a36`)

1. **marks undo — `toggleUserMark` bypassed history.**
   `grep -nE "recordEdit|record|undo" src/games/shared/useUserMarks.ts` → **zero hits**. The
   sole authoring seam never touched the log.
2. **board undo — randomize/clear called `clearUndo`, solve recorded nothing.**
   `grep -nE "recordEdit|recordBoard|clearUndo|NOT recorded" src/games/sudoku/composables/useSudoku.ts`
   → `recordEdit` ONLY at `setCell:196`; `clearUndo()` inside `randomize` (`:231`),
   `clearBoard` (`:161`), `restoreBoard` (`:468`); `inkReveal` "NOT recorded" (`:329`); `solve`
   (248–300) had no recorder. A deal/clear WIPED the timeline; solve left it under the ink.
3. **race — keyboard Cmd/Ctrl+Z ungated during `loading`.**
   `grep -n loading src/games/sudoku/SudokuBoard/SudokuBoard.vue` → **zero hits** (no prop, no
   guard); the `z/Z` case (`:416-422`) emitted undo/redo unconditionally. Futoshiki twin
   identical (`FutoshikiBoard.vue`, zero `loading` hits). Buttons were `:disabled="loading"`;
   the keyboard was the one open seam.
4. **epoch parity — sudoku `randomize()` never bumped `boardGeneration`.**
   `grep -nE "boardGeneration|clearUndo" src/games/sudoku/composables/useSudoku.ts` → bump at
   `initBoard:135`, `clearBoard:162`, `restoreBoard:461` only — **absent from `randomize`
   (199–246)**. Futoshiki DID bump in randomize (`useFutoshiki.ts:232`). Two overlapping sudoku
   deals shared a gen; the marks-void watch fired for futoshiki randomize but not sudoku's; the
   peek cache (`:308/:323`, keyed on gen) could return the prior board's solution.

## What landed (spec ROWs 1–2)

- **Tagged union log + dispatcher** (`value` | `mark` | `board`), one `pushEntry`
  (fork-truncate → append → FIFO-evict), one `replayUndo`/`replayRedo` switch.
- **Content-hash-deduped pool** — `Map<hash, {blob, refs}>`, FNV-1a×2 64-bit digest; refcount
  retain/release; a blob GCs the instant its last ref drops; `clearUndo` GCs the whole pool.
- **Cap = 200** (one constant, from `UNDO_CAP=128`). Session-only, in-memory — **the timeline
  does NOT survive reload**; the persisted unit stays the single-board localStorage snapshot +
  the `?board=` permalink (URL-wins on reload). Named, not silent.
- **Redo-of-deal is deterministic via the stored `nextRef` snapshot** — no seed (getRandomBoard
  seeds internally with `Date.now()`); the solver signature is untouched.
- **Hint ink enters history** — `inkReveal` records a `value` entry `tone:'solved'`; undo
  strips the `solvedValues` membership (`removeHintInk`, no `overridden` residue), redo re-inks
  (`applyHintInk`). **Owner-taste flag B5** (reverses "a reveal is not a user edit").
- **Epoch parity** — sudoku `randomize` now bumps `boardGeneration` (futoshiki already did);
  both games' async ops capture gen at dispatch and `if (boardGeneration.value !== dispatchGen)
  return;` on resolve — a stale/superseded generate/solve applies nothing and records nothing.
- **Single-writer + push-after-resolve** — the composable is the sole author; board entries
  push only after a successful resolve, never before.
- **Refuse-while-pending** — undo/redo no-op at the composable choke point (`effects.pending →
  loading.value`) AND at both boards' keydown (`if (props.loading) break;`).
- **Restore-order** — a board undo/redo runs `restoreBoardState`: raise `restoring`, restore
  board + marks, bump gen, lower `restoring` next tick. The void-watch (`useUserMarks`) no-ops
  for exactly that gen bump, so the restored marks survive.

### Two deliberate spec-shape deviations (correctness over letter, flagged)

- **Board entry carries BOTH `prevMarksRef` and `nextMarksRef`** (spec named a single
  `marksRef`). Needed because **solve preserves marks** (mutate-in-place, no gen bump) while
  deal/clear void them — a single marks ref can't serve undo (prev) and redo (next) correctly
  for solve. Empty-marks dedupe to one pool slot, so the extra ref is free.
- **Solve does NOT bump `boardGeneration`** (deal/clear/resize do). Solve is board-*mutating*,
  not board-*replacing*: keeping the gen preserves the celebration crest (`SudokuBoard`
  `resetMurmur` watch) and lets marks survive under the filled cells. The epoch parity fix
  targets randomize (the born-RED); solve still captures+drops on the epoch for staleness.

## Memory arithmetic (measured, BANKED — not asserted)

`node measure-u1.mjs`, JSON byte footprints of the real shapes:

| unit | bytes |
|---|---|
| value delta entry | 43 B |
| hint-ink value entry | 59 B |
| mark delta entry | 63 B |
| **board pointer node** (5 refs + op, holds NO board) | **154 B** |
| sudoku 9×9 pooled blob | 901 B |
| sudoku 16×16 pooled blob | 2918 B |
| futoshiki 7×7 pooled blob (+ inequalities) | 655 B |
| empty-marks blob (one shared slot, all deals) | 25 B |

| 200-entry ceiling | KB |
|---|---|
| 200 value deltas | 8.4 KB |
| 200 board nodes (+ deduped pool) | 30.1 KB |
| **200 RAW 16×16 inline snapshots** (owner's FORBIDDEN case) | **569.9 KB** |

- **Realistic session** (~180 value/mark entries + ~20 distinct 9×9 deals): log 10.6 KB +
  pool 17.6 KB = **~28 KB total**.
- **Worst realistic** (40 distinct 16×16 deals pooled): **~114 KB**.

Verdict: the delta-log + hash-pool is ~2 orders under the raw-snapshot ring the owner
forbade; well within the <200 KB budget; **no HAMT/trie** — the diff is a tagged union +
dispatcher + refcounted pool over the existing shape (KISS audit passes).

## Battery + e2e (all vs the built dist, my port 4388)

- `vue-tsc -b --force` → **exit 0**.
- `npm run test:unit` → **256 passed / 21 files** (16 new spine + 3 new restore-seam +
  1 DELTA-probe sequence over the pre-existing suite).
- `lint:eslint` → clean. `lint:knip` → clean. `prettier --check src/` → clean.
- `npm run build` → built (index 191.96 kB / gzip 69.17 kB).
- **e2e default suite** (`PLAYWRIGHT_BASE_URL=http://localhost:4388 npx playwright test`) →
  **61 passed** (incl. `affordances.spec.ts:229` undo Ctrl/Shift/Meta-Z, size-switching,
  solve→edit→revert). NO size-switch reds — size was left a clean off-log reset (U2 stages it),
  so nothing in U2's territory regressed. `:3000`/`:3001` owner listeners untouched; `:4388`
  killed after.

Race gate proof: the born-RED "keyboard undo during a pending generate must no-op" is proven
at the unit level (`useUndoHistory.test.ts` refuse-while-pending) and closed at both seams
(composable `pending` + board keydown guard).

## Flags (for the orchestrator)

- **B5 (owner-taste) — hint ink in history.** Reveals now undo, stripping the solver tone.
  The "flourish re-arm" is definitional here: the celebration gate is `solveState`-driven, not
  `solvedValues`-gated, so stripping the ink IS the re-arm — no separate gate code. If declined,
  `inkReveal` reverts to off-log (drop the two `recordHintInk`/`removeHintInk`/`applyHintInk`
  hooks) and the record says so.
- **Persistence named (not silent).** History is session-only, in-memory; the persisted unit
  stays the single-board snapshot + permalink. Reload resets the timeline by design.
- **Size-undo deferred to U2.** `watch(size)`/`watch(boardSize)` still live-re-deal via
  `initBoard` (which resets the timeline) with an off-log deal — a clean reset. Once U2 stages
  size behind the Deal button, size-undo falls out automatically (Deal → `randomize()` records).
- **fillForced (W8 fill button) sweep is NOT yet in history** — the spec deferred the `batch`
  entry ("IF a sweep ships"). It remains app-ink off-log, consistent with the pre-wave stance.
  A follow-up `{kind:'batch'}` entry would make it one-gesture-one-undo.
- **Grade tally reverts to the request voice on a board undo** (`restoreBoardState` calls
  `clearGrade`, matching the existing `restoreBoard` stance). Cosmetic, ungated; a grade field
  in the board blob would preserve it if desired.

## Batch entry — the triggered conditional (follow-up lane)

The spec's conditional fired: W8's Fill button drives W7's `fillAllForced`, so the deferred
`{kind:'batch'}` entry ships. One press = one gesture = one entry = one undo/redo.

**Born-RED (the sweep was app-ink off-log at the pre-batch tree):**
- `grep -rn "recordBatch\|kind:'batch'" src/` → **zero hits** (grep exit 1): no batch machinery
  existed.
- `awk '/function fillForced\(\)/,/^  }$/' … | grep -nE "record(Batch|Edit|HintInk|Board|Mark)"`
  → **zero hits** in BOTH composables (`useSudoku.ts`, `useFutoshiki.ts`): `fillForced` called no
  recorder. Pressing Fill then Cmd/Ctrl+Z rewound the action UNDERNEATH the fill, not the fill —
  the exact incoherence the flag named.

**The seam:**
- `useUndoHistory.ts` — `{kind:'batch'; deltas: BatchDelta[]}` added to the union; `recordBatch`
  recorder (filters no-op deltas, drops a zero-placement sweep — no empty entry); the dispatcher
  applies/inverts all deltas in ONE step (inverse order on undo, forward on redo). Each delta
  carries the fill's `tone:'solved'`, so undo strips the `solvedValues` membership through the
  SAME `removeHintInk` the single-cell hint path uses; redo re-inks through `applyHintInk`.
  **Delta-only — the board pool is untouched** (self-contained deltas, no ref retain/release).
- Both composables collect the placements `fillAllForced` actually made (`prev` read from the
  board, `next` the forced value) and `recordBatch(deltas)` AFTER the sweep resolves
  (single-writer, push-after-resolve). The existing `if (cellsToAnimate.size === 0) return;`
  guard means a Δ0 press never reaches the recorder.
- **Race discipline: N/A by construction.** `fillForcedSudoku`/`fillForcedFutoshiki` are pure
  synchronous TS (no worker, no `await`) — the sweep is atomic over the local board, so the
  capture-gen-at-dispatch/drop-on-mismatch machinery the async recorders need does not apply.
  Verified: neither `fillForced` awaits.

**Battery (all vs the built dist, port 4392; owner's :3000/:3001 untouched, :4392 killed after):**
- `vue-tsc -b --force` → **exit 0**.
- `npm run test:unit` → **271 passed / 21 files** (+4 batch spine tests: round-trip
  invert/re-apply in one step, per-delta plain-tone path, Δ0 records nothing, one sweep = ONE
  entry toward the 200 cap).
- `lint:eslint` → **exit 0**. `lint:knip` → **exit 0**. `prettier --check src/` → **exit 0**.
- `npm run build` → built (index 193.55 kB / gzip 69.60 kB).
- **e2e default suite** (`PLAYWRIGHT_BASE_URL=http://localhost:4392 npx playwright test`) →
  **63 passed** — incl. the new `affordances.spec.ts` "fill batch: one Fill sweep undoes as ONE
  gesture, redo re-fills" (the conflict board's blank row is uniquely forced → one Fill inks the
  whole row; one Ctrl+Z empties it, one Ctrl+Shift+Z re-fills). No goldens re-baselined; no e2e
  reformatted.

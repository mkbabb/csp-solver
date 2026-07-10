# crit-fe — REFUTE-by-default critique of the FE cluster (P2-L5, P2-L6)

**Lane:** `crit-fe` · PASS 2 · adversarial re-derivation. Targets: `P2-L5.md` (FE seam
closure) and `P2-L6.md` (W-F prototype). Every claim re-checked against the main tree at
HEAD `3b75eca2` (read-only) and, for P2-L6, the persisted worktree
`.claude/worktrees/wf_977ec162-15b-6`. No mutation to the main tree; the `:3000` server +
32-lane audit untouched. **Verdict: the cluster survives refutation nearly intact — 0 hard
REFUTED, 1 real unresolved inter-lane seam, 3 expensive gate outputs not independently
re-run (substrate verified, outputs PLAUSIBLE).**

---

## Claim ledger (15 load-bearing claims)

### P2-L5

**[1] R6(a) — `awaitTickBeforeActivate` is a NO-OP; delete the option. → CONFIRMED.**
Re-derived at the code level. The immediate watch is real:
`AnswerKeyLaminate.vue:60` `watch(() => props.active, …, { immediate: true })`, flag at
`:86`, comment `:84-85` (verified). Sudoku's shipped path is sync-set against an async
laminate — `App.vue:85-91` sets `peekTouched=true` then `peekActive=true` with **no
`nextTick`** (verified, `:90-91`), laminate `defineAsyncComponent` at `:14`. Futoshiki is
`FutoshikiGame.vue:34-36` (`peekTouched=true; await nextTick(); peekActive=true`) against a
**static** import (`:22`), stale rationale comment `:17-21` (all verified).
I attempted to construct a breaking race and could not:
- First peek, static, nextTick removed → both refs set in one tick → next flush mounts the
  (already-loaded) static component with `active===true` → immediate watch fires the true
  branch. **End-state identical to Sudoku's proven async path.**
- Subsequent peeks (`peekTouched` "stays true", `App.vue:82`) → no remount; the live watch
  reacts to the `false→true` ref change with or without `nextTick`. `nextTick` is
  superfluous here too.
- User-releases-before-async-resolve → component mounts `active===false` → else branch
  no-ops on an unheld hold. Unchanged by the edit.
The no-op proof holds across first and subsequent peeks. **Survives.**
*Minor CORRECTION (non-material):* the report's case-2 phrasing "spurious `setTimeout →
releaseHold` on a hold never acquired" (`P2-L5.md:36`) overstates — the else branch sets an
unmount timer that the immediately-following true branch **clears** (`AnswerKeyLaminate.vue:64-66`
`clearTimeout(unmountTimer)`), so `releaseHold` never actually executes. It's a wasted
watcher pass, not a stray `releaseHold`. Conclusion unaffected.

**[2] R6(b) — hoist `SolveState` + `SolveStats`. → CONFIRMED, byte-exact.**
`games/sudoku/types.ts:11` `export type SolveState = 'idle' | 'solving' | 'solved' |
'failed' | 'error'` ≡ `games/futoshiki/types.ts:16` (identical). `SolveStats` at
`sudoku/types.ts:16-20` ≡ `futoshiki/types.ts:21-25` (`{ backtracks; solutionCount;
elapsedMs? }`, identical). Line citations exact. Re-export plan (zero consumer churn, no
cycle) is sound — `games/shared/types.ts` would depend on nothing.

**[3] R6(c)/Q7 — three-homes rule; `celebration.ts` stays pencil. → CONFIRMED.**
Consumer census re-run: `celebration.ts` imports `mulberry32` from `@mkbabb/pencil-boil`
and `CELEBRATION` from `@pencil/config/pencilConfig` (`celebration.ts:18-19`, verified).
Consumers: **pencil** `HandwrittenGlyph.vue:10` (`registerMurmurCell`/`unregisterMurmurCell`)
+ both boards `SudokuBoard.vue:11` & `FutoshikiBoard.vue:23`
(`setMurmurSeed`/`notifyUserEdit`/`resetMurmur`) — all verified. A pencil consumer exists ⇒
aesthetic substrate ⇒ stays `pencil/composables/`. This correctly **contradicts** synthesis
§1.5.4's "move it to `src/composables/`" — the correction is warranted. `useTheme.ts`
consumers verified as app-global (both ControlPanels + pencil `HandwrittenLogo`,
`OptionSelector`, `DarkModeToggle`). eslint restricts **only** pencil→games
(`eslint.config.js:18-35`) + cross-game (`:47-53,70-78`); a new `src/games/shared/` matches
no rule ⇒ importable by both games, needs no eslint change. **Report's "no eslint change
required" is correct.**

**[4] R6(d) — `.board-cells` shared constant + board binding. → CONFIRMED.**
Producers `SudokuBoard.vue:372` and `FutoshikiBoard.vue:421` both `class="board-cells grid"`
(verified, neither has an existing `:class`). Consumers: `App.vue:124` +
`FutoshikiGame.vue:75` `t?.closest('.board-cells')`. Scoped rules `.board-cells {` at
`SudokuBoard.vue:441` & `FutoshikiBoard.vue:507` (verified) — the report's claim that
`class="grid" :class="BOARD_CELLS_CLASS"` leaves the rendered class value (hence the scoped
rule) unchanged is correct (Vue merges static+dynamic `class`).

**[5] Shared-home layout — `src/games/shared/` (NEW). → CORRECTED / OPEN (inter-lane seam).**
This is the one genuine crack. P2-L5 **overrides** the synthesis's D5 ("consolidate under
`src/composables/`", agglomeration §1.5.4) with a NEW `src/games/shared/` for
"cross-game-only, never-pencil" logic — and P2-L6 **independently placed** `useUndoHistory`
/`usePencilMarks` (consumed by both games only — the exact category P2-L5 routes to
`games/shared/`) into `src/composables/`. By P2-L5's own rule those two composables belong
in `games/shared/`, not `src/composables/`. P2-L6 flags the tension honestly (finding #3:
"P2-L5's decision to ratify"), so it's not an unacknowledged contradiction — **but both
reports declare their scope "closed" while prescribing incompatible homes for the same file
category.** Authoring cannot proceed on both as-written: if P2-L5's rule wins, P2-L6's
`src/composables/{useUndoHistory,usePencilMarks}.ts` must relocate to `src/games/shared/`.
Owner/wave must ratify one rule. **Deduction applied.**

### P2-L6

**[6] LOC 482→409, 472→395. → CONFIRMED exact.** Worktree
`games/sudoku/composables/useSudoku.ts` = 409 (baseline 482, −73), `.../useFutoshiki.ts` =
395 (baseline 472, −77). (Note: the report's file table writes bare `useSudoku.ts`; the true
path is `games/{sudoku,futoshiki}/composables/` — cosmetic, counts exact.)

**[7] New-file LOC 50 / 81 / 14. → CONFIRMED.** `useUndoHistory.ts`=50, `usePencilMarks.ts`=81,
`lib/base64url.ts`=14 (all in worktree, exact).

**[8] Tracked diff 19 files, +80/−228, net −148. → CONFIRMED.**
Initially looked wrong — a naive `git diff --stat` reports −1208 (the `git mv`'d
FilterTuner/rafInstrumentation/SvgFilters show as add+delete). With **rename detection vs
HEAD** (`git diff --stat -M HEAD`): **19 files changed, 80 insertions(+), 228 deletions(-)** —
byte-exact to the report. The report used the rename-aware diff correctly.

**[9] Rename cleanliness. → CONFIRMED.** `git diff --summary -M HEAD` shows renames at
97–100% similarity: `apiError.ts→classifyError.ts` (both games), `chrome/{→icons}/DiceIcon`
`SolveIcon`, `{dev→filters}/FilterTuner` `rafInstrumentation`, `{chrome→filters}/SvgFilters`.

**[10] Depth rule + flat-config append discipline. → CONFIRMED (and a genuine finding).**
Worktree `eslint.config.js:45` `group: ['@pencil/*/*/*', '@pencil/*/*/*/**']`. Verified the
`pencilPublicSurfaceOnly` pattern is **appended into each game rule's `patterns` array**
(alongside the cross-game block) plus a separate `appMayNotDeepImportPencil` for
App.vue/main.ts — exactly as the report's discipline note requires. Flat config **does**
override same-key rules per file-match, so a naive second `src/games/**` block would have
clobbered the cross-game boundary. The finding is real and correctly handled.

**[11] "6 external 3-level sites, not 11". → CONFIRMED.** Grep of main tree
(`@pencil/<a>/<b>/<c>` under games+App+main) returns exactly 6: sudoku+futoshiki ControlPanel
OptionSelector, sudoku+futoshiki Board HandDrawnGrid, App.vue HandwrittenLogo+AttributionCard.
The synthesis's "11" (agglomeration §1.5.6) counted pencil-internal deep imports; the
external-scoped rule correctly leaves those alone. Re-measure is right.

**[12] Subdir barrels, chunk-shape parity. → barrels CONFIRMED; chunk bytes UNVERIFIABLE (PLAUSIBLE).**
`chrome/index.ts` + `grid/index.ts` present in worktree, pure re-exports. The chunk-byte
table (`index.js +0.32kB`, `FutoshikiGame.js −1.00kB`, rest 0) requires a build; node_modules
was removed at close (verified absent), so not re-run this lane. Internally consistent
(shared machines fold into eager Sudoku chunk ⇒ lazy Futoshiki shrinks). PLAUSIBLE.

**[13] Gates green (vue-tsc/eslint/build EXIT 0, playwright 33). → UNVERIFIABLE (PLAUSIBLE).**
node_modules absent (report's "removed at close" confirmed) ⇒ not independently re-run. The
substrate those gates ran against **is** fully verified (clean renames, appended eslint rule
that bites, barrels preserving boundaries, sane diff). Do not author the integers verbatim
(the report itself flags the e2e count as env-dependent, K18).

**[14] P4 pixel method weak; reduced-motion AE=0 definitive. → UNVERIFIABLE (PLAUSIBLE).**
Methodologically sound (boil stroke-jitter is stochastic; `reducedMotion:'reduce'` freezes it
deterministic). Screenshots referenced at `p2l6shots/` + `p2l6shots-rm/`; not re-diffed this
lane. The recommendation (bound parity via reduced-motion determinism, not a single animated
control) is correct and should be adopted for W-E/W-F.

**[15] P2-L6 shared-home placement, deferred to P2-L5. → CONFIRMED as stated** (but see [5]).

---

## Convergence arithmetic (per-deduction)

Base 100%.
- **−8%** — the shared-home inter-lane seam [5]: P2-L5 (`src/games/shared/`) vs P2-L6
  (`src/composables/`) prescribe incompatible homes for the same cross-game composables;
  both claim closure. A live authoring blocker until one rule is ratified.
- **−2% ×3 = −6%** — [12] chunk bytes, [13] gate EXIT/counts, [14] AE=0 not independently
  re-run (node_modules gone). Substrate verified, outputs PLAUSIBLE, so light deductions.
- **−1%** — [1] `releaseHold`-never-fires imprecision (cosmetic).

**100 − 8 − 6 − 1 = 85%.**

Every cheaply-checkable file:line claim across both reports was exact (SolveState/SolveStats
byte-identity, `.board-cells` producer/consumer/scoped-rule lines, celebration imports+consumers,
LOC deltas, the rename-aware diff, the 6-site re-measure, the eslint append discipline). Zero
fabrications, zero hard REFUTED.

## kill_list (must resolve before authoring — none are fabrications, all are OPEN/CORRECT-me)

1. **Shared-home is NOT closed.** Reconcile P2-L5's `src/games/shared/` rule with P2-L6's
   `src/composables/` placement of `useUndoHistory`/`usePencilMarks`. If P2-L5's rule is
   adopted, those two files (both consumed by games only, never pencil) MUST move to
   `src/games/shared/`. Owner/wave ratification required; do not author both as-written.
2. **Do not author the gate/chunk/pixel integers as guarantees** — 33-passed, +0.32/−1.00 kB,
   AE=0 were not independently re-run (worktree node_modules removed). Re-run vue-tsc + eslint
   + build + e2e + the reduced-motion pixel bound at authoring time; treat the numbers as
   indicative (K10/K18).
3. **Correct R6(a)'s case-2 wording** — replace "spurious `setTimeout → releaseHold` on a hold
   never acquired" with "a spurious else-branch pass that arms an unmount timer the following
   true-branch clears before `releaseHold` fires." `releaseHold` does not execute.

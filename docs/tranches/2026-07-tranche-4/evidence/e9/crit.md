# E9 — CRIT lane (the harden step): adversarial verdict on the undo/confirm triumvirate

Baseline of record: **HEAD = `7e03c5dc`** (T4-W7 addendum) — confirmed `git rev-parse HEAD`.
Committed truth = `git show HEAD:<path>`; in-flight = working tree (W8 marks lanes + W9 tally
lanes editing web/frontend concurrently, uncommitted). Every row tags [committed] vs [in-flight].

The three research lanes' load-bearing anchors were spot-checked directly. The census is
**substantially SOUND** — the one campaign-known failure mode (a wrong anchor, cf. the W7
GAC-mask correction) did NOT recur. Two facts the researchers MISSED are load-bearing and
change R2's race design. Detail below; numbered KILL/KEEP/MISSING at the end.

---

## A. Verification log (what I re-derived myself)

### A1. Difficulty live-vs-armed, BOTH games — the crux anchor. VERIFIED, HOLDS.
- Sudoku [committed HEAD useSudoku.ts:445 `watch([size, difficulty]) → syncToUrl only`; :450
  `watch(size) → clearPersistedBoard; initBoard; randomize`]. Difficulty is ARMED (writes URL,
  consumed by the next randomize); size is LIVE re-deal. Identical in worktree (:460 / :465).
- Futoshiki [worktree useFutoshiki.ts:58 `const difficulty = ref<Difficulty>("EASY")` hardcoded
  at mount; :447 `watch(boardSize) → syncToUrl; …; randomize`]. Difficulty is runtime-only, not
  a watcher dep; size is live re-deal. useUrlState.ts:7 `There is no difficulty (F3)` — absent
  from PersistedBoard. So futoshiki difficulty survives NOTHING (resets to EASY each mount).
- VERDICT: R1/R2/R3's central claim — difficulty is already next-game mechanically, only the
  label lies; size is the loud live-destructive control — is CORRECT for both games.

### A2. Undo coverage. VERIFIED, HOLDS.
- [committed] useUndoHistory.ts:16 `UNDO_CAP = 128`; :19 `{pos,prev,next}[]` + :20 `undoIndex`;
  :28-29 redo-tail splice on fork; :31 FIFO `shift()` on overflow. Delta/pointer-based already.
- [committed] useSudoku.ts:176-179 `setCell → applyCellValue + recordEdit` — ONLY user value
  writes are recorded. :313 `inkReveal … NOT recorded on the undo stack (a reveal is not a user
  edit)`. solve() (230-282) records nothing and does NOT clearUndo → after a solve the stack
  still holds pre-solve edits; undo rewinds user edits UNDER the solver ink. R1's inconsistency
  is real and reproduced.
- [in-flight] useUserMarks.ts:75-83 `toggleUserMark` has NO `recordEdit` — mark toggles are
  invisible to undo. clearUserMarks fires only on the boardGeneration watch (:91). Symmetric in
  futoshiki (toggleUserMark wired, recordEdit only in setCell path, useFutoshiki.ts:177).

### A3. Clear-confirm mechanism. VERIFIED, HOLDS.
- [worktree] sudoku ControlPanel.vue:200-214 `clearArmed` + 2.5s `clearArmTimer`; onClear:203
  `if (isCoarse && !clearArmed) { arm }` else commit — coarse-only two-tap; :350/:504 aria swap
  `Clear board`↔`Tap again to clear board`; :359/:513 `sure?` sublabel, :357 `is-armed`.
- onRandomize:188 is BARE (no arm, no dirty check). All buttons `:disabled="loading"` (338…413).
- **Arms UNCONDITIONALLY** — no dirty precondition (blank board still arms). No `isDirty` exists
  anywhere in src/games (re-grepped; only prose). Futoshiki is a byte-twin (:196-208).

### A4. Keyboard undo race seam. VERIFIED, HOLDS.
- [worktree] SudokuBoard.vue:365-367 `if (e.ctrlKey||e.metaKey) { shift→emit redo; else emit
  undo }` — NO loading gate in the keydown path (grep `loading` in the handler = empty). Buttons
  are gated; keyboard is the open seam. Futoshiki byte-twin FutoshikiBoard.vue:342-344.
- Hazard is benign (no corruption): mid-randomize an undo writes the old board, then the deal's
  `values={}` + clearUndo (useSudoku.ts:213, INSIDE the try, AFTER the await) discards it;
  mid-solve an undo may zero a cell the merge re-fills. Race-SAFE, not race-CLEAN. KISS fix =
  gate keyboard undo on loading too.

### A5. Transport has no abort/cancel. VERIFIED, HOLDS.
- transport.ts: `pending` Map, `rejectAllPending`, monotonic `id++`, retire-on-error — but NO
  abort method. R2's "refuse-while-pending, don't cancel" is correct: there is nothing to cancel.

---

## B. What the researchers MISSED (both load-bearing; both change R2's race design)

### B1. The `boardGeneration` epoch is NOT uniformly advanced — sudoku randomize never bumps it.
- [committed HEAD] sudoku useSudoku.ts boardGeneration++ ONLY at initBoard:118, clearBoard:144 —
  **NOT in randomize()**. [committed HEAD] futoshiki useFutoshiki.ts bumps at initBoard:117,
  clearBoard:145, AND **randomize:212**. Identical asymmetry in the worktree (sudoku :119/:145
  only; futoshiki :118/:146/:213). Pre-existing, not W8-introduced.
- CONSEQUENCE 1 (kills R2's specific mechanism): R2 §3 proposes "reuse boardGeneration as a
  monotonic epoch; async ops capture gen at dispatch, drop the result on mismatch." Two
  overlapping sudoku **randomizes** capture the SAME gen — the epoch cannot distinguish them, so
  the stale-drop guard is a no-op for the exact op it most needs to guard. The DISCIPLINE
  (refuse-while-pending + push-after-resolve) is sound; the boardGeneration-as-epoch DETAIL is
  broken for sudoku. Fix: a dedicated per-op monotonic token, OR make sudoku randomize bump
  boardGeneration (which also fixes CONSEQUENCE 2 and a latent peek-cache bug).
- CONSEQUENCE 2 (asymmetric marks-void, in-flight): useUserMarks voids notes on the
  boardGeneration watch. Since sudoku randomize doesn't bump gen, a direct **Randomize voids
  user marks in futoshiki but NOT in sudoku** — the W8 comment "boardGeneration voids the notes
  on clear/randomize/size-swap" is FALSE for sudoku randomize. R2's "sharpest edge" (board-undo
  fights the void-watch) is worse than stated: in sudoku the watch doesn't even fire on
  randomize. Any E9 board-node restore discipline must reconcile this per-game.
- LATENT (orthogonal, worth a W8 note): peekCache is keyed on gen (useSudoku.ts:289/:304). A
  direct sudoku randomize leaves gen unchanged, so a subsequent peek can return the PRIOR
  board's cached solution. Pre-existing; surfaces the same missing bump.

### B2. `getRandomBoard` is wall-clock-seeded; the seed is internal, not a parameter.
- useSolver.ts:102-105 `getRandomBoard(size, difficulty)` → :118 `seed: Date.now()` posted to
  the worker. A re-deal is NOT reproducible from (size, difficulty) alone.
- Answers the harden brief's explicit question ("re-deal reproducible from a seed pointer or
  must the board snapshot?"): a deterministic redo REQUIRES either (a) snapshotting the dealt
  board into R2's content-hash pool — works today, zero solver change, already deduped, R2's
  chosen path — or (b) plumbing `seed` as a getRandomBoard PARAMETER and storing the 8-byte seed
  (cheaper: 8 B vs ~2.5 KB board) at the cost of a solver-signature change. R2/R3's "redo re-deals
  the SAME board via stored nextHash" is CORRECT under (a); the researchers just never named WHY
  (the Date.now seed) or that the cheaper (b) exists. Recommend (a) — KISS, no signature surgery,
  pool already dedups.

### B3. Permalink interaction (answered, confirming R2). Undo history does NOT survive `?board=`.
- restoreBoard (useSudoku.ts:392-406) calls clearUndo (:405); a `?board=` permalink is a fresh
  page load anyway (in-memory stack gone). So R2's "session/in-memory only, doesn't survive
  reload" is confirmed at the code, not just asserted. No history-vs-board disagreement risk.

---

## C. KILL / KEEP / MISSING — the numbered adjudication

1. **KEEP** — Structure = tagged linear inverse-delta log + content-hash-deduped board POOL, NOT
   a trie/HAMT. R2's byte arithmetic is sound (200 deltas ~6 KB vs 200 raw 16×16 ~500 KB; a
   HAMT copies root→leaf AND retains every intermediate root, costing MORE than a 29 B delta with
   no compensating bound). The owner SUGGESTED a trie; the reasoned verdict is that a trie
   over-engineers value edits, and the delta-log + deduped pool IS the honest reading of "pointers
   not raw boards, de-duplicate." Anchor: useUndoHistory.ts:19 (delta already shipped) +
   R2 §1-2 measured table.

2. **KEEP (with an AMENDMENT — see 3)** — Race posture = single-writer log + refuse-while-pending
   + push-entries-after-resolve + gate keyboard Cmd/Ctrl+Z on loading. The discipline closes the
   undo-during-pending-generate hole (SudokuBoard.vue:365-367 is the one ungated seam; buttons
   already `:disabled="loading"`). No transport abort exists, so refuse (not cancel) is correct.
   Anchor: SudokuBoard.vue:365-367 [worktree], transport.ts (no abort).

3. **KILL (the mechanism, not the goal)** — R2's "reuse `boardGeneration` as the monotonic epoch"
   for the stale-drop guard. boardGeneration is NOT bumped on sudoku randomize (B1), so it cannot
   discriminate two overlapping sudoku deals. Replace with a dedicated per-op token, or first make
   sudoku randomize bump boardGeneration (also fixes the marks-void asymmetry + the peek-cache
   staleness). Anchor: useSudoku.ts boardGeneration@118,144 only (HEAD) vs useFutoshiki.ts@117,145,212.

4. **KEEP** — Redo across a deal is deterministic ONLY via a board SNAPSHOT into the pool (not a
   seed), because getRandomBoard seeds with Date.now() internally (B2). R2/R3's stored-nextHash
   redo is right; the pool must hold the dealt board (already deduped). Optional cheaper path
   (plumb `seed` as a param, store 8 B) is available but needs a solver-signature change — not
   worth it for KISS. Anchor: useSolver.ts:118 `seed: Date.now()`.

5. **KEEP** — Solve/hint MUST enter history (owner's "ALL user actions"). Today solve records
   nothing and doesn't clearUndo, so undo rewinds pre-solve edits under solver ink — a live
   inconsistency (A2). R2's ruling (solve = one board-pointer swap = one undo entry; hint-ink =
   one value entry with solved tone) resolves it. Fill-forced/solve is 1 entry (board swap), not
   N — no multi-cell sweep feature exists (hint is single-cell, inkReveal). Owner-taste flag:
   undoing a hint should strip the solved-tone membership + re-arm the flourish gate. Anchor:
   useSudoku.ts:313 (inkReveal off-stack), solve() 230-282 (no record, no clearUndo).

6. **KEEP** — Cap = 200 (128 acceptable floor). Delta-dominated and flat across 100-200 (~6 KB);
   the pool is refcount-bounded independently, so the ceiling is a UX choice, effectively free on
   memory. One-constant bump from UNDO_CAP=128. Anchor: useUndoHistory.ts:16.

7. **KEEP** — Destructive-confirm = generalize the shipped coarse two-tap Clear grammar to
   Randomize/Deal, GATED on a new isDirty; undo as universal backstop. Reject a modal (owner
   banned modals for completion, T3-8b) and reject toast-as-sole-defense (no toast system). The
   surviving design does NOT nag: dirty-gated (pristine board deals instantly) AND coarse-only
   (desktop never sees it, leans on undo + Cmd/Z). CRITICAL CONTINGENCY: it leaves NO in-app
   un-undoable destruction unconfirmed ONLY IF the undo spine actually records randomize/solve/
   size as board-swaps (item 5) — today those are un-undoable, so confirm+undo are both required
   (belt-and-suspenders). Cross-game switch stays the W12 ribbon (genuinely un-undoable: strips
   ?board=). Anchor: sudoku ControlPanel.vue:200-214 (onClear precedent), :188 (onRandomize bare).

8. **KEEP** — isDirty signal: cheapest is undo-depth-non-empty once the history spine records all
   edits (marks + values + board-swaps) — one derived signal, no parallel bool. Fixes Clear's
   unconditional arm on a blank board (A3). Anchor: no isDirty exists anywhere (A3).

9. **KEEP** — Difficulty needs NO undo, reads as next-game, and bake-a-game (size arm-not-live).
   Verified from the mechanism (A1): a difficulty change mutates the board nothing; only
   watch(size) re-deals. Retire the sudoku watch(size)/futoshiki watch(boardSize) live re-deal so
   size+difficulty stage as one pair committed by one guarded Deal — this is the only live
   board-wipe control and the partition is load-bearing (it collapses the confirm surface to two
   buttons). Anchor: useSudoku.ts:450 / useFutoshiki.ts:447 (live re-deal to retire).

10. **MISSING → MUST FOLD** — Futoshiki difficulty is runtime-only (EASY each mount, absent from
    PersistedBoard, F3). A "baked" futoshiki difficulty silently resets on reload unless folded
    into its PersistedBoard/URL (as sudoku already does). This is a hard dependency of the
    bake-a-game partition, not optional. Anchor: useFutoshiki.ts:58, futoshiki useUrlState.ts:7.

11. **MISSING → RECONCILE** — The boardGeneration marks-void asymmetry (B1 CONSEQUENCE 2): in-flight
    W8, a direct Randomize voids user marks in futoshiki but not sudoku. The E9 board-node restore
    discipline and the marks-in-history plumbing must reconcile per-game, or an undone/redone deal
    behaves differently across the twins. Anchor: useSudoku.ts (no gen bump in randomize) vs
    useFutoshiki.ts:213.

12. **MISSING → DECIDE (marks in the log from day one)** — useUserMarks is IN-FLIGHT (absent from
    HEAD; grep count 0). The undo spine should thread toggleUserMark through the log from the
    START — retrofitting mark-history after W8 seals doubles the touch on both composables +
    useUserMarks. This argues the E9 history wave should land AFTER W8 seals and build ON the
    sealed toggleUserMark seam, not race it. Anchor: useUserMarks.ts:75-83 [in-flight, untracked].

---

## D. Sizing + placement (for the tranche write)

- **Size: L.** Three coupled lanes: (i) history-spine — rewrite useUndoHistory to a tagged union
  + replay dispatcher + content-hash board pool, thread toggleUserMark/randomize/solve/size,
  gate keyboard undo on loading [L]; (ii) destructive-confirm — isDirty computed + generalize the
  two-tap to Randomize/Deal, both games [M]; (iii) bake-a-game — retire live size re-deal, stage
  the panel, re-home Deal, fold futoshiki difficulty into PersistedBoard [M-L].

- **Placement: a DEDICATED NEW WAVE sequenced AFTER W8 seals — NOT an addendum riding a live
  wave.** Reasons: (1) L-sized and coherent; (2) hard dependency on W8's sealed toggleUserMark
  seam (item 12) — marks must be in the log from day one; (3) it mutates the EXACT files W8 is
  editing live (useSudoku, useFutoshiki, both ControlPanels, useUserMarks, useUndoHistory), so
  riding the live wave invites merge collision on every shared surface. W9 (border/tally) is
  lower-overlap and can proceed in parallel. Keep confirm + bake-a-game together in the wave
  (they share isDirty + the ControlPanel/staging surface); fold futoshiki-difficulty-persistence
  (item 10) in as a named dependency, not a separate W6 addendum, since the staging surface
  depends on it. DAG: W8 seal → E9 wave (this) ∥ W9.

- Gates born RED where live: keyboard-undo-during-loading no-ops (currently fires); Randomize on a
  dirty board arms (currently bare); size-change stages, does not re-deal (currently live);
  undo after solve removes solver ink AND the pre-solve edit coherently (currently rewinds edits
  under the ink); futoshiki baked difficulty survives reload (currently resets to EASY).

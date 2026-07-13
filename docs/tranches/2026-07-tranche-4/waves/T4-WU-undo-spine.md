# T4-WU — The undo spine + the baked game (mid-tranche, owner audit E9)

**"If you're partway into a game and accidentally hit these buttons, that would be disastrous."** One history spine that records **every** user action — values, marks, hint ink, and whole-board swaps — as a tagged inverse-delta log over a content-hash-deduped board pool; a conditional two-tap confirm on the only destructive verbs left standing; and the control panel re-partitioned so board-size + difficulty *stage* a game that one guarded **Deal** commits. The owner suggested a trie; the arithmetic returned a verdict: 200 deltas cost ~6 KB where 200 raw 16×16 snapshots cost ~500 KB and a HAMT costs *more than a delta* per edit while retaining every intermediate root — **the delta log + hash pool IS the honest reading of "pointers not raw boards, de-duplicate"** (r2 §1–2, crit #1). Everything here is KISS by subtraction: the undo machine already ships delta-based (`useUndoHistory.ts`, cap 128); this wave widens what it can see.

**Dependencies**: ← **W8 SEALED** (hard — the spine records `toggleUserMark` from day one and mutates every file W8 is editing live; riding W8 invites collision on every shared surface — crit #12, placement ruling). ← W7 (hint ink enters history; the solve entry). ∥ W9 tail acceptable (low overlap). → W10 runs after (the idiom census sweeps this wave's additions). **Effort**: L.

---

## The three owner questions, answered from the mechanism (binding)

1. **Does difficulty need an undo? NO.** Verified in both games: `watch([size, difficulty])` writes the URL only (`useSudoku.ts:445`); only `watch(size)` re-deals (`:450`); futoshiki difficulty is a bare ref (`useFutoshiki.ts:58`). A difficulty change mutates the board **nothing** — it arms the *next* deal. There is literally nothing to undo; the remedy is legibility, not a history entry.
2. **Should difficulty read as next-game? YES — it already IS next-game mechanically; only the label lies.** The fix is the partition below, with zero copy: selectors that visibly stage, and a Deal verb that visibly commits.
3. **Should size + difficulty become a "bake a game" surface? YES.** Board-size goes **arm-not-live** (retire the `watch(size)`/`watch(boardSize)` live re-deal — today size-change is a bare, unguarded board wipe, the loudest hazard after Randomize). Size + difficulty become one staged pair committed by ONE guarded Deal — which collapses the entire destructive-confirm surface to **two buttons** (Deal, Clear). The partition is load-bearing, not cosmetic (r3 §1).

---

## Scope

### ROW 1 — the history spine: one tagged log, one board pool (E9 core)

Generalize `useUndoHistory.ts`'s `{pos, prev, next}[]` to a **tagged union log** with a replay dispatcher:

- `{kind:'value', pos, prev, next}` — cell write/erase (exists today, ~29 B).
- `{kind:'mark', slot:'corner'|'center', pos, prevList, nextList}` — the W8 user marks; the insertion seam is `toggleUserMark` ↔ `recordEdit`, mirroring how `setCell` already pairs `applyCellValue` + `recordEdit`.
- `{kind:'value', tone:'solved', …}` — **hint ink enters history** (the owner's "ALL user actions"; reverses the committed "a reveal is not a user edit" stance at `useSudoku.ts:313`, resolving the census inconsistency where undo rewound player edits *under* solver ink). Undoing a hint strips the `solvedValues` membership and re-arms the flourish gate — **owner-taste flag, ratify at B5**.
- `{kind:'board', prevRef, nextRef, marksRef, ctx}` — randomize/Deal, size change, solve, clear: whole-board pointer swaps into a **content-hash-deduped pool** (`Map<hash, board>`, the git object model in miniature; refcounted — a FIFO-evicted entry GCs its blob iff unreferenced). One undo restores the whole board. `clearUndo` at deal (`useSudoku.ts:213`) dies — deals *append*, never wipe.
- **Redo of a deal is deterministic via the stored `nextRef` snapshot** — NOT a seed: `getRandomBoard` seeds internally with `Date.now()` (`useSolver.ts:118`); the seed is not a parameter, so a re-deal is unreproducible from `(size, difficulty)`. The snapshot costs ~2.5 KB once, deduped; plumbing a seed parameter is a solver-signature change rejected for KISS (crit #4).
- **Cap = 200** (from `UNDO_CAP=128`, one constant): delta-dominated and flat across 100–200 (~6 KB); the pool is refcount-bounded independently, so the ceiling is a UX choice the arithmetic proves free. Realistic total < 200 KB; the pathological all-distinct-16×16-swaps case (~500 KB) is unreachable in 200 gestures.
- **Session-only, in-memory** — the timeline does NOT survive reload, justified from the model: the persisted unit is a single-board snapshot and the permalink URL-wins on reload; rehydrating a 200-entry timeline contradicts the stateless `?board=` contract and risks board/history disagreement. The board persists (as today); the history doesn't. Named in the record, not silent.
- No batch entries needed today (no multi-cell sweep exists — W7's fill-forced is detector-only until W8's button, hint is single-cell); IF a sweep ships, one `{kind:'batch'}` entry = one gesture = one undo.

### ROW 2 — race discipline: single-writer, refuse, push-after-resolve

- The composable is the **sole log author**; entries push **after** resolve, never before — a rejected or stale generate leaves zero orphan entries (the crux).
- **The epoch fix (crit #3 — the mechanism the crit killed, repaired):** `boardGeneration` cannot serve as the stale-drop epoch as-is because **sudoku `randomize()` never bumps it** (`++` only at init/clear) while futoshiki's does — two overlapping sudoku deals share a gen. RULING: **every board-replacing resolve bumps `boardGeneration`, both games** (parity). This one change makes gen a valid per-op discriminant AND fixes the marks-void asymmetry (crit #11: futoshiki randomize voids user marks, sudoku's doesn't — the W8 comment is false for sudoku today) AND the latent peek-cache staleness (`useSudoku.ts:289/304`). Async continuations capture gen at dispatch and drop on mismatch — latest-wins, mirroring the transport's id+pending discipline.
- **Refuse-while-pending, never cancel** (the transport has no abort): the coarse undo/redo buttons are already `:disabled="loading"`; the ONE open seam is keyboard Cmd/Ctrl+Z (`SudokuBoard.vue:334-345`, unguarded) — gate it on the same signal. Born-RED probe: keyboard undo during a pending generate must no-op.
- **The restore-order discipline (r2's sharpest edge):** a `{kind:'board'}` undo restores the board AND its marks — but the `boardGeneration` watch voids `useUserMarks` on gen bump. RULING: restore sets a transient `restoring` flag that no-ops the void-watch for exactly that restore (explicit, KISS); the board node carries `{prevRef, nextRef, marksRef, ctx}` so marks travel with the board they annotated.

### ROW 3 — the conditional confirm: the Clear grammar generalized, dirty-gated

- **`isDirty` = undo-depth non-empty** — one derived signal off the spine once it records everything; no parallel bool to desynchronize (crit #8). Today NO dirty signal exists anywhere in `src/games` (grep: prose only), and Clear's two-tap **arms unconditionally on a blank board** — the same gate fixes that.
- **Generalize the shipped Clear two-tap** (`ControlPanel.vue:186-210`: coarse-only arm → "sure?" crayon-rose sublabel, 2.5 s lapse, aria swap — NO dialog) to **Deal**. Confirm = prevention on the dirty board only; the undo spine = recovery for anything that slips — belt and suspenders, exactly the owner's "conditional." A pristine board deals instantly; no nagging by construction.
- **Rejected on the record**: confirm-*dialogs* (the owner banned modals, T3-8b; a modal is a second input grammar the WM freeze forbids); undo-toast-as-sole-defense (no toast system exists; a snackbar is new grammar — recovery is already visible via the coarse Undo button and Cmd/Z).
- **Coarse-only, stated**: desktop keeps instant Deal + Cmd/Ctrl+Z backstop, per the Clear precedent. (Ratify-me default: no fine-pointer variant.)
- **Solve carries no confirm** — intentional (you pressed Solve to solve) and now undoable as one board entry. Named in the taxonomy, not silently skipped.
- **Spatial prophylaxis** (NN/G "consequential options close to benign options" — the owner's exact accidental-tap fear): Deal moves OUT of the live-play row into the staged zone; a mid-game fat-finger lands on Undo/Hint (benign or itself recovery), never a board wipe.

### ROW 4 — the baked game: the staged/live partition (Fable design)

- **STAGED "New game" zone**: Size + Difficulty `OptionSelector`s + the **Deal** button (the DiceIcon re-homed from the action row — no new control, the WM input shape stays frozen), above the existing divider; `role="group"` labelled by the New-game heading (one new semantic, no live region — KISS). Selectors read as provisional by placement; **Deal is the verb that commits them** — "next-game" becomes self-evident with zero copy.
- **LIVE zone** below: pencil-mode toggle, Undo/Redo/Hint, Check, Solve/Clear/Share — acts on the CURRENT board.
- **Size goes arm-not-live in both games** (retire `watch(size)` / `watch(boardSize)` re-deals) — a deliberate behavior change, named: size-switch stops being an instant board wipe and becomes staged. Mobile already groups size/difficulty at top and play-tools at bottom; the partition mostly formalizes what exists, then moves Deal up.
- **Futoshiki difficulty folds into its `PersistedBoard`/URL** (`?difficulty=` + localStorage, as sudoku already does) — **hard in-scope dependency** (crit #10): a staged difficulty that resets to EASY each mount makes the surface lie for one game. Closes the W6 residue.
- **W12 non-collision, tiered grammars**: the carousel selects the GAME; bake-a-game selects a game's PARAMETERS — orthogonal axes, and this zone lives inside the per-game panel the carousel folds into a card. In-place destruction → two-tap; cross-game abandonment → the W12 ribbon (genuinely un-undoable — history is session-scoped and a switch strips `?board=`); **no third confirmation shape**.
- **The verb**: "Deal" recommended (sketchbook idiom, W12-congruent; the owner's own word was "bake") — **owner-taste flag on the label**, B5 captures.

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base (post-W8-seal HEAD).

| Gate | Value |
|---|---|
| Headline | every user action undoes — values, marks, hint ink, deals, size, solve, clear — through one tagged log + deduped board pool, 200 deep, race-free by refuse+epoch; destructive verbs are dirty-gated two-taps; size+difficulty stage a game one Deal commits; futoshiki difficulty survives reload |

Component checks:

| Gate | Value |
|---|---|
| marks undo (**born RED**) | today `toggleUserMark` bypasses history entirely — a mark toggle is invisible to undo. After: mark write/erase round-trips through undo/redo in both games. |
| board undo (**born RED**) | today randomize/size/clear call `clearUndo` and solve records nothing — undo rewinds player edits UNDER solver ink. After: each is one `{kind:'board'}` entry; undo restores board AND marks (the restore-order probe: marks survive the gen-bump watch); redo re-deals the SAME board via `nextRef`. |
| race (**born RED**) | today keyboard Cmd/Ctrl+Z is unguarded during `loading`. After: it no-ops while pending; an undo racing a pending generate refuses; a stale generate resolve drops on epoch mismatch and appends nothing. |
| epoch parity (**born RED**) | today sudoku `randomize()` never bumps `boardGeneration` (futoshiki does) — the two games diverge on marks-void and no per-op discriminant exists. After: every board-replacing resolve bumps gen in both games. |
| dirty confirm (**born RED**) | today Randomize is BARE (`onRandomize`, `:181-184`) and Clear arms on a blank board. After: Deal + Clear two-tap ONLY when `isDirty`; pristine acts instantly; no modal anywhere. |
| staged size (**born RED**) | today `watch(size)` re-deals immediately — size-change is an unguarded wipe. After: size arms; only Deal deals; the staged group reads `role="group"` with Deal as commit. |
| futoshiki difficulty persists (**born RED**) | today it resets to EASY every mount (absent from `PersistedBoard`, `futoshiki/useUrlState.ts:30-39`). After: `?difficulty=` + localStorage round-trip, twin of sudoku's. |
| cap + pool | history holds 200; entry 201 evicts entry 1 FIFO; the same board dealt twice occupies ONE pool slot (hash dedup); an evicted board's blob GCs iff unreferenced; total memory measured and banked (~KB figures, not asserted). |
| KISS audit | no HAMT/trie/persistent-map dependency lands; the diff is the tagged union + dispatcher + pool over the EXISTING `useUndoHistory` shape — the crit's arithmetic (trie unwarranted) cited in the record. |

**π/DELTA** (visible claims):
- **π (staged zone)**: the New-game group + Deal, both games, mobile + desktop; compare against the born-RED capture (Randomize shoulder-to-shoulder with Undo in the action row).
- **DELTA (dirty two-tap)**: pristine Deal = instant; dirty Deal = "sure?" arm → commit; pair banked per game.
- **DELTA (undo of a deal)**: sequence capture — deal → edits → deal → undo restores the prior board WITH its marks; redo returns the same second board.

## Seeds

- `evidence/e9/r1-census.md` — the undo machine at anchors (delta-based, cap 128, value-writes only); the destructive inventory (Randomize BARE, size live-wipe, Clear's unconditional arm); the Clear two-tap as the in-house grammar; no dirty signal exists; the live-vs-armed control semantics; the size arithmetic (9×9 ≈ 959 B, 16×16 ≈ 3 KB, delta ≈ 29 B).
- `evidence/e9/r2-algorithmics.md` — the structure ruling (delta log + hash pool; the trie killed by arithmetic); the race discipline (single-writer, push-after-resolve, refuse); the taxonomy; cap 200; session-only persistence; the restore-order edge.
- `evidence/e9/r3-design.md` — the confirm adjudication (two-tap generalized; modal and toast rejected on the record); the partition sketch; the three owner questions answered; W12 tiered grammars; a11y (group label, aria swap verbatim from Clear).
- `evidence/e9/crit.md` — the kill-list: #3 epoch broken as-is (the repair is ROW 2's ruling), #4 seed unreproducible (snapshot redo), #10 futoshiki difficulty fold (hard dependency), #11 gen-bump asymmetry, #12 land AFTER W8 seals.
- Owner verbatim: `corpus/owner-prompts.md` §E9; README §4c E9 row.

## Residual risks

- **The restore-order discipline is the wave's sharpest edge** — undoing a deal restores the board, then the gen-bump watch voids the marks it just restored, unless the `restoring` flag lands exactly right. The board-undo gate's marks-survival probe is a hard born-RED test, not a review note.
- **Arm-not-live size is a behavior change** — long-standing instant size-switch becomes staged. Deliberate, owner-driven (Q3), named in the record; the e2e that assumed live re-deal recuts with it.
- **Hint-ink undo reverses a committed stance** — recorded-with-tone per the owner's "ALL user actions"; the tone-strip + flourish re-arm side-effects are owner-taste, B5 captures. If declined, hint ink reverts to off-log and the record says so.
- **The confirm must never regress to a modal** — if the two-tap proves insufficient on some surface, the escape is the W12 ribbon grammar or undo-only, never a dialog (T3-8b stands).
- **W8 is the base, not a peer** — this wave edits `useSudoku`, `useFutoshiki`, both ControlPanels, `useUserMarks`, `useUndoHistory`: every file W8 touches. It does not start until W8's seal lands; the gates' born-RED probes run against post-W8-seal HEAD.

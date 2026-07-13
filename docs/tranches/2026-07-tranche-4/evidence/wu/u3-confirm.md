# T4-WU · U3 — the conditional confirm (spec ROW 3)

Lane U3 of workflow T4-WU. Base = the {W8, W9} sealed HEAD **`df013a36`** (`git rev-parse HEAD`),
built **on** U1's history-spine + U2's staged/live partition working tree (read `u1-spine.md` +
`u2-partition.md`; never around them). Port **4390**. DO-NOT-COMMIT honored — the tree is additive,
HEAD unmoved, no git commit/push/reset. Every anchor re-located at HEAD before editing (W8 + U1 + U2
had all moved things off the spec's `ae2517c2` line numbers).

## Files touched (in-scope only — none of U1's spine, none of U2's partition/URL files)

- `web/frontend/src/games/sudoku/composables/useSudoku.ts` — `isDirty = computed(undoDepth > 0)`,
  the ONE derived signal off U1's spine (crit #8), returned to the game.
- `web/frontend/src/games/futoshiki/composables/useFutoshiki.ts` — the D16 twin.
- `web/frontend/src/games/sudoku/ControlPanel/ControlPanel.vue` — the `isDirty` prop; the shipped
  Clear two-tap GENERALIZED to Deal (`dealArmed` + `dealArmTimer` + `onDeal` arm/commit + the aria
  swap + the "sure?" sublabel, mobile + desktop); Clear's arm DIRTY-GATED (`props.isDirty` added to
  the arm condition); `isCoarse` hoisted to serve both verbs; `dealArmTimer` cleared on unmount.
- `web/frontend/src/games/futoshiki/ControlPanel/ControlPanel.vue` — the D16 twin (byte-parallel).
- `web/frontend/src/games/sudoku/SudokuGame.vue` + `.../futoshiki/FutoshikiGame.vue` — `:is-dirty`
  wired to each ControlPanel mount (mobile card + desktop rail, both games).
- `web/frontend/src/games/sudoku/ControlPanel/ControlPanel.test.ts` +
  `.../futoshiki/ControlPanel/ControlPanel.test.ts` — `isDirty:false` in the mount defaults; +2
  tests each: on a FINE pointer (jsdom) Deal + Clear are one-click even when dirty (the coarse-only
  contract pinned at the unit layer).
- `web/frontend/e2e/mobile-affordances.spec.ts` — the coarse Clear two-tap recut for the dirty gate
  (pristine clears instantly, dirty arms→commits); +1 test: Deal is dirty-gated (pristine no-arm,
  dirty arms), hand-matched double-quote style, no `--write`.

NOT touched: `useUndoHistory.ts` (U1), `useUserMarks.ts` (U1), both Boards (U1), `useUrlState.ts`
(U2), the `watch(size)` staging (U2). U3 rides their seams; it does not edit them.

## The confirm taxonomy (spec item 4 — named, not silently skipped)

| Verb | Destructive? | Confirm | Undoable (U1) | Rationale |
|---|---|---|---|---|
| **Deal** (staged) | replaces the board | **coarse two-tap, dirty-gated** | yes (`board` entry / off-log clean reset on size change) | the owner's named hazard — prevention on the dirty board, recovery via undo |
| **Clear** (live) | wipes the board | **coarse two-tap, dirty-gated** | yes (`board` entry) | the shipped grammar, now dirty-gated |
| **Solve** (live) | fills the board | **NONE — intentional** | yes (`board` entry, U1) | you pressed Solve to solve; the fill is now one undoable board entry, so no confirm is owed |
| Size / Difficulty | stage only, mutate nothing | none (nothing to confirm) | n/a (armed, not live — U2) | non-destructive staging |

Rejected on the record (spec item 5, NOT implemented): confirm-**dialogs** (modals banned T3-8b — a
second input grammar the WM freeze forbids); undo-**toast**-as-sole-defense (no toast system exists;
recovery is already visible via the coarse Undo button + Cmd/Ctrl+Z). The confirm surface is exactly
**two verbs** (Deal, Clear); cross-game abandonment stays the W12 ribbon — no third confirm shape.

## Born-RED proofs (each defect PROVEN live at the base — the U1+U2 working tree)

**Gate — dirty confirm (RED at base). (a) Deal (re-homed Randomize) is BARE — no arm, no dirty check.**
```
grep -nA3 "function onDeal" src/games/sudoku/ControlPanel/ControlPanel.vue
  211:function onDeal() {
  212-  triggerDeal();
  213-  emit("deal");        ← bare: one press deals, dirty or pristine (futoshiki twin identical)
```
**(b) Clear ARMS UNCONDITIONALLY — no `isDirty` in the arm condition (arms even on a blank board).**
```
grep -nA1 "function onClear" src/games/sudoku/ControlPanel/ControlPanel.vue
  232:function onClear() {
  233-  if (isCoarse.value && !clearArmed.value) {   ← no dirty precondition
```
**(c) NO dirty signal exists anywhere in the confirm surface.**
```
grep -rniE "isdirty|pristine|\bdirty\b" src/games/{sudoku,futoshiki}/ControlPanel/  → exit 1 (no match)
grep -rniE "isdirty|pristine" useSudoku.ts useFutoshiki.ts SudokuGame.vue FutoshikiGame.vue
  → only prose ("a pristine given", "the PRISTINE givens") — no `isDirty` computed, no prop
```
So at base: a mid-game fat-finger on Deal wipes the board with no confirm, and Clear nags on a board
with nothing to lose. Both are the exact defects this lane closes.

## What landed (spec ROW 3)

1. **`isDirty` = undo-depth non-empty** — `computed(() => undoDepth.value > 0)`, one derived signal
   off U1's spine, returned by both composables and threaded to both ControlPanels (mobile + desktop).
   No parallel bool (crit #8). Pristine reads 0 because the mount deal is off-log
   (`randomize({record:false})`), a size-changing Deal `initBoard()`→`clearUndo()`s, and a permalink
   restore `clearUndo()`s — so a fresh board deals/clears instantly; any recorded value / mark /
   board-swap lifts it.
2. **The Clear two-tap generalized to Deal, dirty-gated.** `onDeal` mirrors `onClear` exactly:
   `if (isCoarse && props.isDirty && !dealArmed) { arm; return; }` else commit. Coarse-only arm
   ("sure?" crayon-rose sublabel via `.is-armed`, 2.5s `dealArmTimer` lapse, aria swap `"Deal a new
   board" → "Tap again to deal a new board"`) — verbatim the shipped Clear grammar (r3 §4). NO dialog.
3. **Clear's arm dirty-gated** — `props.isDirty` added to its arm condition, so a pristine board
   clears instantly (fixes the born-RED unconditional arm). Same undo-depth gate as Deal.
4. **Coarse-only, ratify-me default (spec item 3 / flag).** The arm keys on `useCoarsePointer()`; a
   fine pointer keeps the one-click Deal + Clear and the board's Cmd/Ctrl+Z backstop (U1's race-gated
   keyboard undo). No fine-pointer variant — recorded as a flag, per the Clear precedent.
5. **Solve carries no confirm** (taxonomy above) — intentional and now undoable as one U1 `board`
   entry. Named, not skipped.
6. **Spatial prophylaxis inherited** — U2 already moved Deal OUT of the live action row into the
   staged zone a full divider from the play tools; U3's confirm is the second layer (prevention),
   U1's spine the third (recovery) — the owner's "conditional," belt + suspenders.

## Gates closed

| Gate | Verdict | Evidence |
|---|---|---|
| **dirty confirm** | **GREEN** | Born-RED (above) → after: Deal + Clear two-tap ONLY when `isDirty`, pristine acts instantly, no modal. Unit: fine-pointer one-click pinned (4 new tests). e2e (coarse): recut Clear + new Deal test pass vs dist. |
| **DELTA (dirty two-tap)** | **GREEN** | Captured per game (below): pristine Deal = instant (no arm); dirty Deal = "sure?" arm → commit. |
| **DELTA (undo of a deal)** | **GREEN — no U1 defect** | Captured per game (below): deal A → edit + corner mark → deal B → undo restores A WITH its mark → redo returns the SAME board B (marks voided). U1's restore-order seam is intact end-to-end through the real worker. |

## DELTA captures (banked — coarse device iPhone 13, my built dist :4390)

A throwaway probe (`__probe_u3_delta.spec.ts`, run explicitly then deleted — additive tree) drove the
full sequence through the REAL solve/generate worker, both games. Verbatim console capture:

```
[SUDOKU] board A (as dealt) sig len=141
[SUDOKU] board A + edit: sig changed vs A0 = true; corner-marks = 1
[SUDOKU] Deal first tap → aria="Tap again to deal a new board" (armed, board intact)
[SUDOKU] Deal committed → board B (sig≠A=true); corner-marks after deal = 0 (voided)
[SUDOKU] undo → board == A (true); corner-marks restored = 1 (expected 1)
[SUDOKU] redo → board == B (true); corner-marks = 0 (voided)
[SUDOKU] DELTA OK — arm→commit + undo-of-deal restore-order intact
[FUTOSHIKI] board A (as dealt) sig len=39
[FUTOSHIKI] board A + edit: sig changed vs A0 = true; corner-marks = 1
[FUTOSHIKI] Deal first tap → aria="Tap again to deal a new board" (armed, board intact)
[FUTOSHIKI] Deal committed → board B (sig≠A=true); corner-marks after deal = 0 (voided)
[FUTOSHIKI] undo → board == A (true); corner-marks restored = 1 (expected 1)
[FUTOSHIKI] redo → board == B (true); corner-marks = 0 (voided)
[FUTOSHIKI] DELTA OK — arm→commit + undo-of-deal restore-order intact
2 passed (3.5s)
```

- **DELTA (dirty two-tap)**: the first Deal tap on a dirty board ARMS (aria swaps, `boardSig`
  unchanged — armed ≠ dealt); the second COMMITS (board B, `sig≠A`). PRISTINE Deal is instant (the
  permanent e2e `Deal is dirty-gated (T4-WU/U3)` asserts a fresh board's Deal aria stays `"Deal a new
  board"`, sublabel `"Deal"`, never `"sure?"`). Pair banked per game.
- **DELTA (undo of a deal) — U1 restore-order exercised live**: after the deal, `corner-marks = 0`
  (voided by the gen bump); one **undo** restores board A AND the corner mark (`corner-marks restored
  = 1`, i.e. the mark SURVIVED the void-watch — U1's `restoring` flag holds through a real deal);
  **redo** returns the SAME board B with marks voided. It did NOT red, so no U1 defect to report.
  Corroborated at the unit layer by U1's own probes (`useUndoHistory.test.ts:139` deal→edits→deal→
  undo, `useUserMarks.test.ts:169` the `restoring`-flag void-watch suppression).

The permanent coarse guards (in `mobile-affordances.spec.ts`) that replace the probe:
- `coarse affordances …` (recut): pristine Clear clears instantly with NO "sure?"; then a dirty
  board's Clear arms ("Tap again to clear board" + "sure?") and commits within the window.
- `Deal is dirty-gated (T4-WU/U3)`: pristine Deal aria/sublabel plain; dirty Deal arms (aria swap +
  "sure?", the typed value intact — armed ≠ dealt).

## Battery + e2e (all vs my built dist, port 4390, killed after; owner :3000/:3001 untouched)

- `vue-tsc -b --force` → **exit 0** (the two ControlPanel.test.ts required-prop errors fixed by
  adding `isDirty` to the mount defaults).
- `npm run test:unit` → **267 passed / 21 files** (U2's 263 + my 4 fine-pointer one-click tests).
- `lint:eslint` → **0**. `lint:knip` → **0** (`isDirty` used, no dead export). `prettier --check
  src/` → **0** (all matched files clean).
- `npm run build` → built (index **193.05 kB / gzip 69.44 kB** — +~0.5 kB over U2 for the two-tap
  logic + comments, within noise).
- **e2e default suite** (`PLAYWRIGHT_BASE_URL=http://localhost:4390 npx playwright test`) → **62
  passed** (U1/U2's 61 + my new `Deal is dirty-gated` test; the recut `coarse affordances` test
  passes under the dirty gate). NO golden re-baselined (goldens run under `playwright-golden.config`,
  not this suite; none crops the control panel). Owner listeners on `:3000`/`:3001` never touched;
  `:4390` killed after.

## Flags (for the orchestrator)

- **RATIFY-ME (spec item 3 / r3 §4) — coarse-only, no fine-pointer variant.** The dirty two-tap keys
  on `useCoarsePointer()`; a fine pointer keeps the instant Deal/Clear + Cmd/Ctrl+Z, per the shipped
  Clear precedent. Default NO desktop arm. One `props.isCoarse`-independent branch would flip it if
  the owner wants a fine-pointer confirm; recorded, not agonized.
- **Consecutive coarse deals re-arm (a KISS consequence of crit #8, not a defect).** `isDirty` =
  undo-depth non-empty, and a same-size Deal RECORDS a `board` entry (U1) — so a second Deal on the
  freshly-dealt (untouched) board still reads dirty and arms. This is the honest cost of the
  no-parallel-bool signal the crit chose; a "dirty since last deal" reading would need the parallel
  bool crit #8 rejected. The confirm here is mild friction on a fully-recoverable act (undo restores
  the prior board), so the tradeoff favors KISS. Named, ratify-me.
- **The armed sublabel bleeds if `isDirty` flips false while armed (edge, cosmetic).** If a coarse
  user arms Deal and then undoes to depth 0 within the 2.5s window, the "sure?" sublabel lingers
  until the timer lapses (the next tap commits instantly, correctly). Matches the shipped Clear
  pattern (no cross-disarm); left as-is for parity. No functional hazard.
- **No U1/U2 defect surfaced.** The undo-of-deal DELTA (the sharpest restore-order edge) passed live
  through the real worker in both games; the arm→commit rides U2's `deal()` emit without structural
  change, as U2's flag anticipated ("built so the confirm lane can wrap the Deal emit").

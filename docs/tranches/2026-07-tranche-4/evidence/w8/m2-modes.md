# M2 — modes + derivations · T4-W8 ROW 2/3/4 (A3 + A2 + A14)

**Lane M2 of T4-W8.** Charge (spec ROWS 2–4): give the player the check settings every serious
client ships, all game-agnostic in `games/shared/`, all riding facilities the engine already
exposes. ROW 2 — a 3-state error-check mode (off / on-demand / live) over the SAME pure
`findConflicts` derivation, un-gated from the `solveState==='failed'` gate; default on-demand, no
mistake-counter (§B3). ROW 3 — the existing `propagateBoard` engine marks gain a persistent opt-in
pin; default OFF (the NYT clutter lesson), no new compute. ROW 4 — a peer-unit wash over
`focusedPos`, pure derivation, reusing the crayon-blue selection tone. Both games identical wiring;
born-RED first; the full battery below.

Working tree carries the concurrent T4-W9 lane (HandDrawnGrid progress layer, index.css tokens,
`DifficultyTally` + `gradeTally` board wiring, `describeTally`) — its reds are demarcated (the sole
repo-wide eslint error is W9's untracked `__p2capture.mjs`, `no-undef` on `Buffer`), NOT this lane.

## What changed

- **New store** `src/games/shared/useAssists.ts` (the player's check settings, beside `useUserMarks`).
  ROW 2: `errorCheckMode` (off/on-demand/live, **default on-demand**), `checkArmed`, `proactiveCheck`
  (`live || on-demand&&armed`), `setErrorCheckMode`/`cycleErrorCheckMode`. A Check gesture arms a
  point-in-time snapshot; the next value mutation disarms it (a deep watch) — freezing the live
  derivation to an instant IS the on-demand↔live distinction. ROW 3: `candidatesPinned` (**default
  off**) + `setCandidatesPinned`/`toggleCandidates`. Both are standing preferences (survive a board
  swap); only `checkArmed` is board-state. Closes over `values` alone — both games mount it identical.
- **New shared toggle** `src/games/shared/AssistSettings.vue` — two OptionSelector rows over the app's
  own segmented-control primitive (the scribble-underline grammar matches Marks/Size/Difficulty):
  **Check** (Off / Ask / Live) + **Candidates** (Off / On). Re-tapping **Ask** re-checks — OptionSelector
  emits on every click, so the on-demand trigger needs no separate button. `update:*` v-model seams;
  mounted in BOTH ControlPanels (mobile + desktop), each game.
- **ROW 2 — both boards**: the `conflicts` computed un-gated. `conflictsVisible = solveState==='failed'
  || proactiveErrorCheck`; the teacher's grade is ORed with the mode's proactive display, so the
  `'failed'` red pencil is untouched and default on-demand PRESERVES the born-RED behaviour exactly.
  Event-driven (a value mutation), never the boil beat — live adds ZERO idle paints (E7 invariant holds
  by construction). One new prop (`proactiveErrorCheck`) per board.
- **ROW 3 — both games**: a single marks-activation arbiter. `longPressPeek` mirrors the glimpse; a
  `syncMarks`-style union (`candidatesPinned || peekActive || longPressPeek`) is the sole `setMarksActive`
  caller, so a peek RELEASE never extinguishes a standing pin, and toggling the pin off never strips
  marks from under a live peek. No new compute — the existing `[values, boardGeneration]` refresh watch
  keeps the pinned candidates live as the board is written on.
- **ROW 4 — both boards + both cells**: `peerCells` — a pure derivation over `focusedPos` (row+col+box
  for sudoku; row+col for futoshiki's Latin square), gated on the board actually holding focus
  (`focusin`/`focusout` with a `relatedTarget` containment check) so a fresh load washes nothing; the
  focused cell is excluded (it keeps its own ghost). Each cell renders a `.cell-peer` wash on its OWN
  layer (crayon-blue 7%, behind the glyph, never the conflict/hint tiers).

## Gate rows: born-RED → close

| gate | born-RED (base SHA) | close |
|---|---|---|
| **error-check mode** (born RED) | conflicts fire only when `solveState==='failed'` (`SudokuBoard.vue:185`) — no live mode, no toggle; grep `errorCheckMode\|proactiveCheck\|useAssists` over `src` → 0 matches | a 3-state setting (off/on-demand/live) in `games/shared` over the SAME pure `findConflicts`; **default on-demand**; NO mistake-counter/hearts (§B3). Live red-ghosts as-you-go; on-demand snapshots on Ask + disarms on edit; off suppresses the proactive display (the grade still grades). DELTA banked. |
| **persistent candidates** (born RED) | `propagateBoard` marks show only while peek is held (`usePencilMarks.ts`) | a persistent, opt-in pin un-gates the engine marks; **default OFF** (NYT clutter lesson). No new compute — the arbiter holds `marksActive` on; peek behaviour unchanged. π banked. |
| **peer highlight** (born RED) | selection highlights no related unit (only conflict/reveal tints) | a faint crayon-blue wash over the focused cell's row/col/box (sudoku) or row/col (futoshiki), pure over `focusedPos`, both games; nothing on load (focus-gated). π banked. |
| **game-agnostic** | store + toggle absent | every facility in `web/frontend/src/games/shared/` (`useAssists.ts`, `AssistSettings.vue`); identical wiring to both boards + both games + both ControlPanels — no second implementation. |
| **B3 design law** | — | no mistake-counter, no hearts, no lives, no 3-strikes; the error-check mode defaults to on-demand and off is promoted as skill-building. The engagement stack is untouched. |

## π / DELTA (the facilities are visible)

- **DELTA (error-check live)** — `crops/pi-live-error-check.png`: a cleared board carrying a plain
  row-0 duplicate (two `5`s) red-ghosted as-you-go in **live** mode — no Solve pressed. Before: the
  board accepts the duplicate silently under the default on-demand-unarmed cadence (the runtime drive
  asserts 0 `.is-invalid` before the Live flip, ≥2 after). One pair banked.
- **π (peer highlight)** — `crops/pi-peer-unit-wash.png`: a focused mid-board cell (its own blue ghost
  ring) with its row + column + 3×3 box lit in the faint crayon-blue peer wash — the selection's reach,
  distinct from the graphite hover and the red conflict tone. The born-RED capture is structurally
  impossible (no peer surface existed); on load the wash is absent (focus-gated).
- **π (persistent candidates)** — verified end-to-end (below): the engine's graphite marks stand on a
  fresh board while **Candidates → On**, no gesture held; **Off** clears them. Distinct from ROW 1's
  crayon-blue user marks (the engine's domains vs the player's notes).

## Battery (this lane green; concurrent-lane red demarcated)

```
npx vue-tsc -b --force   → PASS (clean; +1 board prop, +5 composable returns, +2 panel props each,
                            all typed through AssistSettings/useAssists)
npm run test:unit        → 238 passed (21 files); +14 new: useAssists (8, incl. arm-on-select /
                            disarm-on-edit + candidates-survive-edit) + SudokuCell/FutoshikiCell
                            peer-wash render (3 + 3)
npm run lint:eslint      → my 17 changed files CLEAN (scoped eslint exit 0); sole repo-wide error is
                            W9's untracked __p2capture.mjs (no-undef 'Buffer') — NOT this lane
npm run lint:knip        → PASS (exit 0)
npx prettier --check src → CLEAN (useAssists.ts + AssistSettings.vue + the two cell specs formatted
                            to style; the rest hand-matched)
npm run build            → ✓ vue-tsc -b && vite build, 186 modules, 185.34 kB index (66.98 kB gz),
                            built in 403ms
e2e verify (built dist)  → vite preview 127.0.0.1:4188 + a scratch playwright drive (removed after),
                            760×1040 (< lg, in-flow controls): 2 passed (1.8s). SUDOKU — Candidates
                            Off→On populates .pencil-marks persistently (no peek), Off clears; peer
                            wash 0 on load → exactly 20 on focus (row+col+box − self); live-check 0
                            invalid at default on-demand → ≥2 on Live, Ask snapshots then a
                            non-conflicting edit disarms to 0. FUTOSHIKI (twin) — peer 0 → 2·(n−1)
                            (Latin, no box); live-check 0 → ≥2. Both π/DELTA frames captured here.
```

## Notes / seam decisions

- **The `'failed'` gate is preserved, not replaced.** `conflictsVisible = failed || proactiveCheck`
  ORs the teacher's grade with the mode — so the default (on-demand, unarmed) is byte-identical to the
  born-RED behaviour (conflicts on the Solve grade only), and every existing conflict e2e passes
  untouched. The mode ADDS the proactive cadence; `off` suppresses only the proactive display.
- **on-demand ≠ live by a point-in-time snapshot.** `findConflicts` is a live reactive derivation; the
  on-demand distinction is `checkArmed` — a Check arms it, the next value mutation disarms it (re-check
  to confirm). No frozen-set machinery: the arbiter gates the live derivation on `armed`. Ask re-checks
  because OptionSelector emits on every click.
- **The idle-paint invariant holds by construction.** Live error-check re-derives on a value mutation
  (a keystroke), synchronously, off the boil beat — no rAF, no timer, zero idle paints added. The E7
  invariant is untouched even with live shipped enabled; default on-demand keeps it opt-in regardless.
- **One marks-activation arbiter.** ROW 3 folds the pin into the union with the answer-key peek and the
  long-press glimpse — a peek off never kills a standing pin, a pin off never kills a live peek.
  `setMarksActive` is idempotent, so re-asserting the union is free; the existing refresh watch keeps
  the pinned candidates live on every edit.
- **The peer wash is the selection's reach, not a second focus tone.** Crayon-blue 7% fill (the
  selection family, binding to the blue focus ghost), its own `.cell-peer` layer behind the glyph —
  never the graphite hover ring or the teacher-red conflict/hint tiers. Instant like the ghost (no
  fade), so arrowing reads crisp; focus-gated so a fresh load shows nothing.
- **Not this lane** (M1's rows): editable user marks (ROW 1). **Deferred** (other lanes/rows): ROW 5
  attribution parity + localized fetch, ROW 6 B3 non-goal retirements.
```

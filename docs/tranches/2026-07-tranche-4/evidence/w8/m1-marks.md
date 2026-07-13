# M1 — editable user pencil marks (corner/center) · T4-W8 ROW 1 (A1 + A8)

**Lane M1 of T4-W8.** Charge (spec ROW 1): give the player a place to reason on the board — a
game-agnostic **user-mark store** in `games/shared/`, a **pencil-mode toggle**, **corner vs
center** placement (Snyder), the user marks **distinct in store AND render** from the engine's
peek marks (the solver's domains vs the player's notes — never colliding). One component, two
placement slots; identical wiring both games; born-RED first; mobile marks entry rides the FROZEN
T4-WM native entry (mode toggle only — no second input surface). Text-first; the battery below.

Working tree carries the concurrent T4-W9 lane (HandDrawnGrid progress layer, index.css tokens,
board prop wiring) — its reds are demarcated (the sole repo-wide eslint error is W9's untracked
`w9-golden.mjs`, `no-undef` on `process`), NOT this lane.

## What changed

- **New store** `src/games/shared/useUserMarks.ts` (the player's notes) — deliberately its OWN
  store beside `usePencilMarks.ts` (the engine's peek marks): `pencilMode` (off/corner/center),
  `cornerMarks`/`centerMarks` (position→sorted-digits, one map per slot), `toggleUserMark(pos,
  value)` (symmetric with `update`: a digit toggles in the active slot, `0` erases both slots),
  `setPencilMode`/`cyclePencilMode`, `clearUserMarks`. `boardGeneration` voids the notes
  (clear/randomize/size-swap); the mode survives. Closes over nothing but `boardGeneration` — both
  games mount the identical thing.
- **New shared toggle** `src/games/shared/PencilModeToggle.vue` — Normal/Corner/Center over the
  app's own OptionSelector primitive (the scribble-underline grammar matches Size/Difficulty). One
  component, `update:mode` v-model seam; mounted in BOTH ControlPanels (mobile + desktop).
- **Both cells** (`SudokuCell.vue`, `FutoshikiCell.vue`, D16 twins): pencil mode reinterprets the
  FROZEN native input — while a slot is armed AND the cell is empty a digit emits `mark` (not
  `update`) and clears the input, Backspace emits `mark(pos,0)`; Normal mode is byte-identical.
  Two render layers in their OWN classes (`.user-corner-marks` 3×3 Snyder grid, `.user-center-marks`
  centred row), crayon-blue — never the engine's `.pencil-marks` (the e2e counts that class).
- **Both boards** + **both games** + **both ControlPanels**: identical prop/emit wiring
  (`cornerMarks`/`centerMarks`/`pencilMode` down, `mark`/`cyclePencilMode`/`update:pencilMode` up);
  bare-**P** cycles the mode in each board keydown (sibling case, disjoint from H/Z/K);
  `KeyboardLegend` gains the `P pencil` row (shared chrome, both games).

## Gate rows: born-RED → close

| gate | born-RED (base SHA) | close |
|---|---|---|
| **editable marks** | `usePencilMarks.ts:1-30` marks are engine-domains-only, non-editable, peek-gated (`SudokuCell.vue:142-165`) — the player cannot author a note; grep `useUserMarks\|pencilMode\|cornerMarks` over `src` → **0 matches** | user-mark store in `games/shared/`; pencil-mode toggle (Normal/Corner/Center); corner AND center placement; user marks a DIFFERENT tone (crayon-blue) + placement (corners / centred row) + class (`.user-*-marks`, never `.pencil-marks`) than the engine peek marks. π captured (below). |
| **game-agnostic** | store + toggle absent | both facilities land in `web/frontend/src/games/shared/` (`useUserMarks.ts`, `PencilModeToggle.vue`); the diff adds identical wiring to both boards + both games + both ControlPanels — no second implementation. |
| **collision (residual, PERMANENT)** | no test | `useUserMarks.test.ts` — a user note survives a peek toggle (activate→refresh→release→re-activate on the ENGINE `usePencilMarks` store) AND an engine-mark refresh **unchanged** (same ref identity + content). The two stores are separate by construction. |
| **mobile (WM native entry)** | — | the mark authoring rides the frozen native `<input>` (the WM seam: mode toggle only, no second input surface). Touch focuses a cell → a typed digit routes to `mark`; the cell unit tests pin the routing on both games; verified end-to-end (below). |

## π / DELTA (the facility is visible)

- **π (editable marks)** — `crops/pi-user-marks-cell.png`: one empty cell carrying user CORNER
  marks (1/2/5, hugging the corners in Snyder order) + CENTER marks (3/9, a centred row), all in
  crayon-blue — visibly distinct from any engine graphite peek mark. The born-RED capture is
  structurally impossible (no user-mark surface existed).
- **collision** — `crops/pi-collision-peek.png`: the SAME cell under a held K-peek — the engine's
  graphite peek marks fill the board's empty cells while the player's blue corner+center notes on
  the focused cell stand exactly where they were. Graphite domains vs blue notes, one cell, never
  colliding. (The shared MARKS toggle + the `P pencil` legend row are both visible in the frame.)

## Battery (this lane green; concurrent-lane red demarcated)

```
npx vue-tsc -b --force   → PASS (clean; the ControlPanel.test.ts twins updated for the new
                            required pencilMode prop)
npm run test:unit        → 216 passed (20 files); +21 new: useUserMarks (9, incl. the collision
                            gate) + SudokuCell/FutoshikiCell user-marks authoring & render (6 + 6)
npm run lint:eslint      → my 14 changed files CLEAN (scoped eslint exit 0); sole repo-wide error
                            is W9's untracked w9-golden.mjs (no-undef 'process') — NOT this lane
npm run lint:knip        → PASS (exit 0)
npx prettier --check src → my files CLEAN (useUserMarks.ts + PencilModeToggle.vue formatted to
                            style; the rest hand-matched)
npm run build            → ✓ vue-tsc -b && vite build, 180 modules, built in 368ms
e2e verify (built dist)  → vite preview 127.0.0.1:4188 + a scratch playwright drive (removed after):
                            1 passed (2.2s) — author corner (1,2,5) + center (3,9) via P + typed
                            digits, both slots render in their own classes, the value stays empty,
                            `.pencil-marks` absent on the cell; then K-peek → engine marks board-wide
                            WHILE the user note keeps 3 corner + 2 center glyphs; Escape clears the
                            engine marks, the note remains. Both π frames captured here.
```

## Notes / seam decisions

- **The FROZEN native-entry seam (WM record).** Pencil mode is a MODE over the one `<input>`, never
  a second surface (`impl-a-entry.md`): the cell reads `pencilMode` and routes the digit — the
  input shape, attribute set, and Normal-mode write path are byte-identical (the WM cell contracts
  stay green). A digit on a FILLED cell in pencil mode is ignored (no note on an occupied cell;
  switch to Normal to overwrite).
- **Non-destructive by design.** Notes are held independent of values; the render gates them on an
  empty cell — a placed digit HIDES its notes, erasing the digit brings them back (mistake-tolerant,
  the same gate the engine marks use). A fresh board (boardGeneration bump) voids them.
- **Distinct tone AND placement.** Engine peek marks: graphite, centred positional mini-grid,
  transient (held peek). User marks: crayon-blue, corners (Snyder) / centred row, persistent. The
  store separation is the collision gate; the tone+placement+class split is the render distinction.
- **Not this lane** (other W8 rows): error-check mode (ROW 2), persistent auto-candidates (ROW 3),
  peer-unit highlight (ROW 4), attribution parity (ROW 5), B3 non-goal retirements (ROW 6). ROW 1
  is the editable-marks store + its collision residual-risk row only.
```

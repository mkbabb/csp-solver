# T4-W6 · L3 — frontend surface: futoshiki difficulty axis + B-0 de-launder

Lane L3 of wave T4-W6 (generation truth). Scope: ROW 4 (B-0 margin de-launder in
SudokuBoard.vue) + the ROW-1 frontend threading of the new futoshiki difficulty axis
that L1 rebuilt into the wasm surface. No solver/wasm source touched (L1 owns that); the
regenerated 3-arg `pkg/` is consumed here.

Machine: darwin 25.4.0, aarch64. Node/npm per repo. Base lean wasm from L1: 87,152 B
(unchanged here — no wasm rebuild in this lane).

---

## What changed (frontend only)

- `src/games/futoshiki/types.ts` — new `export type Difficulty = "EASY"|"MEDIUM"|"HARD"`
  (own vocabulary, twin of `@games/sudoku/types`); the F3 "no difficulty" divergence note
  retired (the axis is now measurement-backed, T4-W6 GEN-2).
- `src/games/futoshiki/ControlPanel/constants.ts` — grew `difficultyOptions` (the twin of
  sudoku's: EASY/MEDIUM/HARD × crayon-green/orange/rose); header note updated.
- `src/games/futoshiki/solver/protocol.ts` — the `generate` request frame gains
  `difficulty: number` (FutoshikiDifficulty ordinal 0/1/2). No new grammar — the same
  shared W4 transport (`@games/shared/solver/transport`) carries it, exactly as sudoku's
  generate frame carries its ordinal.
- `src/games/futoshiki/solver/solver.worker.ts` — imports `type FutoshikiDifficulty`,
  passes `generateFutoshiki(boardSize, difficulty as FutoshikiDifficulty, seed)` (3-arg,
  twin of the sudoku worker's re-narrow).
- `src/games/futoshiki/solver/useSolver.ts` — `DIFFICULTY_ORDINAL` map (twin of sudoku's);
  `getRandomBoard(boardSize, difficulty)` threads the ordinal onto the wire.
- `src/games/futoshiki/composables/useFutoshiki.ts` — new `difficulty` ref (default EASY),
  passed to `getRandomBoard`, exposed on the return. Runtime-only: NOT threaded through
  `?difficulty=`/localStorage (see Outstanding) — the twin of sudoku's re-deal-on-next-
  Randomize behavior (a difficulty switch does not itself re-deal).
- `src/games/futoshiki/ControlPanel/ControlPanel.vue` — grew the difficulty selector on
  both layouts: desktop adds the `<hr>` + Difficulty section; mobile grows the two-tab
  Board-Size / Difficulty switcher (`expandedPanel`, value-labels, `.mobile-heading-btn`
  /`.heading-value`/`.is-active` + `.crayon-*` scoped CSS) — all mirrored 1:1 from the
  sudoku panel. New `difficulty` prop + `update:difficulty` emit.
- `src/games/futoshiki/FutoshikiGame.vue` — both ControlPanel instances now bind
  `:difficulty` + `@update:difficulty` to `futoshiki.difficulty`.
- `src/games/futoshiki/ControlPanel/ControlPanel.test.ts` — mount defaults gain
  `difficulty: "EASY"` (the new required prop).
- `src/games/sudoku/SudokuBoard/SudokuBoard.vue` — **ROW 4 B-0**: `freshBoardCopy` re-voiced
  request-not-measurement + the `difficulty` prop doc updated.

FutoshikiBoard.vue was NOT touched: its `freshBoardCopy` reads `a fresh 5×5` and never
carried the laundered tier phrasing, so per the spec's "cure it identically **if so**"
there is nothing to de-launder there (adding a tier would be the opposite of B-0).

---

## Gate — B-0 de-launder (born RED → GREEN)

Born RED at base SHA — `SudokuBoard.vue` `freshBoardCopy` stated the bucket as a fact:

```
`a fresh ${boardSize}×${boardSize}${difficultyWord ? ", " + difficultyWord : ""}`
  → "a fresh 9×9, medium"          ← the bucket asserted as measured
```

After — request voice, measurement never claimed:

```
fresh   = `a fresh ${boardSize}×${boardSize}`
request = difficultyWord ? ` — you asked for ${difficultyWord}` : ""
  medium board   → "a fresh 9×9 — you asked for medium"
  ungraded board → "a fresh 9×9"     (no difficulty prop: restored permalink / hand-typed)
  corrupt link   → "this shared link couldn't be read — a fresh 9×9 — you asked for medium"
```

Re-anchored off `measure_difficulty` semantics per the spec (r3 kill-list #4): the copy
cites the *request*, not the `#[cfg(debug_assertions)]` debug band; the tally slot (W9-B1)
stays "ungraded" until W7's engine supplies a defensible live grade. DELTA banked as the
before/after string above (the margin is not a goldened surface — no pixel baseline).

## Gate — futoshiki difficulty axis, frontend threading (born RED → GREEN)

Born RED — the panel offered size only; `generateFutoshiki` took no difficulty at any FE
layer. After — π captured live against the built dist (banked PNGs in this dir):

```
$ node capture-pi.mjs   (playwright, DPR2, PRM, ?game=futoshiki)
difficulty options rendered: ["4×4","5×5","6×6","7×7","Easy","Medium","Hard"]
```

- `pi-futoshiki-panel-boardsize.png` — the Board-Size face (born-RED parity: size only).
- `pi-futoshiki-panel-difficulty.png` — the Difficulty face: three tiers Easy/Medium/Hard,
  the DIFFICULTY heading in crayon-green (tracks the EASY selection), the UI-12 "5×5" value
  under the inactive Board-Size tab. Full parity with the sudoku panel idiom.

The axis's native/wasm proof (three tiers, unique 30/30, givens strictly decreasing) is
L1's — banked at `l1-futoshiki-axis.md`; this lane only threads the wire into the UI.

---

## Frontend battery (verbatim)

```
npx vue-tsc -b --force   → RED, 6× TS2554, ALL in src/games/shared/useLongPress.test.ts
                            (WM's UNTRACKED in-flight file — `git status` shows `?? …`).
                            ZERO errors in any L3 file. (grep of the full log: 0 hits on
                            futoshiki|SudokuBoard|sudoku/types|ControlPanel|solver/*).
npm run test:unit        → GREEN, 15 files / 133 tests pass (incl. useLongPress at runtime —
                            its defect is type-only, so vitest/esbuild is unaffected).
npm run lint:eslint      → GREEN (eslint ., exit 0).
npm run lint:knip        → GREEN (exit 0; new exports difficultyOptions/Difficulty consumed).
npx prettier --check src/→ GREEN (exit 0).
npm run build            → RED at the `vue-tsc -b` step (same WM useLongPress.test.ts).
                            `npx vite build` (bundle only) → GREEN: L3 source compiles +
                            bundles clean (dist emitted, both solver.worker chunks + the
                            FutoshikiGame chunk build).
```

Golden suite (darwin, per the wave's π/DELTA instruction), against the built dist on an
ephemeral port (:5199 — never :3000/:3001):

```
$ PLAYWRIGHT_BASE_URL=http://127.0.0.1:5199 npx playwright test --config playwright-golden.config.ts
  4 passed (logo-light, toggle-crest-dark, cell-light, grid-corner-light)
```

No golden moved — none of the four captures is the futoshiki panel or the sudoku margin, so
no re-baseline is warranted (no darwin `--update-snapshots`, no linux re-mint owed).

---

## Outstanding (for the team lead)

- **vue-tsc / build RED is WM's, not L3's**: the 6 TS2554 errors are entirely in the
  concurrent T4-WM lane's UNTRACKED `src/games/shared/useLongPress.{ts,test.ts}` (a
  signature/callsite mismatch mid-flight). L3 files are clean; do not attribute this red to
  this lane. It clears when WM's file lands consistent.
- **Futoshiki difficulty is runtime-only** (deliberate, in-scope minimum): unlike sudoku's,
  it is not persisted to `?difficulty=`/localStorage — the wave named constants + worker
  protocol + useFutoshiki, not the futoshiki `useUrlState` (which stays size-only, F5). So
  a reload resets to EASY while `board_size` persists — a mild sudoku↔futoshiki asymmetry.
  Full URL/persistence threading (schema + `useUrlState.test.ts`) is a follow-up decision
  the lead owns; it was left out to keep the edit surgical under the concurrent WM edit.
- **FutoshikiBoard margin stays silent on difficulty**: per "cure it **if so**" it was not
  laundered, so it was not touched. If the product later wants futoshiki's margin to also
  speak the request voice ("a fresh 5×5 — you asked for medium"), that is a new addition,
  not a B-0 cure — flag for W9.

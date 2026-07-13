# T4-W7 · lane E3 — the hint UX + the honest grade signature (the design lane)

**Rows**: T4-W7 §"The hint UX — the answer-reveal hint dies" + §"The honest difficulty grade — displayed via W9-B1" + the π/DELTA rows. The answer-reveal hint (a digit copied from the solved key, no reasoning) is retired; the hint now NAMES the cheapest human deduction and highlights its `becauseCells` before inking, and the dealt board's margin carries a MEASURED difficulty signature in place of W6's opaque bucket word. **Base**: `3b587b86`. **Stamp**: MacBook Pro, macOS 26.4.1 (25E253), 2026-07-13; node v26.0.0 / npm 11.12.1.

Builds on lanes E1 (the engine core: `findStep`/`gradeBoard`/`fillAllForced` + the sudoku adapter) and E2 (the futoshiki adapter + inequality rungs). This lane owns the UX + the deal-time wiring, and adds one pure engine helper (`findHint`) + the shared voice (`techniqueVoice.ts`).

## The gate rows — born RED → GREEN

| Gate | Born-RED at base `3b587b86` | Now |
|---|---|---|
| **hint names the technique** | `hintCell` revealed the focused cell's digit from the peek cache with **no name** — the header comment is explicit: *"the hint IS a one-cell solve reveal"* (`useSudoku.ts`; futoshiki twin `useFutoshiki.ts`). No reasoning, no `becauseCells`, one press. | **GREEN** — FIRST press names the cheapest single in the margin (*"naked single — only 5 fits here"* / *"hidden single — 7 goes nowhere else in this box"*) and lights its `becauseCells` in the peek-laminate tone; only the SECOND press inks the digit through the EXISTING reveal draw-in. Both games, one grammar. |
| **hint-UX surface exists** | `git grep "is-because\|formatHintNote\|hintReasoning\|becauseCells"` over `web/frontend/src` at base = **empty** (0 files). | **GREEN** — `hintReasoning` two-press state in both composables (4 files reference it), the `is-because` laminate wash in both cells + boards (4 files), `formatHintNote` in the shared voice. |
| **grade replaces the bucket** | The margin said *"a fresh 9×9 — you asked for medium"* (W6 B-0 de-launder: a REQUEST, never a measurement — the bake-time backtrack proxy was never shown). | **GREEN** — the dealt board is graded at deal (`gradeSudoku`/`gradeFutoshiki`), `hardestTechnique` held on game state; the fresh-board margin reads *"a fresh 9×9 — singles only"* / *"— needs an X-wing"* once graded. W6's request voice stays the pre-grade/restore fallback. |
| **futoshiki parity** | The futoshiki hint was the same name-less reveal twin; the futoshiki margin had **no** difficulty word at all (F3 — no difficulty axis threaded). | **GREEN** — the same `findHint`/grade drives futoshiki off the shared engine (rows/cols houses, no second implementation); its margin now carries *"a fresh 5×5 — singles only"* and the named singles hint. |
| **mobile two-press** | The hint button existed (T4-WM) but one tap = one reveal, no name. | **GREEN** — the two-press rides the same emit path, so by touch the first tap names + highlights and the second inks; the long-press/peek gestures are untouched (asserted in the mobile e2e). |

## The two-press hint — one grammar, zero new timing constants

The hint is a two-press transaction on `hintReasoning` (a `HintResult | null` held in each composable):

- **First press** → `findHint(adapter, values, focusedCell)` returns the cheapest single that PLACES a digit (naked/hidden), preferring the focused cell when it is itself forced, else the cheapest single anywhere. It arms `hintReasoning`; the board watches the prop, writes the technique name to the margin via the EXISTING 250 ms `note-write-in` wipe, and passes `becauseCells` to the cells as `is-because`.
- **Second press** → inks `hintReasoning.value` through the EXISTING reveal path (`animatingCells` → the 350 ms `glyph` draw-in, solver-ink tone). The transaction closes; the highlight lifts.
- Any board mutation (edit/undo/redo/clear/deal) disarms a stale armed hint. When no single is available (the board needs an elimination first), it degrades honestly to the answer-key reveal, named `reveal`, so the two-press shape holds.

The `becauseCells` highlight is a dedicated `is-because` **laminate wash** — a translucent teacher-red square on its OWN layer, behind the glyph and the focus ghost, faded in on the EXISTING `marks-fade-in` (250 ms) cadence. It composes with a filled house cell's digit and the keyboard-focus blue ring rather than colliding with the ghost's focus/invalid tiers, so the peek-laminate tone shows **even on the very cell you focused to ask** (the natural naked-single flow). No new timing constant is introduced (`pencilConfig` untouched; the two reused clocks are `note-write-in`/`glyph` draw-in and `marks-fade-in`).

Placement (the reveal draw-in) comes only from singles, so `findHint` never surfaces an elimination technique — the inequality rungs (E2) grade but never place, so they never appear as the placement hint.

## The honest grade signature — wire the data + the margin, no tally UI (W9-B1 owns display)

`gradeSudoku`/`gradeFutoshiki` run to completion at deal (synchronous, pure TS, no search, over self-computed candidates — never the GAC/AC masks). `hardestTechnique` + `gradeSolved` are held on the game state; `gradeSignature = formatGradeSignature(hardestTechnique, gradeSolved)` feeds the fresh-board margin. W9-B1 reads `hardestTechnique` for the five-tier tally; this lane builds **no tally UI**, only the data + the margin signature. `formatGradeSignature` is honest at the top: a board the R1–R3 ladder cannot finish reads *"beyond these techniques"* (never under-reported as a single).

## π / DELTA captures

Text-first; small crops (each < 150 KB) against the BUILT DIST (`vite preview :4188`, `PLAYWRIGHT_BASE_URL`). Fixed seeds: the sudoku hint pair rides a pinned `?board=` (row 0 blank over the canonical solved 9×9 — cell 0 is a naked single = 5, deterministic); the grade + futoshiki crops ride a fresh deal.

### π (named hint) — born-RED (reveal, no name) → after (becauseCells + margin name)

| | before (base `3b587b86`) | after |
|---|---|---|
| sudoku | revealed digit, no name (`hintCell` = one-cell solve reveal) | margin **"naked single — only 5 fits here"**, `becauseCells=[0]` lit — `sudoku-hint-named.png` (90.7 KB) |
| futoshiki | revealed digit, no name (twin) | margin **"naked single — only 2 fits here"**, `becauseCells` lit — `futoshiki-hint-named.png` (45.0 KB) |

### DELTA (grade signature) — opaque bucket → measured signature

Headless over E1/E2's own fixtures (deterministic):

| board | before | after (measured) |
|---|---|---|
| sudoku singles-board | "you asked for medium" | **"a fresh 9×9 — singles only"** (hardest = naked-single, tier 1, solved) |
| sudoku X-wing-board | "you asked for hard" | **"a fresh 9×9 — needs an X-wing"** (hardest = x-wing, tier 3, solved) |
| futoshiki singles | "a fresh 5×5" (no difficulty word) | **"a fresh 5×5 — singles only"** (hardest = naked-single, tier 1, solved) |

Live crop of a fresh MEDIUM deal: `sudoku-grade-signature.png` (56.0 KB), margin **"a fresh 9×9 — singles only"**.

### DELTA (fill-forced) — headless (detector only; no button until W8)

`fillForcedSudoku` on the singles fixture: before **55 blanks** → sweep 1 fills **8** (3 naked + 5 hidden), **47 blanks remain** → a second sweep fills **9 more** (proof of no cascade in one sweep). Every placement lands on a previously-empty cell (`= true`). W7 owns this detector (`fillAllForced`); W8 wires the button.

## Battery — exit codes verbatim (BUILT DIST for all visual/e2e)

| Command | Exit | Note |
|---|---|---|
| `npx vue-tsc -b --force` | **0** | clean — the two new props + `HintResult`/`TechniqueId` typecheck through both games |
| `npm run test:unit` (vitest run) | **0** | 19 files / **195 tests** (was 133 at E4) — adds `findHint` core units, `hintSudoku`/`hintFutoshiki` wrapper units, and `techniqueVoice.test.ts` |
| `npm run lint:eslint` | **0** | clean (no `@pencil` import leaked into the composables — the voice lives in `@games/shared`) |
| `npm run lint:knip` | **0** | clean — every new export is consumed |
| `npx prettier --check src/` | **0** | all matched files clean |
| `npm run build` | **0** | 173 modules; index 171.8 kB / gzip 63.3 kB |
| default e2e (`playwright test`, base = dist :4188) | **0** | **61 passed** — incl. the recut `hint: first H names the technique + highlights, second H inks the digit` and the new `hint two-press by touch (T4-W7)` |
| goldens (`test:golden`, base = dist :4188) | **0** | **4 passed** — no committed golden moved (the hint is state-gated + the signature is margin text; neither is in the 4 golden crops), so **no darwin re-baseline** was needed and **no linux flag** is outstanding |

## Scope boundaries held

- **Zero wasm/Rust (R1–R3).** This lane touches only `web/frontend/src/games/**` (+ the two e2e specs) and the evidence dir. No `csp-solver/`, no `wasm/`, no `scripts/sync-csp-solver-vendor.sh`, no release. (E4's `nodes_explored`/`propagations` getters remain the wave's sole flagged wasm touch, unrelated to this lane.)
- **One grammar.** `pencilConfig.ts` is untouched — the hint reuses `note-write-in`/`glyph` draw-in + `marks-fade-in`; no new timing constant.
- **No tally UI.** The grade data (`hardestTechnique`) is on the game state and the margin signature is wired; the five-tier tally display is W9-B1's.
- **No commit.** Team-lead commits; the `technique/` dirs + `techniqueEngine.ts`/`techniqueVoice.ts` are new, the composables/boards/cells/games/e2e are modified.

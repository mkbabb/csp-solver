# R2 · Five-game duplication matrix

MEASUREMENT ONLY. No design, no proposals.

- **Tree** `web/frontend/src/games` @ `71456713d9f7361af80f09e1a456fc9787507e78` (2026-08-01 04:23:26 -0400)
- **Method** — normalized LOC = source with block comments, `<!-- -->`, leading-`//` lines, leading-`*` continuation lines and blanks stripped; family tokens `(sudoku|futoshiki|thermo|killer|kenken)` case-insensitively rewritten to `X` before comparison.
- **Divergence %** = `(|A|+|B| − 2·matched) / (|A|+|B|)` over normalized lines, `difflib.SequenceMatcher(autojunk=False)`. 0 % = identical after name-neutralization.
- **Bands** TWIN < 5 % · NEAR 5–20 % · DIVERGED > 20 %.
- Harnesses: `/private/tmp/…/scratchpad/dupmatrix.py`, `absorb2.py`, `residue.py` (scratchpad, not committed).

---

## §0 — LOC per class per game

Raw LOC (`wc -l`) / normalized LOC in parentheses. `—` = class absent for that game.

| Class | sudoku | futoshiki | thermo | killer | kenken | Σ raw | Σ norm |
|---|---|---|---|---|---|---|---|
| `Game.vue` | 221 (143) | 178 (123) | 155 (119) | 145 (119) | 144 (117) | **843** | 621 |
| `Board(.vue)` | 218 (176) | 317 (257) | 255 (198) | 255 (198) | 222 (167) | **1267** | 996 |
| `ControlPanel/constants` | 19 (15) | 31 (16) | — | — | 31 (15) | **81** | 46 |
| `solver/useSolver` | 192 (115) | 193 (135) | 151 (123) | 151 (123) | 152 (123) | **839** | 619 |
| `solver/solver.worker` | 144 (87) | 144 (101) | 117 (99) | 114 (96) | 115 (97) | **634** | 480 |
| `solver/protocol` | 75 (59) | 82 (62) | 81 (61) | 81 (61) | 83 (62) | **402** | 305 |
| `composables/*UrlState` | 302 (218) | 372 (258) | 108 (74) | 109 (74) | 109 (74) | **1000** | 698 |
| `game.ts` | 47 (33) | 49 (34) | 53 (35) | 54 (35) | 56 (35) | **259** | 172 |
| `types.ts` | 14 (2) | 39 (4) | 15 (1) | 20 (4) | 28 (6) | **116** | 17 |
| `composables/use<Game>` | 75 (36) | 99 (55) | 82 (45) | 84 (46) | 107 (64) | **447** | 246 |
| `Poster.vue` | 36 (23) | 136 (110) | 42 (28) | 38 (24) | 45 (32) | **297** | 217 |
| cell/furniture ¹ | 294 (225) | 293 (227) | 130 (94) | 180 (125) | 185 (127) | **1082** | 798 |
| `solver/*Wire` | — | — | 35 (23) | 38 (26) | 47 (30) | **120** | 79 |
| **Total measured** | 1637 | 1833 | 1224 | 1269 | 1324 | **7387** | **5294** |

¹ cell/furniture = the per-game overlay/cell component: `SudokuCell.vue`, `FutoshikiCell.vue`, `ThermoTube.vue`, `KillerCage.vue`, `KenKenCage.vue`. Not the same species across all five — see §2.11.

Comment + blank overhead across the measured surface: 7387 − 5294 = **2093 lines (28.3 %)**.

Out of scope for this matrix but in the tree: `futoshiki/FutoshikiCaret.vue` (75), `sudoku/data/templates.ts` (7), the six `technique/` files, and every `*.test.ts`.

---

## §1 — Pairwise normalized divergence (all classes, all pairs)

Cell = divergence %. **Bold** = TWIN, *italic* = NEAR, plain = DIVERGED.
Column order: S–F, S–T, S–Ki, S–Ke, F–T, F–Ki, F–Ke, T–Ki, T–Ke, Ki–Ke
(S=sudoku, F=futoshiki, T=thermo, Ki=killer, Ke=kenken).

| Class | S–F | S–T | S–Ki | S–Ke | F–T | F–Ki | F–Ke | T–Ki | T–Ke | Ki–Ke |
|---|---|---|---|---|---|---|---|---|---|---|
| `Game.vue` | *12.0* | *18.3* | *18.3* | 20.0 | *13.2* | *13.2* | *11.7* | **0.8** | **2.5** | **1.7** |
| `Board` | 35.8 | *6.4* | *6.4* | 20.1 | 33.2 | 33.2 | 26.9 | **2.0** | *14.5* | *12.3* |
| `CP/constants` | 29.0 | — | — | 20.0 | — | — | *9.7* | — | — | — |
| `useSolver` | 32.8 | 20.2 | 20.2 | 30.3 | 25.6 | 25.6 | *14.7* | *9.8* | 21.1 | *12.2* |
| `solver.worker` | *17.0* | *11.8* | *10.4* | *14.1* | *14.0* | *15.7* | *12.1* | *6.7* | *11.2* | *5.7* |
| `protocol` | *12.4* | *5.0* | *5.0* | *14.0* | *15.4* | *15.4* | *6.5* | **4.9** | *15.4* | *10.6* |
| `UrlState` | 27.3 | 84.9 | 84.9 | 85.6 | 87.3 | 87.3 | 86.7 | **4.1** | *13.5* | *9.5* |
| `game.ts` | 31.3 | *17.6* | *17.6* | 29.4 | 36.2 | 36.2 | 21.7 | *11.4* | 28.6 | *17.1* |
| `types.ts` | 66.7 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 40.0 |
| `use<Game>` | 64.8 | 38.3 | 39.0 | 70.0 | 52.0 | 50.5 | 36.1 | 25.3 | 54.1 | 43.6 |
| `Poster.vue` | 91.0 | 76.5 | 74.5 | 78.2 | 87.0 | 86.6 | 87.3 | 57.7 | 70.0 | 53.6 |
| cell/furniture | **2.7** | 90.6 | 93.1 | 93.2 | 90.0 | 92.6 | 92.7 | 55.3 | 55.7 | *7.9* |
| `*Wire` | — | — | — | — | — | — | — | 55.1 | 58.5 | 28.6 |

Band tally over the 118 measured pairs: **TWIN 8 · NEAR 43 · DIVERGED 67**.

Two sub-families run through the whole matrix and explain most of the DIVERGED mass:

- **SUDOKU-GEOMETRY** `{sudoku, thermo, killer}` — subgrid `n`, `boardSizeOf: n**2`, box-band peers, `gradeSudoku`.
- **LATIN** `{futoshiki, kenken}` — `boardSize` directly, `boardSizeOf: n`, no box band, `gradeFutoshiki`.

`UrlState` carries a *third*, orthogonal split: **FULL-CODEC** `{sudoku, futoshiki}` (real `?board=` encode/decode) vs **V1-STUB** `{thermo, killer, kenken}` (`writeShareUrl` a documented no-op).

---

## §2 — Per-pair classification, with cause

Only DIVERGED pairs carry a FOR-REASON / BY-DRIFT verdict. NEAR pairs are annotated where the residual is not purely a name.

### 2.1 `Game.vue` — TWIN×3, NEAR×6, DIVERGED×1

- **T–Ki 0.8 %, Ki–Ke 1.7 %, T–Ke 2.5 % — TWIN.** The three lazy scenes are one file. The `useAnswerKeyPeek` + `longPressPeek` union block, the `watch(candidatesPinned…)`, `onShare`, `onCandidatePeekStart/End`, and the `GameControlPanel` mount are name-only copies (`ThermoGame.vue:44-75` ≡ `KillerGame.vue:36-65` ≡ `KenKenGame.vue:37-66`).
- **S–Ke 20.0 % — DIVERGED, mixed.**
  - FOR-REASON: `SudokuGame.vue:57-73` builds `sections` from `./ControlPanel/constants` instead of `sudokuGame.options(model)`. Cause is documented in-file at `SudokuGame.vue:38-56` — sudoku is the EAGER game, `registry.ts` statically imports both the scene and `./game`, so importing `./game` here closes a cycle that dies in TDZ at boot. Reproduced in-browser, re-exercised on real MobileSafari.
  - FOR-REASON: `SudokuGame.vue:84-88` (`onMounted → prewarm()` via `requestIdleCallback`) — present in sudoku and futoshiki (`FutoshikiGame.vue:47-51`), absent in thermo/killer/kenken because those `useSolver`s deliberately don't export `prewarm` (`thermo/solver/useSolver.ts:46-49`, same note verbatim in killer/kenken).
  - BY-DRIFT: the `GameControlPanel` attribute order. `{sudoku, futoshiki}` order `loading, is-dirty, pencil-mode, error-check-mode, proactive-check, candidates-pinned, mobile, grade-tally` with `:share` wedged mid-handlers; `{thermo, killer, kenken}` order `pencil-mode, candidates-pinned, loading, is-dirty, mobile, grade-tally, error-check-mode, proactive-check, share`. Same 8 props, same 12 handlers, different sequence. Zero semantic content.
- **S–T / S–Ki 18.3 %, F–T / F–Ki 13.2 % — NEAR.** Residual is the board-props block: `:size` + `:difficulty` present for `{sudoku, killer, thermo}`, absent for `{futoshiki, kenken}`; the clue prop is `:inequalities` / `:thermometers` / `:cages` / (none). `:subgrid-size` on the laminate = `size` for `{sudoku, killer, thermo}`, `boardSize` for `{futoshiki, kenken}`. FOR-REASON (geometry).

### 2.2 `Board` — TWIN×1, NEAR×3, DIVERGED×6

- **T–Ki 2.0 % — TWIN.** `diff` after name-neutralization is **13 changed lines, 11 of them inside comments**. The two live substantive lines are `import XTube from "./XTube/XTube.vue"` vs `import XCage`, and the overlay-slot element (`<XTube :thermometers…>` vs `<XCage :cages…>`).
- **S–T 6.4 %, S–Ki 6.4 % — NEAR.** Killer/Thermo reuse `SudokuCell` by direct cross-game import (`KillerBoard.vue:14`, `ThermoBoard.vue:14` → `@games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue`) and copy the box-band `peersFn`, `DIFFICULTY_WORD`, `freshBoardCopy`, and `idleGradeHint` verbatim. Residual = the clue import + overlay slot + scoped layer CSS. FOR-REASON.
- **S–F 35.8 %, F–T / F–Ki 33.2 % — DIVERGED, FOR-REASON.** `FutoshikiBoard.vue` carries 101 normalized lines nothing else has: `caretDescriptors` (`:128-172`, the edge-midpoint fraction math + glyph rotation) and `constraintLabels` (`:175-198`, the a11y inequality folding). Genuine mechanic.
- **F–Ke 26.9 % — DIVERGED, FOR-REASON.** Same caret machinery vs KenKen's cage overlay; both are Latin-geometry (`findConflicts(values, boardSize)` with no `subgridSize`, `peersFn` with no box band). KenKen's residue is only 12 normalized lines.
- **S–Ke 20.1 %, T–Ke 14.5 %, Ki–Ke 12.3 %.** FOR-REASON — the box band. `SudokuBoard.vue:105-111` / `KillerBoard.vue:109-115` add the subgrid loop to `peersFn`; `KenKenBoard.vue` deletes it and comments the deletion. Plus the difficulty word (`DIFFICULTY_WORD` map + `freshBoardCopy`'s `you asked for` branch) present for `{sudoku, thermo, killer}`, absent for `{futoshiki, kenken}`.
- Byte-identical across all five (SHA over the block): the `defineEmits` surface `48fa3d289643`, the flourish provide `e99e20a0cccf`, and (mod names) `defineExpose({ hintFocusedCell: … })`.

### 2.3 `ControlPanel/constants` — NEAR×1, DIVERGED×2

- **`difficultyOptions` is byte-identical in all three files** — `sha1[0:12] = f9e17c23ce02` for `sudoku/ControlPanel/constants.ts:11-19`, `futoshiki/…:23-31`, `kenken/…:23-31`. 9 raw / 11 normalized lines × 3 copies. **BY-DRIFT** in the strictest sense: identical intent, identical text, three homes, each file's own header comment explaining that games never import each other.
- The size options genuinely differ (`2/3/4` subgrid roots vs `4..7` vs `4..6` board sides). FOR-REASON.
- thermo and killer ship no constants file — `thermo/game.ts:18` and `killer/game.ts:19` import sudoku's directly. That cross-game import is the counter-example to the "games never import each other" comment in the other three files.

### 2.4 `solver/useSolver` — NEAR×3, DIVERGED×7

- `toRecord` is byte-identical ×5 (`82412ac0756f`). `toFlat` is identical ×4 (`{sudoku, futoshiki, thermo, killer}`); kenken's is `toFlatBoard` with `boardSize*boardSize` instead of `(size*size)**2` — FOR-REASON (Latin geometry).
- `SolveResponse` interface body identical ×3 for `{thermo, killer, kenken}` (`08a0463a440f`); sudoku's and futoshiki's are the same 8 fields with doc-comments interleaved.
- The `createSolverTransport({ createWorker: new Worker(new URL("./solver.worker.ts", import.meta.url), {type:"module"}), tag: "<game>-solver" })` block is name-only ×5.
- **T–Ki 9.8 % — NEAR.** After name-neutralization the entire diff is comments plus the clue identifier (`thermometers`/`ThermoLine`/`encodeThermometers` ↔ `cages`/`KillerCage`/`encodeCages`). FOR-REASON.
- **S–F 32.8 %, S–Ke 30.3 % — DIVERGED, FOR-REASON.** Sudoku is the only game with a template bank (`TEMPLATE_BANK` marshalling, `useSolver.ts:106-109`); futoshiki carries `toFlatInequalities` + `toPairs` (16 lines); the Latin pair uses `boardSize` on the wire where the Sudoku family uses `n`.
- **BY-DRIFT component throughout:** the header doc-block is rewritten in each file with a different prose census of its siblings ("the twin of the Sudoku/Futoshiki useSolvers", "…/Thermo", "…/Thermo/Killer") — five hand-maintained lists of the other four games.

### 2.5 `solver/solver.worker` — NEAR×10, DIVERGED×0

The tightest class in the tree. `ensureInit` is byte-identical ×5 (`b6608ca40eab`); so are the `ping` case, the `default` unknown-kind throw, and the `catch { describeError }` tail. Divergence is confined to: the three wasm import identifiers, `req.n` vs `req.boardSize`, `SudokuDifficulty` vs `FutoshikiDifficulty`, the clue field on the generate/solve/propagate payloads, and the `postMessage` transfer list. All FOR-REASON.

### 2.6 `solver/protocol` — TWIN×1, NEAR×7, DIVERGED×2

Every file is the same three-member request union + three-member response union + `| PingRequest` / `| PingResponse | SolverErrorResponse`, composed off `@games/shared/solver/protocol`. **S–T / S–Ki 5.0 %** is the band boundary — sudoku's only extra is `templates: Uint32Array` on generate. The DIVERGED pairs (S–Ke 14.0 % is NEAR; only the S–F and T–Ke tails cross) come from `n` ↔ `boardSize` and clue-field naming. FOR-REASON. One **BY-DRIFT** artefact: sudoku's response union keeps three doc-comments (`:51-58`) that the other four dropped while keeping the identical fields.

### 2.7 `composables/*UrlState` — TWIN×1, NEAR×2, DIVERGED×7

Two files that share nothing structural with the other three.

- **FULL-CODEC pair (S–F, 27.3 %, 173 shared normalized lines of 476).** Both carry `STORAGE_KEY`, `VALID_SIZES`, `VALID_DIFFICULTIES`, `MAX_BOARD_PARAM_LEN = 4096`, `CODEC_VERSION = 1`, `VERSION_BYTE_FLOOR = 0x30`, `readCodecVersion`, `encodeBoard`, `decodeBoardParam`, `resolveInitialState`, `syncToUrl`, `writeBoardToUrl`, `dropBoardParam`, `persistBoard`, `clearPersistedBoard` — same names, same order, same constants. The divergence is the inequality payload inside the codec body and `size` ↔ `boardSize`. FOR-REASON for the codec body, **BY-DRIFT for the 3 lines of `randomDifficulty` (sudoku only, `:74`) and the differing default-difficulty handling** — same intent, different wording.
- **V1-STUB triple (T–Ki 4.1 % TWIN, Ki–Ke 9.5 %, T–Ke 13.5 %).** `thermo/composables/thermoUrlState.ts` and `killer/composables/killerUrlState.ts` are byte-identical from `persistBoard` to EOF after name-neutralization (`8fb12bd9c9f8`); kenken differs only by `size` → `boardSize` (`aad956abbf29`). All three have `syncToUrl`, `dropBoardParam`, `writeShareUrl` as empty-body no-ops (`thermoUrlState.ts:82,105,108`).
- **Cross-family pairs 84.9–87.3 % — DIVERGED, FOR-REASON.** The stub triple has no codec at all; comparing them to the codec pair is comparing different artefacts.

### 2.8 `game.ts` — NEAR×3, DIVERGED×7

Every file is `defineGame<Model, Cell, TClue>({ model, cellFurniture, clueFurniture, options, solverPayloads })`. The `options` array is structurally identical ×5: two sections, `{key, heading, ariaLabel, options, selected, onChange}`, the second section always `{key:"difficulty", heading:"Difficulty", options: difficultyOptions, selected: m.difficulty.value, onChange: (v) => (m.difficulty.value = v as Difficulty)}` — that 6-line difficulty section is **name-only identical ×5**. The `key: "size"/"boardSize"` split is FOR-REASON. The DIVERGED verdicts are almost entirely the header doc-block, which each file rewrites as a running census ("the third game", "the fourth game and first CONSUMER of CageSum", "the fifth game and second CONSUMER") — **BY-DRIFT**, ~10 comment lines per file that this matrix already strips.

### 2.9 `types.ts` — DIVERGED×10, no absorbable

17 normalized lines across five files; the rest is doc-block. Each file is 1–3 type declarations. `sudoku/types.ts:14` and `futoshiki/types.ts:18` are the same `export type { SolveState, SolveStats } from "../shared/types"` line. `Difficulty` is declared twice (`sudoku:10`, `futoshiki:39`) with byte-identical bodies `"EASY" | "MEDIUM" | "HARD"` — **BY-DRIFT**, and each file's comment explicitly argues against a third copy while itself being the second. The clue types (`ThermoLine`, `KillerCage`, `KenKenCage`/`KenKenOp`, `Inequality`) are FOR-REASON. `Ki–Ke 40 %` is the `{sum, cells}` vs `{op, target, cells}` shape.

### 2.10 `composables/use<Game>` — DIVERGED×10

Every file is the same shape — `const api = useSolver(); const initial = resolveInitialState(); const {…} = useGameState({ …20 domain slots… }); return {…}` — but the 20 slot values are per-game one-liners, so line-level matching is low even where structure is total.

- `NODE_BUDGET_BY_SIZE` + `nodeBudgetForSize` is **byte-identical ×3** for `{sudoku, thermo, killer}` (`7abc64aa6f7d`, `useSudoku.ts:34-41` ≡ `useThermo.ts:29-36` ≡ `useKiller.ts:30-37`). BY-DRIFT (identical table, three homes). futoshiki `{4:2M,5:4M,6:10M,7:20M}` and kenken `{4:2M,5:4M,6:10M}` are FOR-REASON (different board bands).
- `grade`/`solve`/`propagate`/`fillForced`/`hint` slots are name-only across the Sudoku family and across the Latin family; the family split (`gradeSudoku` vs `gradeFutoshiki(…, [])`) is FOR-REASON.
- `applyDealFurniture` / `resetFurniture` / `snapshotExtra` / `restoreExtra` / `restorePersistedFurniture` are one clue-shaped body each. kenken pays 3× for the `{op, target, cells:[...c.cells]}` deep copy repeated in all three (`useKenken.ts:74-94`) — **BY-DRIFT within one file**.

### 2.11 `Poster.vue` — DIVERGED×10

Not really one class. Each is `<PosterBoard :board-size :subgrid-size :values>` plus a canned data literal; the data literal is the file. Absorbable is the 9-line scaffold only. Two named facts:

- `FutoshikiPoster.vue` (110 normalized lines) re-implements the caret-descriptor math from `FutoshikiBoard.vue:128-172` — self-documented at `FutoshikiPoster.vue:33-35` ("the exact edge-midpoint fraction math the live board uses … reproduced for the canned set"). An **intra-game** duplicate, not cross-game; ~55 lines.
- The other four are 23–32 normalized lines each and effectively irreducible (canned puzzle data).

### 2.12 cell/furniture — TWIN×1, NEAR×1, DIVERGED×8

- **S–F 2.7 % — TWIN.** `SudokuCell.vue` and `FutoshikiCell.vue` are the same file: both are shells over `useGameCell` (`@games/shared/useGameCell`), 225/227 normalized lines with **220 shared**. The genuine divergence is 6 lines — `subgridSize` prop vs `constraintLabel` prop, `ariaSuffix: () => ""` vs `() => props.constraintLabel`, the marks-grid template (`repeat(${subgridSize})` vs `repeat(${markCols})` where `markCols = ceil(√boardSize)`), and `maxlength` (`boardSize >= 10 ? 3 : 2` vs constant `2`). FOR-REASON, but the delta is 6 lines carried on 2 × 293 raw lines.
- **Ki–Ke 7.9 % — NEAR.** `KillerCage.vue` and `KenKenCage.vue` share 116 of 252 normalized lines: the same cage-boundary path derivation, the same corner-cell selection (`smallest flat index`), the same scoped-CSS block modulo one class name (`.X-cage-sum` ↔ `.X-cage-target`). Divergence is the label (`{{ cage.sum }}` vs a computed `${target}${op}` with a singleton special-case) and `font-size` 0.26 ↔ 0.24. Mostly FOR-REASON; the 0.26/0.24 split and the duplicated theme-CSS quartet are **BY-DRIFT**.
- **All pairs touching `ThermoTube.vue` 55–91 % — DIVERGED, FOR-REASON.** A tube is not a cell and not a cage.

### 2.13 `solver/*Wire` — DIVERGED×3

`encode*`/`decode*` over a length-prefixed flat `Uint32Array`. The loop skeleton (`let len = 0; for … len += P + …; const buf = new Uint32Array(len); let i = 0; …` and the `while (i < flat.length) { const k = flat[i++]; … }` unpack) is structurally identical ×3; the prefix width differs (1 for thermo, 2 for killer, 3 for kenken) and kenken adds the `OP_TO_ORDINAL`/`ORDINAL_TO_OP` maps plus a truncation guard (`kenkenWire.ts:38`) the other two lack. FOR-REASON on the prefix, **BY-DRIFT on the missing guard** — same defensive intent, only one file has it. Killer has no `killerWire` counterpart to kenken's ordinal maps and no guard.

---

## §3 — (d)/(e) Absorbable vs irreducible, per class

Definitions used:

- **shell** = one retained copy of each absorbed line (what a shared module would hold).
- **removable** = duplicate copies destroyed. Tier 1 collapses lines present in ≥4 of 5 games (≥3 of 3 for the 3-game classes); Tier 2 collapses lines present in every member of a named sub-family and *not* already absorbed by Tier 1.
- **residue** = normalized lines a shell provably cannot absorb, per game.

All figures are **normalized** LOC. Multiply by ≈1.40 for raw-LOC impact (the measured comment/blank ratio).

| Class | Σ norm | shell | removable | residue | residue by game (S/F/T/Ki/Ke) |
|---|---|---|---|---|---|
| `Board` | 996 | 191 | **661** | 136 | 1 / 101 / 11 / 11 / 12 |
| `Game.vue` | 621 | 113 | **449** | 59 | 33 / 10 / 6 / 6 / 4 |
| `cell/furniture` | 798 | 319 | **370** | 108 | 5 / 6 / 77 / 9 / 11 |
| `useSolver` | 619 | 96 | **364** | 151 | 31 / 39 / 27 / 27 / 27 |
| `UrlState` | 698 | 205 | **335** | 158 | 44 / 84 / 10 / 10 / 10 |
| `solver.worker` | 480 | 84 | **328** | 66 | 8 / 18 / 15 / 12 / 13 |
| `protocol` | 305 | 52 | **208** | 45 | 7 / 10 / 9 / 9 / 10 |
| `game.ts` | 172 | 23 | **91** | 58 | 10 / 12 / 12 / 12 / 12 |
| `use<Game>` | 246 | 23 | **84** | 139 | 21 / 32 / 22 / 23 / 41 |
| `Poster.vue` | 217 | 9 | **32** | 175 | 17 / 101 / 19 / 15 / 23 |
| `CP/constants` | 46 | 11 | **22** | 13 | 4 / 5 / — / — / 4 |
| `*Wire` | 79 | 11 | **22** | 46 | — / — / 12 / 15 / 19 |
| `types.ts` | 17 | 0 | **0** | 17 | 2 / 4 / 1 / 4 / 6 |
| **Total** | **5294** | **1137** | **2966** | **1171** |  |

Identity check: 1137 + 2966 + 1171 = 5294. ✔

**Per-game residue total** — sudoku 183 · futoshiki 422 · thermo 221 · killer 153 · kenken 192 (Σ 1171).

### (e) The irreducible residue, named

| Game | Residue (norm LOC) | What a shared shell provably could not absorb |
|---|---|---|
| **futoshiki** | 422 | `caretDescriptors` edge-midpoint math + glyph rotation (`FutoshikiBoard.vue:128-172`, ~46); `constraintLabels` a11y folding (`:175-198`, ~24); the caret-layer scoped CSS (`:296-316`); the `?board=` codec's inequality payload (`useUrlState.ts` encode/decode bodies, ~84); `FutoshikiPoster.vue`'s canned inequality set + its re-implemented caret math (~101); `toFlatInequalities`/`toPairs` (16); `Inequality` + `VALID_BOARD_SIZES` types |
| **thermo** | 221 | `ThermoTube.vue` in full — the seeded-jitter bulb+tube SVG path derivation (77 residual of 94); the thermometer node-budget/wire prefix (`thermoWire.ts`, 12); `ThermoPoster.vue`'s canned tube set (19); the `thermometers` clue field on the wire and in the persist blob |
| **kenken** | 192 | `KenKenOp` + operator↔ordinal maps and the target-label composition `${target}${op}` with the singleton special-case (`kenkenWire.ts`, `KenKenCage.vue:86-92`); the boxless-geometry deletions (`peersFn` with no box band, `subgridSize = boardSize`); the 4/5/6 size band; `KenKenPoster.vue`'s 17-cage partition (23) |
| **sudoku** | 183 | The TDZ-forced local `sections` list (`SudokuGame.vue:57-73`, 17 — cause at `:38-56`, a boot-order fact, not a style choice); `TEMPLATE_BANK` marshalling (`useSolver.ts:106-109`) + `templates` on the generate frame; the `?board=` v1 codec (44); the 9×9 canned poster (17) |
| **killer** | 153 | Cage-sum label + dotted-boundary path derivation (`KillerCage.vue`, 9 residual over the shared cage core); `killerWire.ts` 2-word prefix (15); `KillerPoster.vue` canned cages (15); the `cages` clue field |

The one FOR-REASON residue that is a *shell-shape* fact rather than a mechanic: `SudokuGame.vue`'s local `sections`. It exists because the eager game closes an ESM cycle through `registry.ts`. Any shell that keeps sudoku eager inherits that constraint.

---

## §4 — (f) `shared/` inventory, and twin lines that duplicate it

### 4.1 What `games/shared/` already absorbs

47 files, 7,478 raw LOC. Consumed by all five games:

| Surface | Files | What it holds |
|---|---|---|
| State machine | `useGameState.ts` (964) | The whole undo/epoch/deal/peek/marks/persist choreography behind a ~20-slot domain object (`GameStateDomain`, `:103`). Every `use<Game>` is a thin adapter over it. |
| Board shell | `GameBoard.vue` (914) | Grid scaffold, reveal wave, roving-tabindex ARIA, marginalia machine, completion vignette, paper-note host, drawer voice, draw/erase state machine, `#cells` + `#overlay` slots. Takes `peersFn`/`conflictsFn`/`freshBoardCopy`/`idleGradeHint` as props (`:68`, `:76`). |
| Controls | `GameControlPanel.vue` (1340) + `ControlSection` (`:11`) | One panel for all five; the per-game ControlPanel wrappers were already deleted (noted at `SudokuGame.vue:38-39`, `FutoshikiGame.vue:34-36`). |
| Scene scaffold | `GameScene.vue` (140), `scene.css` (175), `DrawerTab.vue`, `PosterBoard.vue` | `.app-layout` row, `.board-peek-host` + pull-tab, doubled controls card, drawer registration. |
| Cell shell | `useGameCell.ts` (300), `gameCell.css` (315) | All twin cell logic; furniture passed as `GameCellFurniture` functions (`:60`). |
| Solver seam | `solver/transport.ts` (155), `protocol.ts` (32), `describeError.ts`, `classifyError.ts`, `solverError.ts` | Worker singleton + pending map + bounded respawn; `PingRequest`/`PingResponse`/`SolverErrorResponse` frames; wasm-error → clone-safe frame. |
| Technique | `techniqueEngine.ts` (842), `techniqueVoice.ts` (179) | `findStep`/`gradeBoard`/`fillAllForced`/`findHint` over a `PuzzleView`; per-game adapters only. |
| Conflicts | `conflicts.ts` (101) | `findConflicts(values, boardSize, Adjacency)` — the row/col Latin core, with `subgridSize` and `extra` as data. |
| Assists/marks/misc | `useAssists`, `useUserMarks`, `usePencilMarks`, `useUndoHistory`, `useAnswerKeyPeek`, `useControlsDrawer`, `useFlipGlide`, `useStagingBridge`, `useGameGallery`, `useKeyboardViewport`, `useLongPress`, `useDirtyBoard`, `useLiveFace`, `useCoarsePointer`, `useButtonAnimation`, `honestHaptics`, `solveTally`, `types.ts` | Already single-sourced. |

`shared/` also owns all pencil-boil coupling except three imports: `HandwrittenGlyph.vue` (sudoku cell, futoshiki cell + caret + poster) and `AnswerKeyLaminate.vue` (four `Game.vue`s). Games touch `@mkbabb/pencil-boil` directly **zero** times — the only per-game pencil imports are the two component paths above.

### 4.2 Twin lines that duplicate something `shared/` (or pencil-boil) already exports

| Duplicate | Copies | Evidence | What already exists |
|---|---|---|---|
| Board `defineEmits` block (10 lines) | ×5 | SHA `48fa3d289643` over `sudoku/SudokuBoard/SudokuBoard.vue:59-70` and its 4 twins | `shared/GameBoard.vue` declares the same emit surface; the five adapters re-declare it purely to forward |
| The `peersFn` row/col loop (5 lines) | ×5 | `SudokuBoard.vue:97-104` ≡ `FutoshikiBoard.vue:99-106` ≡ thermo/killer/kenken | `shared/conflicts.ts:50-57` already sweeps the same row/col units inside `findConflicts`; it exports no peer derivation, and `GameBoard.vue:68` takes `peersFn` as a prop |
| `freshBoardCopy` + `linkErrorPending` one-shot (12–18 lines) | ×5 | `SudokuBoard.vue:118-131` ≡ `KillerBoard.vue:122-135`; the Latin pair is the same minus the request-voice branch | `GameBoard.vue` consumes it as a `fresh-board-copy` prop; no shared implementation |
| `flourish` provide (4 lines) | ×5 | SHA `e99e20a0cccf` | Deliberately in the adapter scope (`SudokuBoard.vue:72-74`) — a Vue provide/inject scoping fact, not drift |
| `toRecord` (6 lines) | ×5 | SHA `82412ac0756f` | `shared/solver/transport.ts` owns worker plumbing only; it exports no board marshalling |
| `toFlat` (7 lines) | ×4 | identical in sudoku/futoshiki/thermo/killer; kenken's `toFlatBoard` differs by geometry | as above |
| Worker `ensureInit` + wasm-URL init (5 lines) | ×5 | SHA `b6608ca40eab` | `shared/solver/describeError` + `protocol` are shared; the init + message-switch scaffold is not |
| Worker `ping` case / `default` throw / `catch` tail (~18 lines) | ×5 | `sudoku/solver/solver.worker.ts:61-68, 129-143` and twins | `shared/solver/protocol.ts:19-32` types the frames but nothing handles them |
| `difficultyOptions` (9 lines) | ×3 | SHA `f9e17c23ce02` | nothing in `shared/` exports selector constants |
| `NODE_BUDGET_BY_SIZE` sudoku table (8 lines) | ×3 | SHA `7abc64aa6f7d` | `useGameState` takes `nodeBudgetForSize` as a slot; the table is not shared |
| `game.ts` difficulty section (6 lines) | ×5 | `sudoku/game.ts:38-44` and twins | `ControlSection` is typed in `GameControlPanel.vue:11`; the difficulty instance is not |
| `SolveResponse` interface (10 fields) | ×5 | SHA `08a0463a440f` ×3, doc-decorated in the other two | `shared/types.ts:15` exports `SolveStats` — a different, smaller shape |
| `AnswerKeyLaminate` mount (7 lines) | ×5 | `SudokuGame.vue:184-191` and twins | `GameScene.vue` does not mount it; four games import it statically, sudoku via `defineAsyncComponent` |
| V1-stub `persistBoard`/`clearPersistedBoard`/`dropBoardParam`/`writeShareUrl` | ×3 | SHA `8fb12bd9c9f8` (thermo≡killer), `aad956abbf29` (kenken) | no shared persistence helper |
| `export type Difficulty = "EASY" \| "MEDIUM" \| "HARD"` | ×2 | `sudoku/types.ts:10`, `futoshiki/types.ts:39` | `shared/types.ts` exports `SolveState`/`SolveStats` but not `Difficulty` |
| Cage theme-CSS quartet (`:root[data-theme=…]` × light/dark × 2 classes) | ×2 | `KillerCage.vue:150-180` ≡ `KenKenCage.vue:155-185` mod class name | no shared cage stylesheet |

Nothing in the duplicated set maps onto a `@mkbabb/pencil-boil` export — the package surface the games reach is only `HandwrittenGlyph` and `AnswerKeyLaminate`, both already single-sourced.

---

## §5 — COUNTERFACTUAL SUMMARY

**Measured surface** 7,387 raw LOC across 63 files in 13 classes × 5 games. 5,294 normalized (2,093 lines, 28.3 %, are comment or blank).

**Absorbable** — **2,966 normalized LOC** of duplicate copy destroyed, against a **1,137-LOC** shell that holds one copy of each. Raw-LOC impact at the measured 1.40× comment ratio: **≈4,150 raw LOC removable**, shell ≈1,590 raw.

**Irreducible residue** — **1,171 normalized LOC** (≈1,640 raw), distributed futoshiki 422 · thermo 221 · kenken 192 · sudoku 183 · killer 153. Futoshiki carries 36 % of all residue on two mechanics: the caret geometry and the only fully-wired `?board=` codec besides sudoku's.

**Ratio** — 56 % of the measured normalized surface is destroyable duplicate; 22 % becomes shell; 22 % is genuine per-game mechanic.

**Divergence census** — 118 pairs: TWIN 8, NEAR 43, DIVERGED 67. Of the 67 DIVERGED, the named causes split roughly **FOR-REASON 54 / BY-DRIFT 13**, where BY-DRIFT concentrates in: `GameControlPanel` attribute ordering (2 files vs 3), the per-file header doc-census of sibling games (11 files), `difficultyOptions` (×3), `NODE_BUDGET_BY_SIZE` (×3), `Difficulty` (×2), the cage `font-size` 0.26/0.24 split, and kenken's truncation guard that killer and thermo lack.

**Per-class confidence**

| Class | Removable | Confidence | Why |
|---|---|---|---|
| `solver.worker` | 328 | **HIGH** | SHA-identical `ensureInit`, `ping`, `default`, `catch`; divergence is 6 named identifiers |
| `protocol` | 208 | **HIGH** | pure type unions already composed off a shared frame module |
| `Board` | 661 | **HIGH** | SHA-identical emits + flourish + expose; two clean sub-families; adapters are already thin |
| `Game.vue` | 449 | **HIGH** | three lazy scenes are one file (0.8–2.5 %); the two exceptions are documented and bounded |
| `useSolver` | 364 | **HIGH** | SHA-identical `toRecord`, name-only transport block, uniform three-call body |
| `CP/constants` | 22 | **HIGH** | SHA-identical `difficultyOptions`; small but certain |
| `game.ts` | 91 | **HIGH** | one `defineGame` call shape ×5; divergence is header prose |
| `cell/furniture` | 370 | **MEDIUM** | the `{sudoku,futoshiki}` collapse (220/452 shared) and `{killer,kenken}` (116/252) are near-total, but the five files are three different species — the number rests on sub-family collapse, not a five-way shell |
| `UrlState` | 335 | **MEDIUM** | 141 of the 335 comes from the sudoku↔futoshiki codec pair; a shell must parameterize the codec body by clue type, and the two extant codecs differ in exactly that body |
| `use<Game>` | 84 | **MEDIUM** | structure is 100 % uniform but the content is 20 one-line slots; line-level absorbable understates the real duplication and the shell shape is already `useGameState` |
| `*Wire` | 22 | **MEDIUM** | three-file class, structurally identical loops, but the prefix width is a genuine wire fact |
| `Poster.vue` | 32 | **LOW** | the files are canned data; only a 9-line scaffold absorbs. The real find here is intra-game (futoshiki poster ≡ futoshiki board caret math, ~55 lines) |
| `types.ts` | 0 | **LOW** | 17 normalized lines total; nothing to absorb beyond the 2-copy `Difficulty` |

**Load-bearing caveat.** The absorbable figure is a line-collapse measurement, not an implementation estimate. It assumes a shell can accept the two named geometry axes (SUDOKU-GEOMETRY vs LATIN) and the clue-payload axis as parameters. Where that assumption is tested by an existing constraint it is cited: `SudokuGame.vue:38-56` (eager-game ESM cycle → local `sections`), `SudokuBoard.vue:72-74` (provide/inject scoping → per-adapter `flourish`), `thermo/solver/useSolver.ts:46-49` (knip → no dead `prewarm` export). Those three are the known walls.

ROW-COMPLETE

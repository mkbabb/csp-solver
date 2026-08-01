# T5-W2 — THE WAVE-OPEN RECORD

**Opened** 2026-08-01 · **HEAD** `baae148b82892ec6fb3827299155a8560607c019` (clean) ·
**Lane** Opus, under the Fable team lead · **Spec** `waves/T5-W2-distill.md` + `gates.json` W2 ·
**Designs of record** `evidence/design/alpha-gestalt.md` (gestalt) · `evidence/design/beta-mechanics.md` (mechanics)
**Probe bank** `evidence/w2/probes-at-HEAD.txt` — every number below traces there, re-derived on this tree.

The wave's own law: **the final gate table fixes at open.** This is that table. Nothing in it may
be renegotiated mid-wave; a defect in the table is an amendment with a named cause, appended, dated.

**Tree drift since the designs were written.** Both designs were formulated at `71456713`. HEAD is
5 commits ahead (`e961bdb7` formation · `f38c5130` W0 · `e6b19a4c`/`cdc47539` W1 · `baae148b` W6).
`web/frontend/src` moved at exactly **two files**: `games/shared/useCoarsePointer.ts` (−2 lines) and
`pencil/chrome/AttributionCard/useHoverCard.ts` — the W1 supportFloor cure, which discharges S8/K31
ahead of us. Every other design measurement stands on an unmoved tree. The one arithmetic
consequence: BETA's `games/** non-test = 16,663 raw` now reads **16,661**, and the difference is
exactly those two lines.

---

## 1 · THE UNION `GameSpec`

The adjudication (W2 spec header): **BETA's five declared slots as the floor ∪ ALPHA's 8-slot
census**, landing on eight — `model · grammar · clues · furniture · solver · urlCodec · poster ·
deal`. The floor is not rhetorical: the five slots the five games actually pass today
(`model, cellFurniture, clueFurniture, options, solverPayloads`) each survive into a named home,
and no slot enters the type without a consumer that reads it at mount.

### 1.1 The reconciliation table

| Union slot | ALPHA's evidence | BETA's evidence | The five games' LIVE fields | Verdict |
|---|---|---|---|---|
| **model** | `model: () => TModel` — "the `use<Game>` composable", §0 contract | `model` — "the `useGameState` adapter, ~20 domain slots, unchanged in shape"; `<game>/model.ts` charter | `model: useSudoku \| useFutoshiki \| useThermo \| useKiller \| useKenken` — 5/5 pass it, **0 production reads** (registry.ts:135-136 only) | **KEPT VERBATIM.** `() => TModel`. Consumer: `GameShell` calls it once at mount. Zero-read → 5 reads. |
| **grammar** | `geometry: {kind:"boxed", subgrid:(m)=>n} \| {kind:"latin", side:(m)=>n}` — a tagged union | `BoardGrammar { geometry: "boxed"\|"latin"; noun; requestVoice; gradeHint }` — one axis, **six uses** tabulated (`boardSizeOf`, `subgridSize`, `peersFn` box band, `findConflicts` adjacency, solve slice, `markCols`) | **NOT A FIELD TODAY.** Forked across five boards: `ThermoGame.vue:163` vs `KenKenGame.vue:112`; `ThermoBoard.vue:109-115` vs `KenKenBoard.vue:98`; the render strings at `ThermoBoard.vue:126-129,:138-146` | **BETA WINS on shape** — a flat record beats a tagged union because `noun`/`requestVoice`/`gradeHint` are *rendered strings*, and folding a render difference into a geometry name smuggles a DELTA behind a rename (BETA §1). ALPHA's dim functions become `geometry`-derived, not per-spec. |
| **clues** | `overlay: Component \| null` — "carets / tube / cage — the clue's face" | `clueFurniture` + `clueProps` + `shared/solver/wire.ts` packGroups/unpackGroups; `<game>/clue.ts` = "the clue's wire head/label mapping, as data" | `clueFurniture: null \| FutoshikiCaret \| ThermoTube \| KillerCage \| KenKenCage` — 5/5 pass it, **0 production reads**. The wire lives in 3 `*Wire.ts` + 5 `protocol.ts` (402 raw) | **UNION.** One slot carries the whole clue seam: `{ overlay, props, encode, decode } \| null`. `null` is sudoku's **stated absence**, never a boolean. The codec pair is what makes one `persistence.ts` and one `protocol.ts` possible — separating them would re-fork the axis. |
| **furniture** | `cell: Component` — "DigitCell for all five today"; the 6-line S↔F delta becomes props fed from geometry | `GameCell.vue` — "`markCols` and `maxlength` derive from `grammar` + `boardSize`; `ariaSuffix` stays the `GameCellFurniture` function seam (`useGameCell.ts:60`)" | `cellFurniture: SudokuCell ×3 \| FutoshikiCell ×2` — 5/5 pass it, **0 production reads**. The two components are **2.7% apart**, 220 of ~226 lines shared | **KEPT AS A SLOT, value unified.** All five point at `shared/DigitCell.vue`; the six divergence lines become `grammar`-derived props. It stays a slot because a sixth game may bring its own cell — but *today* the slot's five values are one component, and that identity is the gate. |
| **solver** | `solver: { marshal, unmarshal, nodeBudget }` — "per-game wire residue over ONE client" | `defineSolverClient({ game, geometry, encodeClue, decodeClue })` → `{ getRandomBoard, solveBoard, propagateBoard, prewarm }`; the tier table's FAIL-EXPLICIT home | `solverPayloads: useSolver` — 5/5 pass it, **0 production reads**. Behind it: 5×useSolver (839 raw) + 5 workers (634) + 5 protocols (402), `ensureInit` **byte-identical ×5** (md5 `262633211412`) | **BETA'S CONSTRUCTION, ALPHA'S RESIDUE.** The slot shrinks to what a game alone knows: `{ nodeBudget }`. The verbs are *built* by the shell from `id + grammar + clues.encode/decode` over the one client. A per-game verb table would keep five clients alive under a new name. |
| **urlCodec** | `persist: { key, codec: BoardCodec \| null }` — "`codec:null` ⇒ no share URL, **stated not stubbed**"; DELTA + owner note on the missing Share button | `shared/persist.ts` — "one localStorage codec + one `?board=` codec parameterized by clue; **one version byte, no v0 ratchet**"; K24 kills the three empty-body no-ops outright | **NOT ON THE DEFINITION.** `persistKey` lives on `GameCard` (registry.ts:189); the bodies are 5 `*UrlState.ts` (1,000 raw). The stub triple is **71 of 74 code lines identical**, diverging only at the clue type name | **BETA WINS — and the wave header rules it**, §Divergence: "the codec axis collapses because V1-STUB dies — one `persistence.ts`/urlCodec serves all five (the stubs' SHA-identical tails are the proof it always could)." ALPHA's `codec: null` arm is **NOT in the union**. Slot = `{ key: string }`; the codec is universal because `clues.encode/decode` hands it a `Uint32Array`. **Behaviour break — owner ratification row (§5.3).** |
| **poster** | `poster: () => Promise<Component>` on the spec | `GamePoster.vue` + `<game>/poster.ts`; "the poster stays a **separate** lazy module so the gallery does not pull five solvers to draw five thumbnails" | `poster: () => import(...)` — on `GameCard` (registry.ts:191), **not** on `GameDefinition`. 5/5 rows carry one | **ADJUDICATED: the poster's home is the CARD row, not the spec body.** Forced by chunking, not taste — if `poster` sat inside the spec module, the gallery would have to `load()` five specs (and their models and solver clients) to draw five thumbnails. BETA's G4.4 gates exactly that. One home, one consumer (the gallery), no dual path. |
| **deal** | `options: (m) => ControlSection[]` + per-spec `sizeOptions` data; `eager` on the card | `options` + `shared/selectors.ts` (`difficultyOptions` one home, three size bands as named exports, `difficultySection(m)`); `eager` on the definition, driving prewarm | `options: (m) => ControlSection[]` — 5/5 pass it, **4 production reads** (`FutoshikiGame.vue:37`, `ThermoGame.vue:39`, `KillerGame.vue:34`, `KenKenGame.vue:35`). Sudoku **hand-inlines** at `SudokuGame.vue:57-73`. `staging`/`range`/`eager` on the card | **UNION, renamed to what it is.** One slot for *what a game is dealt at*: the two selector bands + the live sections + the prewarm flag. The bands are shared constants (`selectors.ts`), so `cards.ts` names them **without importing a game** — which is how the gallery keeps its sub-line without `load()`. `eager` reduces to `deal.prewarm`; the card's static-vs-dynamic import form is the chunking truth and needs no second flag. |

### 1.2 The concrete shape

`games/shared/defineGame.ts` — **imports nothing from the table.** That single fact is what severs
the TDZ: `spec → defineGame` and `cards → spec`, never `spec → cards`, so the cycle
`scene → game → registry → scene` has no edge to close on.

```ts
import type { Component } from "vue";
import type { ControlSection } from "@games/shared/GameControlPanel.vue";
import type { SelectorBand } from "@games/shared/selectors";

/** The two grid families, and the three render facts that correlate with them but are not them. */
export interface BoardGrammar {
  geometry: "boxed" | "latin";  // sudoku|thermo|killer  ·  futoshiki|kenken
  noun: string;                 // the grid's a11y label — "sudoku board", "kenken board"
  requestVoice: boolean;        // the "— you asked for medium" clause
  gradeHint: boolean;           // the UI-13 idle whisper
}

/**
 * The clue seam, whole: what the board draws, and how the wire and the permalink carry it.
 * `null` is sudoku's STATED absence — a game with no on-board clue glyphs. Never a boolean.
 */
export interface ClueSeam<TClue> {
  overlay: Component;
  props: (clue: TClue, dim: number) => Record<string, unknown>;
  encode: (clue: TClue) => Uint32Array;
  decode: (buf: Uint32Array, dim: number) => TClue;
}

/** What a game is dealt at. The bands are shared constants, so the gallery reads them
 *  without loading a game. `prewarm` is the eager row's ONE flag — the card's import
 *  form already carries the chunking. */
export interface DealSpec<TModel> {
  sizes: SelectorBand;
  difficulty: SelectorBand;
  options: (model: TModel) => ControlSection[];
  prewarm?: boolean;
}

export interface GameSpec<TModel, TClue> {
  id: string;                              // matches its cards.ts row; drives ?game=, aria, keys
  model: () => TModel;
  grammar: BoardGrammar;
  clues: ClueSeam<TClue> | null;
  furniture: { cell: Component };
  solver: { nodeBudget: (dim: number) => number };
  urlCodec: { key: string };
  deal: DealSpec<TModel>;
}

/** Identity function, hoisted. It no longer NEEDS to be hoisted — the cycle is gone — but
 *  a hoisted identity costs nothing and forecloses a class of future re-entry (BETA §3). */
export function defineGame<TModel, TClue>(spec: GameSpec<TModel, TClue>): GameSpec<TModel, TClue> {
  return spec;
}
```

`games/cards.ts` — **the gallery's sole table**, and the eighth slot's home:

```ts
export interface GameCard {
  id: string;
  name: string;
  glyph?: Component;
  range: { label: string; levels: string[] };   // derived from the SHARED band, not a game import
  staging: CardStaging;                         // same bands, presentation-erased
  poster: () => Promise<Component>;             // the union's `poster` slot — separate lazy chunk
  load: () => Promise<GameSpec<unknown, unknown>>;
}
```

`sudoku`'s row statically imports its spec (the eager main-chunk ride, byte-for-byte the shape
`registry.ts:224` already uses); the other four are `() => import("@games/<g>/spec")`.

### 1.3 Closure — every field has a home, every home has a consumer

| Live field, today | Where it passes | New home | Consumer, by construction |
|---|---|---|---|
| `model` | 5× `game.ts` | `GameSpec.model` | `GameShell` mount |
| `cellFurniture` | 5× `game.ts` | `GameSpec.furniture.cell` | `BoardHost` `#cells` |
| `clueFurniture` | 5× `game.ts` | `GameSpec.clues?.overlay` | `BoardHost` `#overlay` |
| `options` | 5× `game.ts` (4 read) | `GameSpec.deal.options` | `GameShell` → `GameControlPanel` |
| `solverPayloads` | 5× `game.ts` | `GameSpec.solver.nodeBudget` + `clues.encode/decode` | `createSolverClient` in `GameShell` |
| `TBoard/TCell/TClue` type params | 5× `game.ts` | `TModel`/`TClue` (TCell dies — the cell is a value, not a type param) | `vue-tsc` |
| `GameCard.persistKey` | registry.ts:189 | `GameSpec.urlCodec.key` | `createBoardPersistence` in `GameShell` |
| `GameCard.poster` | registry.ts:191 | `GameCard.poster` (unmoved) | `GameGallery` |
| `GameCard.scene` | registry.ts:193 | **DIES** — there is one scene | — |
| `GameCard.eager` | registry.ts:195 | `GameSpec.deal.prewarm` + the row's import form | `GameShell` prewarm |
| `GameCard.range`/`staging` | registry.ts:180-183 | unmoved, sourced from `shared/selectors.ts` | `GameGallery` |
| `gameRegistry` | registry.ts:134-137 | **DIES UNTRANSLATED** — 0 production consumers, 2 of 5 games | — |
| `GameDefinition` | registry.ts:100-113 | **DIES UNTRANSLATED** — reborn as `GameSpec` | — |

No orphans in either direction. A slot the shell doesn't read is deleted from the type; a field a
game passes with nowhere to land is a slot the reconciliation missed.

### 1.4 Adjudications this reconciliation makes — flagged for the lead

1. **ALPHA's `codec: null` arm is out.** The wave header's §Divergence rules V1-STUB dead and one
   urlCodec for all five. ALPHA's "stated absence + no Share button" would have preserved the axis
   as a field. Consequence: **the permalink becomes real for thermo/killer/kenken**, and the v0
   ratchet dies for sudoku/futoshiki. This is the single disclosed behaviour break in the wave, and
   it is an **owner ratification row** (BETA §6 risk 1). It is gated both ways at 2.4/§5.3.
2. **`poster` lives on the card, not in the spec body.** Chunking forces it (G4.4). The union's
   eight slots therefore have two modules, not one — and the reason is measured, not aesthetic.
3. **`eager` collapses to `deal.prewarm`.** Two flags for one fact is the config-flag disease
   `registry.ts:11-13` warns about in its own header.
4. **`productionSlotReads: 25` is a FLOOR, not the arithmetic.** gates.json derives it as BETA's
   5 slots × 5 games. The union has eight, so the enumerated read census lands at **8 × 5 = 40**
   under the shape above. The gate passes a fortiori. **Lead's call:** restamp the gate to the
   enumerated figure at seal, or hold 25 as the floor and record 40 in the wave record. Either is
   honest; picking neither is not.
5. **`filterBudget.ts` placement (2.3 says decide and record).** Data banked: its **only** import
   is `e2e/filter-census.spec.ts:13`; four other files name it in prose alone. It is an e2e-only
   module living under `src/pencil/config/`. ALPHA defers it (lane D owns the prose mid-cure).
   **Recommendation: DEFER, and record the deferral as the decision** — the e2e-only placement is
   arguably correct, moving it mid-loop fights a live cure, and 2.3's obligation is a *recorded*
   verdict, not a relocation.

---

## 2 · THE BORN-RED PROBE TABLE (moves 2.1–2.8)

Law: **every step born RED with its named probe, banked before its cure.** A probe that cannot be
shown failing at HEAD is not a gate — it is a hope. Where the design docs' probe command does not
actually work on this tree, the corrected command is given and the correction is the record.

| # | Move | Probe (verbatim, runnable) | Expected RED at HEAD | Green condition |
|---|---|---|---|---|
| **2.1a** | registry fiction dies | `grep -rn "gameRegistry" web/frontend/src \| grep -v "\.test\.ts" \| grep -vc "^\s*\*\|//"` | **1** — the sole declaration at `registry.ts:134`, with **0 production consumers** across 24 total hits (15 test, 9 comment/decl) | **0** hits; `registry.ts` gone; `games/cards.ts` + `games/shared/defineGame.ts` in its place |
| **2.1b** | slots read by construction | spec-consumption unit ×5: mount `GameShell` with each spec, assert every slot is exercised (model called · grammar applied · clues bound or provably null · furniture rendered · solver pinged · urlCodec key written · deal.options rendered) | **4** production slot reads (`options` × futoshiki/thermo/killer/kenken); model/cellFurniture/clueFurniture/solverPayloads at **0**; sudoku reads nothing (`SudokuGame.vue:57-73` hand-inline) | ≥ **25** (gate floor); enumerated **40** under §1.2. Sudoku 5/5 for the first time |
| **2.1c** | TDZ severed structurally | `node scripts/tdz-probe.mjs` — a 4-module reproduction of the cycle against the NEW graph must boot; the OLD-graph arm must throw | RED **by construction** — the new graph doesn't exist. Live cause banked at `SudokuGame.vue:40-55` + `sudoku/game.test.ts:5-9`: `ReferenceError: Cannot access 'sudokuGame' before initialization` | probe boots; **no file under `src/games/*/` imports the table** (5 do today: `thermo/game.ts:13` + 4 twins) |
| **2.1d** | one scene, one board, one cell, one cage | `find web/frontend/src/games/*/ -name "*Game.vue" -o -name "*Board.vue" \| wc -l` and a module-graph assertion: exactly one module exports a game cell, exactly one exports a cage overlay | **10** scene/board files (843 + 1,267 raw); cells **2** (SudokuCell, FutoshikiCell, 2.7% apart); cages **2** (KillerCage, KenKenCage) | **0** per-game scenes/boards; **1** cell module; **1** cage module |
| **2.1e** | per-game file count | `for g in sudoku futoshiki thermo killer kenken; do find web/frontend/src/games/$g -type f ! -name "*.test.ts" ! -name "README.md"; done \| wc -l` | **65** (14·14·12·12·13) | **22** (gates.json `perGameFilesTarget`) |
| **2.2a** | one wasm seam | source: `grep -rn "wasm?url" web/frontend/src \| wc -l` → **built dist**: `node scripts/check-wasm-seam.mjs` — exactly one chunk imports `csp_solver_wasm_bg.wasm` | **5** import sites (thermo/sudoku/kenken/killer/futoshiki workers; 7 raw grep hits, 2 are prose) | **1** site, **1** chunk. `urlContractSites: 1` |
| **2.2b** | one worker, one protocol, one client | `ls web/frontend/src/games/*/solver/{useSolver.ts,solver.worker.ts,protocol.ts} \| wc -l`; `md5` of each worker's `ensureInit` | **15** files (839 + 634 + 402 = 1,875 raw); `ensureInit` **byte-identical ×5**, md5 `262633211412` — DIVERGED×0 | **0** per-game solver files; `workers: 1`, `protocols: 1` |
| **2.2c** | parity, not greps | `games/shared/solver/client.test.ts` — per game, `generate(seed-fixed)`/`solve`/`propagate` through the NEW client equals fixtures recorded from the old five | RED by absence (module doesn't exist). **The fixtures are the gate; grep rows are not** (MEASURE law 4) | 5/5 parity, fixtures recorded pre-collapse |
| **2.2d** | wire guard universal | unit: a truncated group buffer **throws** for thermo, killer AND kenken | **only kenken guards** (`kenkenWire.ts:38`); thermo and killer red | 3/3 throw |
| **2.3a** | dead theme tokens | `node scripts/check-theme-tokens.mjs` — every custom property in `index.css` has ≥1 `var(--tok[,)]` or utility reference in `src/**` (minus index.css) · `e2e/**` · `index.html` | RED by absence (script doesn't exist). My independent instrument reads **17** unreferenced of 59 declared; **the audit says 15**. The extras are `--color-muted` and `--radius`, both hand-verified at 0/0. **The gate's own enumeration fixes the number when it lands** — the precedent gates.json set for boundary. Born-RED assertion is `> 0` | **0**, with the enumerated figure stamped in the wave record. Negative control: re-add `--color-input` ⇒ RED |
| **2.3b** | dead props | scoped assertion over the compiled SFCs: `AnswerKeyLaminate.props` lacks `subgridSize`; `GameBoard.props` contains neither `cornerMarks` nor `centerMarks` | `AnswerKeyLaminate.vue:29` declares `subgridSize` **required**, 5 laminate binds, **0 reads**; `GameBoard.vue:81-82` declared, bound by all five boards, never read | props absent; the 5 + 10 bind sites gone. **Scope discipline:** 19 `subgrid-size` binds and 109 `cornerMarks\|centerMarks` occurrences exist repo-wide and most are LIVE on other components — the kill is scoped, never a global grep |
| **2.3c** | test-only seams out of production | `grep -rn "__resetStagingBridge" web/frontend/src \| grep -vc "\.test\.ts"` | **1** — `useStagingBridge.ts:254`, a shipped, ungated test seam; all 4 consumers are the test | **0**; the store is injected into the test instead |
| **2.3d** | PENCIL/YOSHI dead keys | `node scripts/check-config-keys.mjs` (or the census's exports instrument re-run) over `pencilConfig.ts` | `PENCIL.{gridFrame,gridSubgrid,gridCell,logoText,vine}` — 5 of 6 keys dead; `YOSHI_COLORS.{apple,banana,grapes,flower,vine}` + `leaf.vein` | 0 dead keys; survivors renamed **atomically**, CH-31 lands |
| **2.4a** | TIER_SOURCE build-fail | build with `csp-solver/data/sudoku_puzzles/3/hard` renamed away must **fail the build** | **the build succeeds silently** — `vite.config.ts:33,:50-53,:78` make a dropped directory and a deliberate excision emit byte-identical output; `useSolver.ts:106` masks it as `TEMPLATE_BANK[size]?.[…] ?? []` | build throws, naming the missing dir; `tierSource(3,"easy")==="livegen"`, `tierSource(3,"hard")==="bank"` |
| **2.4b** | catch{ignore} → 0 | **the docs' command is broken.** `grep -rn 'catch { /* ignore */' src \| wc -l` returns **0** because prettier puts the comment on its own line. Use: `grep -rn -A1 "} catch {" web/frontend/src \| grep -c "/\* ignore \*/"` (cross-check: `grep -rn -B2 '\.stop();' src \| grep -c 'try {'`) | **11**, both commands agreeing — 6 files: `DifficultyTally.vue:132`, `CelebrationHeart.vue:103`, `CelebrationStar.vue:47`, `GameGallery.vue:181`, `HandwrittenGlyph.vue:116,124,132,180,276,293`, `usePathAnimation.ts:40` | **0**, enforced by a `no-empty-catch` lint rule landing **same-commit** as the deletions. **Scope decision owed:** the lone `} catch {}` at `pencil/dev/FilterTuner.vue:234` is dev-only and outside the 11 — does the rule cover `src/pencil/dev/**`? Decide, record |
| **2.4c** | the stop() contract | pencil-boil unit: double-`stop()` and stop-after-unmount on a real `SequenceHandle` throw nothing; **negative control** — a build patched so `stop()` throws must surface it, not swallow it | RED against 0.10.1's undocumented contract (**installed version verified: 0.10.1**; 0.11.0 does not exist) | GREEN on 0.11.0, published with W4b's `rasterizePoseToBlob` in **one tagged release** (D9's cure) |
| **2.4d** | the v0 ratchet dies | `permalink.spec.ts` — a v0-shaped body renders `boardLink:"invalid"` and the already-built clause (`ThermoBoard.vue:132`); a current-version body round-trips **for all five games** | `sudoku/composables/useUrlState.test.ts:81-84` asserts the v0 body **succeeds** — the test is literally named "the graceful ratchet"; thermo/killer/kenken have **no permalink at all** (`thermoUrlState.ts:82,105,108` are empty-body no-ops) | both arms green, 5/5. **OWNER RATIFICATION — the single disclosed behaviour break** |
| **2.5** | boundary 20/20 by construction | `npm run lint:boundary` (`eslint --no-config-lookup --config eslint.boundary.config.js src/games`) | **23 errors** — re-derived independently: 27 alias-form cross-game imports minus 4 self-references = 23. **The design docs' "20" is wrong**; gates.json already carries the correction (20 was the ordered-pair count). W1's generated rule landed RED here on purpose | **0 errors**, the rule unchanged. Green **because nothing a game needs lives in a sibling** — all 23 target surfaces this wave moves to `games/shared`. `registry.ts`'s false invariant comment dies with the file — `:33-35` declares "a game never depends on another's ControlPanel constants," and `thermo/game.ts:18` imports `@games/sudoku/ControlPanel/constants` at the same commit |
| **2.6** | CH-19 by its own trigger | the hold's **banked method**, re-run: byte-identity of the emitted CSS bundle + the font-URL smoke guard, before/after the token kills | Not born-RED — **CH-19 is a HELD-healthy row, not a defect.** Its trigger is "the tranche touches index.css", and 2.3's token kills touch it. State at HEAD: **842 lines**, `@import "tailwindcss"` at `:1`, `@theme` at `:104`, inline `@layer base/utilities` at `:96/:455/:492/:815`, no partials dir, held ×4 | The `@layer` extraction is **decided on the byte-identity evidence** — the hold's own criterion, not a fresh proposal. A DROP is as valid an outcome as an extraction; what is not valid is deciding without re-running the proof |
| **2.7a** | god modules | `find csp-solver/src -name "*.rs" \| xargs wc -l \| awk '$1>500'` | `builder/assignment.rs` **607** (U-09, unwaived) · `constraint/cage.rs` **558** · `solver/search.rs` **528** (waived — the comment re-derives here) | `godModulesOver500Unwaived: 0`. `assignment.rs` split; `cage.rs` resolved by test-extraction (one act, size + the R4 law); `search.rs`'s waiver comment re-derived at its citation |
| **2.7b** | futoshiki conforms | signature assertion: all five families expose `create_X(…) → (Csp, given)` and `solve_X(…, &SolveConfig)` | **futoshiki alone diverges** — `create_futoshiki_csp(puzzle) -> Csp<BitsetDomain>` (no `given` tuple, `csp.rs:132`); `solve_futoshiki(puzzle) -> Vec<Vec<u32>>` (no `SolveConfig`, returns ALL solutions, `csp.rs:177`) | 5/5 conform; wasm and py ride the change |
| **2.7c** | `from_difficulty` 5/5 | `grep -rn "fn from_difficulty" csp-solver/src \| wc -l` | **4** — kenken `:239`, thermo `:172`, futoshiki `:347`, killer `:180`. **SudokuClass is the abstainer** (all 5 `impl PuzzleClass`) | **5** |
| **2.7d** | wasm family dedup | `grep -rn "fn board_total" csp-solver/wasm/src`; a naming assertion on `n()` vs `board_size`; a `.code` assertion per family | `board_total` duplicated ×**3** (`kenken.rs:205`, `thermo.rs:179`, `killer.rs:189`) while `errors.rs` (55 lines) is its declared home; `n()` naming split (kenken takes `board_size`); `coded_error` lives at `errors.rs:22-28` but only `futoshiki.rs:232` routes through it | one `board_total` in `errors.rs`; one naming; **JsError typed with `.code` 5/5**. `wasmVerbBoundaryTests: 15` — verified surface: `generate_*` 5 + `solve_*` 5 + `propagate_*` 5 = 15 of the 31 `#[wasm_bindgen] pub fn` names |
| **2.7e** | `CspTimeoutError` wired-or-removed | per the T3 RESERVE's own terms, re-derived | **the "unraisable" claim needs re-verification**: it IS raised at `py/errors.rs:60` from `CspError::Timeout`, declared `csp_solver.pyi:135`, exported `py.rs:41`, asserted `tests-py/test_wheel_contracts.py:252`. Whether any path can produce `CspError::Timeout` is the actual question | wired (a reachable path, tested) **or** removed (declaration, export, pyi, and test row together). Not both, not neither |
| **2.8** | lib shadows die | `for s in createGlyphDrawIn generateRectBoilFrames arcBoilPoints; do grep -rc $s web/frontend/src; done` | **5 · 5 · 2** references. Their lib twins **already exist in 0.10.1**: `createStrokeDrawIn`, `boilRectFrames`, `ellipsePoints` | **0 · 0 · 0**. **Sequencing gain, recorded:** 2.8's deletions do NOT wait on the 0.11 release train — only 2.4c's `stop()` contract does. The 20 unconsumed exports (44 declared at the lib's index minus 24 the app imports — re-derived, exact) are adjudicated upstream: prune in 0.11 or document |

**Probe hygiene, banked.** Two design-doc probes do not run as written and are corrected above:
2.4b's single-line `catch { /* ignore */` grep (returns 0, not 11) and the "20 cross-game imports"
figure (23). One instrument is **missing entirely**: `madge` is not in `node_modules`, so 2.1c's
`madge --circular src` needs either a dev-dep or a hand-rolled module-graph assertion. That is a
gap, not a green.

---

## 3 · THE π SCHEDULE

**π runs at every estate step.** DELTA: none by design — pixel identity IS the claim; a pixel that
moves is a defect or it belongs to W4's lanes.

**The four goldens** (`gates.json` W2 `piIdentity.goldens: 4` counts *surfaces*; 8 files sit on disk,
darwin + linux per surface). On-disk names, verified — the design docs' `-webkit-` filename segment
is **not** on disk; cite these:

| Surface | Files | Standing at W2 |
|---|---|---|
| `cell-light` | `-darwin.png`, `-linux.png` | **LOAD-BEARING.** 2.1 rewrites this surface. Byte-stable or within floor, no re-baseline |
| `grid-corner-light` | `-darwin.png`, `-linux.png` | **LOAD-BEARING.** 2.1 rewrites this surface. Same terms |
| `logo-light` | `-darwin.png`, `-linux.png` | **WATCH ROW** under the sun-crest clause. Reported, not claimed. 2.8 touches the draw-in |
| `toggle-crest-dark` | `-darwin.png`, `-linux.png` | **NO π CLAIM RESTS HERE** — 0/8 · 5/11 · 5/14 across one host, one day. Reported, never load-bearing |

**Per-step schedule.**

| Step | π obligation |
|---|---|
| 2.1 | **Full four-golden identity, both platforms.** This is the step that rewrites `cell-light` and `grid-corner-light`. Plus a full-page matrix: five games × light/dark, against pre-wave crops |
| 2.2 | Four-golden identity. No visual surface moves — a drift here is a defect, full stop. Bundle row instead: worker chunk count 5→1, main chunk not larger |
| 2.3 | Four-golden identity. Token kills must be byte-invisible; any that isn't is a live token misfiled as dead |
| 2.4 | Four-golden identity. **Plus the Share-button row**: thermo/killer/kenken gain a real permalink — a *visible* change riding a byte-identical wave, carried to the owner with the ratification |
| 2.5 | Four-golden identity (import re-homing only) |
| 2.6 | **Byte-identity of the emitted CSS bundle** per CH-19's banked method + the font-URL smoke guard, before/after. Four goldens on top |
| 2.7 | No π — Rust. Counts re-stamped instead |
| 2.8 | Four-golden identity, with `logo-light` under the sun-crest clause; the draw-in twin swap is verbatim, so a moved pixel means the twin isn't one |

**Floors.** darwin soul **0.017**. linux coarse **0.05**, on the two non-convergent surfaces only
(`logo-light`, `toggle-crest-dark`) — the sun-crest clause. `gates.json` W2 `piIdentity.floors`
carries both. **No re-baseline of any golden is authorized by this wave** — not on a single red,
not on a flake. A golden that moves outside its floor **reverts the step**.

**md5 single-tree discipline.** Every π claim in this wave names the md5 of the tree it was measured
on, and a step's before/after pair must come from **one** tree state each — never a rebuild between
arms, never a claim spanning two commits. Goldens are minted and compared **against the built dist
only**; linux goldens mint from the RUNNER artifact, never locally.

**AX baseline.** The DAG puts W3 after W2, so no W3 floor exists to hold. W2 therefore captures the
**AX-tree PRE-state at open as its own regression baseline** and asserts it unchanged at exit — the
board's accessibility tree, the picker's options, the grid labels and roving tabindex. W2 does not
*improve* a11y; it must not silently cost any.

---

## 4 · THE FENCES (verbatim, `T5-W2-distill.md` §Fences — binding)

> ## Fences (binding — ALPHA's, per the loop's C4 ownership)
> `GameControlPanel`, `GameScene`'s zone grammar, `GameGallery` are W4's lanes. W2 does not restyle, recompose, or re-animate them; it may only re-home imports beneath them. The design loop lands on the DISTILLED estate (W4 after W2), but its charters own those surfaces.

**Enforcement.** `git diff --stat` on `src/games/shared/GameControlPanel.vue`,
`src/games/shared/GameScene.vue`, and `src/pencil/chrome/GameGallery/GameGallery.vue` must read
**0 changed lines** at the W2 seal — *except* import re-homing, which is permitted and must be
visible as import-line-only diffs. BC's T′ ledger, A's guard names and inert-flank listbox, and F3's
keypad band stay theirs. The structural dividend runs the other way: five scenes → one means every
BC/A/F3 cure lands **once**, and C3's peek guard gets one call site instead of five.

Adjacent, and also not ours: `TallyDescriptor.expand` and `DifficultyTally`'s dead tabindex are BC's
residue rows. `useAnswerKeyPeek`'s modifier guard is F3's — W2 only collapses its five call sites
to one.

---

## 5 · THE `gates.json` W2 MATRIX, ROW BY ROW

| gates.json row | Value | Probe | At HEAD |
|---|---|---|---|
| `piIdentity.goldens` | 4 | §3 — four surfaces, 8 files, both platforms | GREEN (nothing moved yet) |
| `piIdentity.everyStep` | true | §3 per-step schedule | — |
| `piIdentity.floors.darwinSoul` | 0.017 | golden compare | — |
| `piIdentity.floors.linuxCoarse` | 0.05 | sun-crest clause, `logo-light` + `toggle-crest-dark` only | — |
| `censusDelta.killRowsZeroHits` | true | the 213-row census's kill rows re-grepped | RED — every kill row hits |
| `censusDelta.locRemovedTarget` | 4150 | raw `wc -l` over `games/**` non-test, before/after | **16,661** at HEAD (whole tree) · **7,744** over the five dirs. **Denominator discipline:** ALPHA's ≈4,150 is priced against the dup-matrix's absorbed-class subtotal (5,294 norm × 1.40 ≈ 7,387 raw), NOT the whole-dir 7,744. Any −4,150 claim at seal must name which |
| `censusDelta.perGameFilesTarget` | 22 | 2.1e | **65** |
| `registryFiction.gameRegistryDeleted` | true | 2.1a | RED — `registry.ts:134`, 0 production consumers, 2 of 5 games |
| `registryFiction.gameSpecSoleConsumer` | `GameShell` | 2.1b | RED — 5 hand-written consumers instead of one |
| `registryFiction.productionSlotReads` | 25 | 2.1b | **4** today. Gate is a **floor**; §1.2's shape enumerates **40**. Lead's call per §1.4(4) |
| `registryFiction.tdzEdgeSevered` | true | 2.1c | RED — 5 `game.ts` files import the table; the `ReferenceError` is reproduced |
| `solverSpine.workers` | 1 | 2.2b | **5** — `ensureInit` byte-identical ×5, md5 `262633211412` |
| `solverSpine.protocols` | 1 | 2.2b | **5** per-game (402 raw) over a 32-line shared frame |
| `solverSpine.urlContractSites` | 1 | 2.2a | **5** — N2's whole blast radius |
| `failExplicit.tierSourceBuildFail` | true | 2.4a | RED — the build succeeds silently on a dropped dir |
| `failExplicit.catchIgnoreCount` | 0 | 2.4b (corrected command) | **11** |
| `failExplicit.negativeControl` | true | 2.4c — a build patched so `stop()` throws must surface it | RED by absence; pencil-boil **0.10.1** installed, 0.11.0 unpublished |
| `rustEdges.godModulesOver500Unwaived` | 0 | 2.7a | **1 unwaived** (`assignment.rs` 607); `cage.rs` 558 and `search.rs` 528 also over |
| `rustEdges.futoshikiConforms` | true | 2.7b | RED — both signatures diverge |
| `rustEdges.wasmVerbBoundaryTests` | 15 | 2.7d — 5 generate × 5 solve × 5 propagate, verified against the 31-name `#[wasm_bindgen]` surface | RED by absence of the boundary tests |
| `rustEdges.testCountRestamped` | true | §P12 | FE unit **332** (31 files / 133 suites, banked W1 `f38c5130`, statically re-confirmed at HEAD). Any doc citing **204** as an FE count is stale by 128. Rust 208 and e2e (20 specs / 129 blocks) restamp from their own runs, not from memory. The live instrument is `scripts/check-doc-truth.mjs:599` (`test-count-208-vs-204`) |

**Exit conditions carried in from elsewhere, asserted at the W2 seal:** coverage floor (W1.14)
≥ baseline · unit lane (W1.1) ≥ 300 executed · `knip` 0 · doc-truth green · boundary 20/20 ·
`vue-tsc -b` 0 · `test:golden:bytes` · `test:prod-shake` · `test:font-coverage`.

---

## 6 · WHAT THIS RECORD OWES THE LEAD

Five calls that are the lead's, not the lane's, listed once and not re-litigated:

1. `productionSlotReads` — restamp to 40, or hold 25 as a floor and record 40 (§1.4.4).
2. The permalink break — **owner ratification**, the single disclosed behaviour change (§1.4.1).
3. `no-empty-catch` scope — does it cover `src/pencil/dev/**`? (2.4b).
4. `filterBudget.ts` — the lane recommends DEFER-and-record; 2.3 requires a recorded verdict (§1.4.5).
5. `madge` is absent — dev-dep or hand-rolled graph assertion for 2.1c. A missing instrument is not
   a passing gate.

ROW-COMPLETE

# DESIGNER ALPHA — the gestalt formulation (T5 component apotheosis)

**Tree** `web/frontend` @ `71456713d9f7361af80f09e1a456fc9787507e78` · formulated 2026-08-01 · NO source edits.
**Inputs of record**: `audit/r1/component-census.md` (213 rows) · `audit/r2/dup-matrix.md` · `audit/r1/consumer-truth.md` + `audit/r2/verify-arch-fiction.md` · `audit/r1/dead-code-census.md` §S1/S2/S6/S8 · `audit/r2/design-loop-open-rows.md` · `grand-audit-2026-06-02.md` §M3/§M4 (aesthetic guardrail).

---

## 0 · First principles — what a game IS

Strip the drift and the measured tree already answers. Every game is exactly:

1. **a model** — `use<Game>()` over `useGameState`'s 20-slot domain (dup §4.1: the state machine is already one file, 964 LOC);
2. **a geometry** — one of two families, SUDOKU-GEOMETRY `{boxed, subgrid n}` or LATIN `{side n}` (dup §1: the two sub-families explain most of the 67 DIVERGED pairs);
3. **a clue payload** — `void` / `Inequality[]` / `ThermoLine[]` / `KillerCage[]` / `KenKenCage[]` — carried on three seams: the board overlay, the wire, the persist blob (dup §2.3, §2.7, §2.13);
4. **solver verbs** — generate/solve/propagate against one wasm binary that already exports all 15 entry points from a single `.wasm` (consumer-truth §3A: 15/15, one binary, five workers loading the same bytes);
5. **furniture data** — size band, difficulty tier (byte-identical ×3, SHA `f9e17c23ce02`), canned poster.

Everything else in the five game dirs is the same file five times: 58% of the measured surface is neutralized-identical (dup §2.6, ≈1,970 of 3,395 non-base code lines), `ThermoGame.vue`↔`KillerGame.vue` differ by **2 code lines at 119 each** (census §2.2), and the five scenes all mount the same three shared shells (`GameScene` + `GameControlPanel` + `AnswerKeyLaminate`, verified `ThermoGame.vue:17-25,79-154`).

**The contract, minimal and total:**

```ts
GameSpec<TModel, TClue> = {
  model:     () => TModel                       // the use<Game> composable
  geometry:  { kind:"boxed", subgrid:(m)=>n } | { kind:"latin", side:(m)=>n }
  cell:      Component                          // DigitCell for all five today
  overlay:   Component | null                   // carets / tube / cage — the clue's face
  options:   (m) => ControlSection[]            // size + difficulty sections
  solver:    { marshal, unmarshal, nodeBudget } // per-game wire residue over ONE client
  persist:   { key, codec: BoardCodec | null }  // codec:null ⇒ no share URL, stated not stubbed
  poster:    () => Promise<Component>
}
```

Structure falls out: **one shell mounts the spec; a game dir holds only what no sibling could ever want.** The boundary law then holds by construction — 20/20 pairs — because the 20 live cross-game imports (census §5.1) all target things this design moves to `games/shared` (SudokuCell, sudoku's constants, sudoku's `Difficulty`, FutoshikiCell).

---

## 1 · Target structure tree

Per-file one-line charters. `(=)` unchanged, `(NEW)` created, `(≈)` rewritten in place. Everything not listed under `games/` dies (§4).

```
src/
  main.ts                    (=)  entry; dev rAF probe gate stays
  App.vue                    (≈)  gallery + host; sceneFor() now resolves a card's spec loader and mounts <GameShell :spec>
  assets/index.css           (≈)  @theme minus the 15 dead tokens (25 declaration lines out)
  assets/typography.css      (=)
  pencil/                         — THE LIBRARY-FACING SKIN (structure unchanged; shadows deleted per §2/§4)
    …all 47 pencil files…    (=)  except: glyphAnimations.ts (≈ drops createGlyphDrawIn), gridPaths.ts (≈ drops
                                  generateRectBoilFrames + arcBoilPoints bodies for lib calls), pencilConfig.ts (≈ dead keys out)
    composables/useTheme.ts  (moved in from src/composables/ — its 5 consumers are all pencil files; @/ alias dies)
  games/
    cards.ts                 (NEW) THE one registration table: GameCard[] — id, name, staging, persistKey, poster,
                                  spec loader (`() => import("@games/<g>/spec")`), eager. Replaces registry.ts's GAMES.
                                  Statically imports sudokuSpec for the eager main-chunk ride; no scene imports ⇒ no cycle.
    shared/
      defineGame.ts          (NEW) GameSpec type + defineGame identity fn. Imports nothing from cards.ts — the TDZ
                                  cycle (verify-arch-fiction, reproduced) is dead by construction, not by comment.
      GameShell.vue          (NEW) THE one scene: GameScene + BoardHost + GameControlPanel + AnswerKeyLaminate +
                                  peek union + prewarm — replaces five <Game>.vue (dup §2.1: T–Ki 0.8%).
      BoardHost.vue          (NEW) THE one board adapter over GameBoard.vue: geometry→peers/conflicts binds, reveal
                                  wiring, #cells = spec.cell, #overlay = spec.overlay — replaces five <G>Board.vue.
      geometry.ts            (NEW) boxed|latin → peersFn / adjacency / dims; absorbs the 5× peersFn copies (dup §4.2)
                                  and KenKen's boxless deletions as data, not forks.
      DigitCell.vue          (NEW) the ONE cell — SudokuCell↔FutoshikiCell are 2.7% apart (dup §2.12); the 6-line
                                  delta (marks grid cols, maxlength, aria suffix) becomes props fed from geometry.
      CageOverlay.vue        (NEW) the shared cage-boundary path + corner-cell + theme-CSS quartet (116 of 252 lines
                                  shared, dup §2.12); label rendering is a #label slot each game fills.
      difficulty.ts          (NEW) `Difficulty` + `difficultyOptions` + `DIFFICULTY_WORD` — one home for the
                                  byte-identical ×3 constants (SHA f9e17c23ce02) and the ×2 type (dup §2.9).
      persistence.ts         (NEW) createBoardPersistence({key, codec}) — resolveInitialState/persist/clear/share once;
                                  absorbs the V1-stub triple (SHA 8fb12bd9c9f8) + the codec pair's shared halves.
      solver/
        client.ts            (NEW) createSolverClient(game, {marshal, unmarshal, nodeBudget}) — replaces 5× useSolver;
                                  toRecord/toFlat (SHA 82412ac0756f) live here once. Exports SUDOKU_NODE_BUDGET
                                  (the ×3 table, SHA 7abc64aa6f7d) for the boxed trio's specs.
        solver.worker.ts     (NEW) THE one worker: ensureInit (SHA b6608ca40eab) + ping + verb table
                                  {game → {generate,solve,propagate}} over the ONE wasm binary — replaces 5 workers.
        protocol.ts          (≈)  the generic frame union: requests tagged by game id, clue payload as Uint32Array —
                                  replaces 5 per-game protocol.ts (dup §2.6: same three-member unions ×5).
        transport.ts         (=)  singleton + pending map + bounded respawn — already the shared floor.
        classifyError.ts / describeError.ts / solverError.ts  (=)
      base64url.ts           (moved in from src/lib/ — its 2 consumers are the codecs; @/ alias dies)
      GameBoard.vue          (≈)  dead props cornerMarks/centerMarks out (census §3.1); otherwise untouched.
      GameScene.vue          (=)  F3-lane surface — NOT touched by this tranche (design-loop §6).
      GameControlPanel.vue   (=)  BC-lane surface — T′ collapse is BC's row, NOT this tranche's (design-loop C4).
      useGameState.ts, useGameCell.ts, gameCell.css, scene.css, techniqueEngine.ts, techniqueVoice.ts,
      conflicts.ts, useUserMarks.ts, …all other shared files…  (=)
    sudoku/
      spec.ts                (NEW) the GameSpec: model useSudoku, boxed geometry, DigitCell, overlay null, options
                                  (the TDZ-forced hand-inline DIES — the shell reads the spec, 5/5), sizeOptions data,
                                  solver marshal + TEMPLATE_BANK/TIER_SOURCE threading, codec import.
      composables/useSudoku.ts (=)   codec.ts (≈ from useUrlState.ts — the ?board= v1 codec + v0 version arm, explicit)
      technique/sudokuTechnique.ts (=)   data/templates.ts (≈ gains TIER_SOURCE, §3-S1)   SudokuPoster.vue (=)
    futoshiki/
      spec.ts (NEW) · useFutoshiki.ts (=) · codec.ts (≈ inequality codec) · FutoshikiCarets.vue (≈ caret descriptors +
      glyph rotation math hoisted from FutoshikiBoard.vue:128-198 — used by BOTH BoardHost overlay and the poster,
      killing the 55-line intra-game dup, dup §2.11) · futoshikiTechnique.ts (=) · FutoshikiPoster.vue (≈) · types.ts (=)
    thermo/
      spec.ts (NEW) · useThermo.ts (=) · ThermoTube.vue (=, the 77-line genuine residue) · thermoWire.ts (=) ·
      ThermoPoster.vue (=) · types.ts (folds to spec.ts — 1 line of type)
    killer/
      spec.ts (NEW) · useKiller.ts (=) · KillerCageLabel.vue (≈ the sum label over shared CageOverlay) ·
      killerWire.ts (≈ gains kenken's truncation guard) · KillerPoster.vue (=) · types.ts (folds)
    kenken/
      spec.ts (NEW) · useKenken.ts (=) · KenKenCageLabel.vue (≈ `${target}${op}` + singleton case) ·
      kenkenWire.ts (=) · KenKenPoster.vue (=) · types.ts (=, KenKenOp + maps)
e2e/                         (=)  20 specs; goldens vs built dist only
```

Alias grammar after: `@pencil/*`, `@games/*` — two aliases, zero `@/` (census §1.5: `@/` served 10 sites reaching 2 leaf modules, both now colocated with their consumers).

**Library level (`@mkbabb/pencil-boil` 0.11.0)** — the skin stays the skin; the aesthetic guardrail (grand-audit §M3/§M4: hand-drawn is the identity, glass/generic UI adoption contrived) is untouched. Four asks upstream:
1. `createStrokeDrawIn` already takes explicit `pathLength` for hand-authored glyphs (consumer-truth S1) — app deletes `createGlyphDrawIn` + the inline dashoffset tween.
2. `boilRectFrames` gains `radius` + `grain` (S2: the app's fork reproduces lib output at `radius=0, grain=undefined`) — app deletes `generateRectBoilFrames`.
3. `ellipsePoints` gains an `a0→a1` arc sweep (S3: "one generalizing parameter apart") — app deletes `arcBoilPoints`.
4. `SequenceHandle.stop()` documented idempotent + never-throws, `stopAll(...handles)` exported — the 11 catch-ignores die (§3).
Surface prune rides the same release: `useLineBoil`, `useFilterParamBoil`, `BoilHandle`, `rasterizePose`, `rasterizePoseStack`, `isSelfContainedSvg`, `perturbPointsClosed`, `wobbleLine`, `catmullRomToBezier`, `isBoilHeld`, `RasterStackHandle`, `PoseSvgParts`, `RasterStackOptions` — 44 exports → ~28 (consumer-truth §2B).

---

## 2 · The absorption map

LOC are dup-matrix §3 normalized figures (×≈1.40 for raw). Identity: shell 1,137 + removable 2,966 + residue 1,191 ≈ 5,294 ✔ (residue grows +20 for spec scaffolds vs the matrix's shell-agnostic split).

| Twin family (Σ norm) | Lands at | Shell LOC | Removed | Residue → where |
|---|---|---:|---:|---|
| `Game.vue` ×5 (621) | `shared/GameShell.vue` | 113 | 449 | 59 → `spec.ts` options/prewarm flags; sudoku's 17-line TDZ inline DIES (the wall itself is demolished, dup §3-e) |
| `Board.vue` ×5 (996) | `shared/BoardHost.vue` + `geometry.ts` | 191 | 661 | 136 → futoshiki 101 into `FutoshikiCarets.vue`; 11/11/12 overlay binds into specs |
| cell/furniture (798) | `shared/DigitCell.vue` + `shared/CageOverlay.vue` | 319 | 370 | 108 → `ThermoTube.vue` 77; cage labels 9/11 into `<G>CageLabel.vue` |
| `useSolver` ×5 (619) | `shared/solver/client.ts` | 96 | 364 | 151 → per-game marshal fns in `spec.ts` (futoshiki `toFlatInequalities`, sudoku templates thread) |
| `solver.worker` ×5 (480) | `shared/solver/solver.worker.ts` | 84 | 328 | 66 → the verb-table rows + clue transfer lists (name-only, ~13/game) |
| `protocol` ×5 (305) | `shared/solver/protocol.ts` | 52 | 208 | 45 → per-game clue-frame type aliases beside each wire |
| `UrlState` ×5 (698) | `shared/persistence.ts` | 205 | 335 | 158 → `sudoku/codec.ts` 44 + `futoshiki/codec.ts` 84; stub triple = a bare `createBoardPersistence({key, codec:null})` call each |
| `game.ts` ×5 (172) | `shared/defineGame.ts` + specs | 23 | 91 | 58 → the spec bodies (real ones — the shell reads them) |
| `use<Game>` ×5 (246) | stays per game | 23 | 84 | 139 → the 20 domain one-liners; `SUDOKU_NODE_BUDGET` ×3 (SHA 7abc64aa6f7d) exported once from client.ts |
| `Poster.vue` ×5 (217) | stays per game (canned data) | 9 | 32+55 | 175−55: futoshiki's re-implemented caret math (dup §2.11) replaced by `FutoshikiCarets` reuse |
| `CP/constants` ×3 (46) | `shared/difficulty.ts` + spec size bands | 11 | 22 | 13 → per-game `sizeOptions` data in specs; `ControlPanel/` dirs die (census §3.7) |
| `*Wire` ×3 (79) | stays per game | 11 | 22 | 46 → prefix widths are wire facts; kenken's truncation guard replicated to killer/thermo (dup §2.13 BY-DRIFT gap) |
| `types.ts` ×5 (17) | `shared/difficulty.ts` (+2-copy `Difficulty`) | 0 | 4 | 13 → clue types beside their furniture |

**Net app arithmetic** (dup §5): the measured 7,387-raw estate lands at ≈1,590 raw of shared shell + ≈1,640 raw of named residue ⇒ **≈−4,150 raw LOC**, five game dirs at roughly 330 (killer) to 700 (futoshiki) raw each. Plus: pencil shadow deletions ≈−200 raw, token lines −25, catch arms −33, dead props −7 binds.

---

## 3 · The registry verdict: RETIRE THE FICTION, MAKE THE CONTRACT TRUE BY INVERSION

**Verdict.** `gameRegistry`, `GameDefinition`, and `defineGame`-as-declared are **retired wholesale** — and the contract idea is reborn as the *running* architecture: `GameSpec`, consumed at runtime by `GameShell`, five of five games, every slot live **by construction**, because the shell has no other source to read from. No test-only theater survives: `registry.test.ts`'s consumer-simulation dies with the map it kept alive; the replacement tests mount the shell against each spec (real consumption, not asserted absence — `registry.test.ts:131`'s `not.toHaveProperty("thermo")` was a test ratifying its own fiction).

**The facts that force it** (all verified adversarially):
- `gameRegistry` has **zero production consumers** over eight attack vectors (verify-arch-fiction I1a; consumer-truth U1) and holds 2 of 5 games (I1b).
- 4 of 5 `GameDefinition` slots have zero production readers; the fifth (`options`) is read by 4 of 5 scenes — and the one abstainer is the eager default (I1c, F2).
- `sudokuGame` ships as **315 unreferenced bytes in the 239,693-byte main chunk** — undeletable by the bundler (registry.ts:18 holds it) and unusable by the author (the TDZ, reproduced: `ReferenceError: Cannot access 'sudokuGame' before initialization`) (N1, TDZ section).
- The W11 charter's gates measured declaration + compilation, never a runtime reader (F1) — the fiction was born green.

**Why inversion and not make-true-in-place**: wiring five existing scenes to read five slots manufactures consumers for a parallel structure while keeping 843 raw LOC of 0.8%-divergent scenes alive. The dup matrix says the scenes ARE one file; the honest consumer of a game contract is the one shell that renders every game. Making the fiction true without the collapse would re-create P12's original sin — "the shell's contract re-satisfied ad hoc per game" — one level up.

**What replaces the retired pieces:**

| Retired | Replacement | Consumer proof |
|---|---|---|
| `gameRegistry` (registry.ts:134-137) | nothing — `cards.ts` was always the real table (consumer-truth §1A/1B: 5⇄5 closes) | `App.vue` route + gallery, as today |
| `GameDefinition` 5 slots | `GameSpec` 8 slots | `GameShell.vue`/`BoardHost.vue` read every slot at mount; a slot the shell doesn't read is deleted from the type |
| `defineGame` hoisted-fn cycle trick | `shared/defineGame.ts`, zero imports from cards.ts | the cycle edge cannot exist: specs never import the table, the table never imports scenes (there are no scenes) |
| sudoku eager static-scene import | cards.ts statically imports `sudoku/spec.ts` | same main-chunk ride, DAG-clean; `madge --circular` = 0 |
| `SudokuGame.vue:57-73` hand-inline | dies — the shell reads `spec.options` for sudoku too | 5/5, the first time the estate has ever had it |

---

## 4 · The kill list

Every row cites its census/audit line. Grouped by species.

**Files (37 dead outright, replaced per §2):**
| # | Dies | Cite |
|---|---|---|
| 1–5 | `SudokuGame.vue`, `FutoshikiGame.vue`, `ThermoGame.vue`, `KillerGame.vue`, `KenKenGame.vue` | dup §2.1 (T–Ki 0.8%); census §2.2 (2-line clone) |
| 6–10 | `SudokuBoard.vue`, `FutoshikiBoard.vue`, `ThermoBoard.vue`, `KillerBoard.vue`, `KenKenBoard.vue` | dup §2.2 (T–Ki 2.0%, 11 of 13 diff-lines comments) |
| 11–15 | 5× `solver/useSolver.ts` | dead-code S6; dup §2.4 |
| 16–20 | 5× `solver/solver.worker.ts` | dup §2.5 (tightest class, ensureInit SHA-identical ×5) |
| 21–25 | 5× `solver/protocol.ts` | dup §2.6 |
| 26–28 | `thermoUrlState.ts`, `killerUrlState.ts`, `kenkenUrlState.ts` | dup §2.7 (T–Ki 4.1% TWIN, stub triple SHA 8fb12bd9c9f8) |
| 29–31 | 3× `ControlPanel/constants.ts` + the three `ControlPanel/` dirs | census §3.7 ("no ControlPanel.vue exists anywhere"); dup §2.3 (f9e17c23ce02) |
| 32–33 | `sudoku/types.ts`, `futoshiki/types.ts` re-export shells | census §1.4; dup §2.9 (2-copy `Difficulty`) |
| 34 | `FutoshikiCell.vue` (folds into DigitCell) | dup §2.12 (S–F 2.7%, 220/452 shared) |
| 35 | `SudokuCell.vue` at its cross-game-imported path (promoted to shared/DigitCell.vue) | census §5.1 (thermo/killer import it depth-3) |
| 36 | `registry.ts` (split: cards.ts + shared/defineGame.ts; gameRegistry/GameDefinition die untranslated) | consumer-truth U1/U2; verify-arch-fiction N1 |
| 37 | `useButtonAnimation.ts` (14 LOC, 1 consumer — inlines into its panel) | census §3.5 |

**Exports/props/keys:**
| Dies | Cite |
|---|---|
| `AnswerKeyLaminate.vue:29` `subgridSize` required-unread prop + its 5 bind sites | census §3.1 |
| `GameBoard.vue:81-82` `cornerMarks`/`centerMarks` + 10 bind sites | census §3.1 |
| `PENCIL.{gridFrame,gridSubgrid,gridCell,logoText,vine}` (5 of 6 keys dead) | census §3.4 |
| `YOSHI_COLORS.{apple,banana,grapes,flower,vine}` + `leaf.vein` | census §3.4 |
| `__resetStagingBridge` production export (replaced by vitest module-reset) | census §5.2; dead-code S7 |
| the 18 widened-type exports → file-local declarations | census §5.4a |
| `gameRegistry`, `GameDefinition` + its 4 dead slots, `sudokuGame`'s 315 dead bytes | U1/U2/N1 |

**Style tokens (15, = 25 declaration lines):** the 10 shadcn defaults at shadcn's literal values (`--color-{card,popover}-foreground`, `--color-primary[-foreground]`, `--color-secondary[-foreground]`, `--color-accent-foreground`, `--color-destructive[-foreground]`, `--color-input`, light + `.dark` twins) plus `--font-serif`, `--color-{easy,medium,hard}`, `--ink-press-firm` — census §4.2, `index.css:129-268/368-382`. The stale `index.css:385` comment goes with them. No variant-system reimports anywhere after (census §4.1 is already clean: no cn/cva/radix, and stays that way).

**Masks → structural answers (FAIL-EXPLICIT):**
| Mask | Structural answer | Cite |
|---|---|---|
| `TEMPLATE_BANK[size]?.[…] ?? []` — three states collapsed | `TIER_SOURCE: Record<size, Record<tier,'bank'\|'livegen'>>` emitted by the vite plugin and asserted at build: declared-'bank' + empty ⇒ **build fails**; declared-'livegen' ⇒ the lookup is never made. The excision becomes a declaration; a lost directory reds. | dead-code S1; census §5.2 |
| the 11 `try { h.stop() } catch { /* ignore */ }` | pencil-boil 0.11 contract: `stop()` idempotent, never throws + `stopAll` export; all 11 arms deleted. Zero catches, one documented contract. | dead-code S2 |
| `useStagingBridge.ts:154/242` corrupt-ledger-reads-as-empty | parse failure clears the key and records the fact — never returns first-run shape | S3 |
| `rasterPose` `""` on three failures | "not yet" holds the live-filter fallback (the header's stated intent); "broken" throws in dev | S4 |
| the 3 fail-quietly paths (`useGameState.ts:652`, `useAnswerKeyPeek.ts:37`, `usePencilMarks.ts:40`) | routed through `classifyError` into the paper-note taxonomy — the same file's own precedent at `:459-460` | S5 |
| stub games' no-op `writeShareUrl` | `codec:null` ⇒ the shell doesn't render Share for that game — a stated absence, not a silent no-op. DELTA + owner note (visible button-row change). | dup §2.7 |
| `App.vue:188` `.catch(() => {})` preload swallow | logged one-line dev warn; recoverable path unchanged | S9 |
| sub-floor guards `mq.addEventListener?.` ×2 | plain calls — floor is Safari 26.4/iOS 19, stated once | dead-code S8 |
| sudoku/futoshiki v0 permalink arm | RETAINED as an explicit `case 0:` in the versioned codec — a versioned protocol arm, not a mask; unknown versions surface a visible paper-note instead of decoding as garbage | census §5.2 |

**Deferred, deliberately (not killed here):** `filterBudget.ts` app-orphan relocation (census §1.1) — lane D owns its prose (design-loop D-M2, the pre-settle 21); moving it mid-loop fights a live cure. Re-visit after pass 5. `GameControlPanel.vue`'s dual template trees — **BC's T′ row, not this tranche's** (design-loop C4: "the five-game twin estate is NOT a design-lane row" cuts both ways). `TallyDescriptor.expand` + `DifficultyTally` dead tabindex — BC's residue rows.

---

## 5 · Landing order — six waves, gates born RED

Sequencing law: **W1–W4 touch no design-lane surface** (`GameScene.vue`, `GameControlPanel.vue`, `GameGallery.vue` untouched); **W5 lands only after the pass-5 lane cures are in**, on a single md5-proven tree per MEASURE discipline (design-loop §5.4). Production stays `f1adfca5` throughout; deploy remains the team lead's.

**W0 · Dead matter** (no behavior change)
Kills: 15 tokens, dead props ×3 + 15 bind sites, PENCIL/YOSHI dead keys, widened-type exports, sub-floor guards, `@/` alias fold (base64url → games/shared, useTheme → pencil/composables), re-export shells, `useButtonAnimation` inline.
- GATE (born RED): `scripts/token-census.mjs` — asserts 0 unreferenced `@theme` tokens; **RED today at 15** (census §4.2). Negative control: re-add `--color-input` ⇒ red.
- GATE (born RED): a props probe asserting `grep -c subgridSize src/pencil/sheet/AnswerKeyLaminate.vue` ≤ 0 declarations-without-reads via the census's props.mjs re-run; **RED today at 3 dead props**.
- π: `golden:bytes` PASS — all goldens byte-identical (nothing visual moved). vue-tsc 0, vitest green, knip 0.

**W1 · FAIL-EXPLICIT floor**
TIER_SOURCE; staging-ledger clear-and-record; rasterPose split; classifyError routes ×3; preload warn.
- GATE (born RED): `e2e/tier-source.spec.ts` — build with `csp-solver/data/sudoku_puzzles/3/hard` renamed away must FAIL the build; **RED today: the build succeeds silently** (vite.config.ts:50-53, dead-code S1 — "a dropped directory and a deliberate excision produce byte-identical output").
- GATE (born RED): unit — corrupt `localStorage` ledger JSON must yield `{cleared:true}` + recorded fact; **RED today: returns `{}`** (S3).
- π: goldens byte-identical (no visual surface touched).

**W2 · pencil-boil 0.11.0** (library wave)
Upstream S1/S2/S3 shadows; `stop()` contract + `stopAll`; surface prune 44→~28. App deletes `createGlyphDrawIn`, `generateRectBoilFrames`, `arcBoilPoints`, all 11 catch arms.
- GATE (born RED): `grep -rn 'catch { /\* ignore \*/' src | wc -l` = 0 asserted by lint rule (no-empty-catch-comment); **RED today at 11** (S2). Lint rule lands same-commit as the deletion (lessons rule: ruling + enforcing config same commit).
- GATE (born RED): pencil-boil unit — double-`stop()` + stop-after-unmount idempotence; RED against 0.10.1's undocumented contract, GREEN on 0.11.
- π: glyph draw-in, grid boil, divider, toggle goldens — darwin soul 0.017, linux coarse floor 0.05 on the two non-convergent surfaces; **any pixel drift outside floors reverts the wave**. DELTA crops: logo draw-in before/after at 3 beats.

**W3 · The solver spine** (one client, one worker)
`client.ts` + `solver.worker.ts` + generic `protocol.ts`; five specs' marshal residue extracted; 15 files die.
- GATE (born RED): `games/shared/solver/client.test.ts` — parity harness: for each game, generate(seed-fixed)/solve/propagate through the NEW client must equal recorded fixtures from the old five; **RED at wave start** (module doesn't exist), GREEN at close. Grep rows are not gates (MEASURE law 4) — the parity fixtures are the gate.
- GATE: e2e cross-game session — deal sudoku, switch to kenken, deal, solve — one worker serves both, `errors []`; run on chromium AND real-Safari rig (the T4-P1 rig exists).
- GATE: wasm subpath import count 5→1 — narrows N2's blast radius (verify-arch-fiction: the unpinned wasm-pack exports-map risk now has one exposure site, not five).
- π: none (no visual surface). Bundle-size row: worker chunk count 5→1, main chunk not larger (the wasm URL import moves, doesn't multiply).

**W4 · Cell, cage, persistence**
`DigitCell.vue`, `CageOverlay.vue` + per-game labels, `persistence.ts` + two codecs, stub-share honesty.
- GATE (born RED): DigitCell parity spec — mounts sudoku-mode and futoshiki-mode cells, asserts marks-grid cols (`ceil(√boardSize)` vs subgrid), maxlength (3 at ≥10), aria suffix; RED until component exists; the six divergence lines (dup §2.12) each get an assertion.
- GATE (born RED): codec round-trip property test incl. the explicit `case 0:` arm + unknown-version paper-note; **RED today for unknown-version: current code treats any non-version byte as v0** (census §5.2 — the ratchet collapses unknown to legacy).
- π: cell crops per game light+dark (marks, digits, error ink) within golden floors. DELTA: killer/kenken cage-label crops — the 0.26/0.24 font-size BY-DRIFT split (dup §2.12) unifies; the crop pair goes to the owner with the wave.
- DELTA + owner note: thermo/killer/kenken panel button row without Share (the no-op dies).

**W5 · The inversion** (after pass-5 lane cures land; single tree, md5-proven)
`GameShell.vue`, `BoardHost.vue`, `geometry.ts`, `cards.ts`, 5× `spec.ts`; registry.ts + 5 scenes + 5 boards die; `FutoshikiCarets.vue` extraction. Lands whole — no dual mount path, no shim, one commit.
- GATE (born RED): the TDZ probe — verify-arch-fiction's 4-module reproduction, inverted: `node tdz-probe.mjs` against the NEW graph must boot; the OLD graph arm reproduces `Cannot access 'sudokuGame' before initialization`; **RED today by construction**. `madge --circular src` = 0, asserted in CI.
- GATE (born RED): spec-consumption test ×5 — mount GameShell with each spec, assert every GameSpec slot is read (model called, geometry applied, options rendered, solver pinged, persistKey written); **RED today: 4 slots have zero production readers** (I1c).
- GATE: the 17 built-dist gates + 115 e2e + covis suite re-run on the shell tree; **pageVh at 390×664 ≤ 1.705** (must not regress F3's number; any improvement is F3's to measure and claim, not this wave's — design-loop C4 routing).
- π: full-page goldens, five games × light/dark × fine/coarse, against pre-wave crops — within floors; wordmark/logo/toggle untouched surfaces byte-identical. Real-Safari boot row (the d4e8e41e pattern): booted · dealt · errors [] on iOS 19.
- GATE: eslint boundary rule — ONE config: `games/<g>/**` may not import `@games/<h≠g>`, all 20 ordered pairs; lands **same commit** as the last cross-game import's death; born-RED demonstrated by running the rule against the pre-wave tree (**20 violations**, census §5.1) and 0 after.

**W6 · Close-out census**
Re-run the full r1 instrument set (graph.mjs, dup.mjs, props.mjs, tokens.mjs, exports.mjs, knip) on the landed tree; the census deltas ARE the acceptance sheet: twins 8→0 among absorbed classes, cross-game imports 20→0, dead exports 37→≤5 (test-cost residue only), single-consumer count down by the ~30 absorbed leaves. Deploy note carries the standing design-loop disclosures verbatim (trigger (b) unbought unless F3 says otherwise).

---

## 6 · Risks + the rejected alternative

**Risks.** (1) W5 is the big-bang wave: one shell replacing ten components in one commit concentrates regression risk — mitigated by the parity fixtures (W3), the DigitCell assertions (W4) landing *before* it, the full golden matrix, and the real-Safari boot row; the shell must reproduce sudoku's prewarm-on-idle and eager-chunk ride exactly (spec statically imported in cards.ts — verified DAG-clean by the TDZ probe). (2) The one-worker collapse serializes five games onto one wasm instance — acceptable because only one live board ever exists (Teleport projection) and transport's pending map multiplexes; the cross-game e2e gate covers it. (3) Cage-label unification and Share-button honesty are *visible* changes riding a "byte-identical" tranche — both carry DELTA crops to the owner before landing, and either can be reverted to spec-level data without touching the architecture. (4) Design-loop collision: W5 rebuilds files whose geometry the covis/ticket gates measure — hence the hard sequencing rule (after pass-5 cures, single md5 tree, covis re-run ≤1.705) and the C4 ownership fence (T′, tally residue, and the −155 stay BC's; this tranche's LOC ledger claims none of it).

**The rejected alternative: make-true-in-place.** Keep the five scenes and five boards, wire each to read all five `GameDefinition` slots, fold thermo/killer/kenken into `gameRegistry`, and break the TDZ by lazying sudoku's definition. Rejected because it spends the whole registry budget buying consumers for a parallel declaration while leaving the measured disease untouched: the 2-line scene clones, the 13-diff-line boards, the five solver clients, and the 20 cross-game imports all survive, so the next game still lands by five-fold copy — the exact recurrence P12 was chartered to end (verify-arch-fiction F1). It also keeps `sudokuGame` addressable only by re-architecting the same cycle the inversion deletes for free, and its end state — five hand-wired scenes proving they match a definition nothing else runs — is the current fiction with better alibis. The dup matrix prices the difference at ≈4,150 raw LOC and 20 boundary violations; in-place buys none of it.

---

## 7 · UNKNOWNs carried

- Whether Tailwind 4.3 emits the 15 dead tokens into `dist/` (census §7) — moot after W0, noted for the census delta.
- Sudoku's 16-cell node budget vs futoshiki's at the same cell count — why `nodeBudget` stays spec data, not a cells-keyed shared curve (dup §2.10).
- H3 flank-inert under VoiceOver (design-loop §6 hygiene) — A-wave's row, untouched here.
- wasm-pack ≥0.16 exports-map emission (verify-arch-fiction R3) — W3 narrows exposure 5→1; the generator pin is a CI row outside this formulation.

ROW-COMPLETE

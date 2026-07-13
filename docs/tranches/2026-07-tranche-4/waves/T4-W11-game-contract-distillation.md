# T4-W11 — The game contract + twin distillation

**The two game dirs are near-twins — ~1,700 line-identical lines, 34% of their 5,059-line mass — and the reason is an absence: no type says what a "game" IS to the shell. This wave extracts the shells in risk order, then names the contract they satisfy, so game #3 plugs in instead of forking sixteen files.** x6 put the twin duplication under a ruler; r2-arch corrected the shape (the solver seam is the crown, the Board/ControlPanel merges r2 first declined are right at the LOC grain, wrong at the file grain — extract *shells* with furniture slots, never merge the files). The keystone deliverable is `defineGame<TBoard, TCell, TClue>()` (FE) + `PuzzleClass` (Rust): the shells become the contract's implementation, a game dir becomes `{ model, cell-furniture, clue-furniture, options, solver payloads }`. The floor is **~1,600–1,900 net LOC removed** (r3-trued); the full e2e + rust + visual-golden suite is the **unedited invariant** across every row.

**Dependencies**: ← W4 (the solver-seam's low-risk ~600 LOC tier lands there — `classifyError`/`solverError` byte-twins + the transport envelope; W11 builds on that seam, does not redo it), ← W2 (the visual-golden system + the SSIM soul gates the HIGH-tier shells extract under, born RED), ← W6→W7 (generation + technique truth settle the domain ops the shells slot around). Feeds **W12** (the carousel's `GameCard` contract consumes this wave's `defineGame`) and **W13** (Thermo/Killer/KenKen ship as one `PuzzleClass` + one payload builder + one furniture slot — the contract's acceptance proof). **Effort**: L.

---

## The measure this wave acts on (x6 (a), rerunnable)

The twin census (`comm -12`, code-only, comment/blank stripped) at HEAD 65425697:

| Twin pair | code A / B | identical | % of smaller | shell verdict |
|---|---|---:|---:|---|
| `ControlPanel.vue` | 610 / 491 | 453 | 92% | control-shell (r2 declined the wrong shape) |
| `SolverErrorNote.vue` | 105 / 101 | 95 | 94% | verdict-note fold |
| `Cell.vue` | 360 / 360 | 320 | 88% | cell-shell |
| `Board.vue` | 610 / 593 | 455 | 76% | board-scene-shell |
| `use<Game>.ts` | 374 / 361 | 300 | 83% | state machine shared, domain ops slot |
| `Game.vue` (scene) | 175 / 165 | 104 | 63% | scene scaffold |
| `conflicts.ts` | 62 / 65 | 39 | 62% | conflict-marking generic |
| `classifyError.ts` / `solverError.ts` | — | — | **byte-identical code** | done in W4 (solver seam) |

Aggregate ~2,100–2,200 line-identical; discount ~15–20% trivial structural lines → **honest floor ~1,700 lines of verbatim twin duplication**, the single largest reduction reservoir in the product. Probe: `comm -12 <(codeonly sudoku/ControlPanel.vue|sort) <(codeonly futoshiki/ControlPanel.vue|sort) | wc -l` → **453** (x6 §Probes).

**The r2 correction, load-bearing:** r2-arch declined a shared `Board`/`ControlPanel` as "vanity DRY" at the *whole-file* grain — correct, you cannot merge the files (subgrids vs inequality furniture genuinely diverge). But the divergence is **localized, not pervasive**: ControlPanel's only real divergence is Sudoku's difficulty section (~40 lines) + the mobile tab-toggle that exists *only because Sudoku has 2 sections*; the action-button row, hold-to-peek `BoilDivider`, drawer wiring, and all `<style>` (~450 lines) are verbatim. That is a `<GameControlPanel>` **shell taking section-slots**, not a lossy merge. Extract shells with furniture as game slots; never merge the files.

---

## Scope — the shells in risk order

The order is load-bearing: LOW-risk mechanical rows first, the owner-audited hot paths last under the full π/DELTA gate born RED (x6 §Ordering). The contract is *produced* by the shells, not fought — declare it as the intersection the shells already need, so game #3 is additive.

### Row 1 — verdict-note fold (P5, NEW, LOW)

Fold `SolverErrorNote.vue` (94% twin) into one `games/shared/SolverErrorNote.vue`; the game supplies the on-board conflict renderer via slot. Kills the doubled `note-slide-in`/`note-fade-in` keyframes (x6 A4). Est. **−95 LOC**. This rides directly on W4's solver seam (the error *fiction* — `classifyError`/`solverError` — is already shared there; this folds the *presentation*).

### Row 2 — control-shell (P9, NEW, MED — contradicts r2's decline)

`games/shared/GameControlPanel.vue`: heading-slot(s) + action-button row + hold-to-peek `BoilDivider` + drawer host + CSS. Sudoku passes 2 sections (size + difficulty) + the tab-toggle; futoshiki passes 1. Kills the doubled `sharePop`/`eraserScrub` keyframes. Est. **−400 to −450 LOC** (of the 453 identical). **The single-section path is the risk**: the mobile `expandedPanel` tab affordance (`ControlPanel.vue:130`, `expandedPanel = ref<"size"|"difficulty">`) exists only because Sudoku has 2 sections — the shell must accept 1..n sections and render tabs only at n ≥ 2 (KISS: n-section-generic). Prove no behavior drift on the single-section (futoshiki) path.

### Row 3 — cell-shell (P3/P4/P11, NEW, MED-HIGH)

`games/shared/GameCell` — the pencil-mark grid + `ghost-draw-on`/`marks-fade-in`/reveal keyframes + conflict-shake + selection model. Furniture (`FutoshikiCaret`, subgrid ticks) stays a per-game slot. Est. **−280 to −320 LOC** (of the 320 identical). **Cells are the hottest render path** and perf is an owner P0 — extract as a *thin composable + slotted furniture*, NOT a wrapper component that adds a vnode layer (the extra layer would add reactivity depth on the hot path). This is also where W10's `:ref` discipline and `flourish` inject must already be settled (they are — W10 lands before W11).

### Row 4 — board-scene-shell (P10/P11, NEW, HIGH)

`games/shared/GameBoard.vue` + `GameScene.vue`: grid scaffold + completion-vignette mount + error-note host + drawer choreography + logo/board centering. Furniture (subgrid lines vs inequality glyphs) = slot; `conflicts.ts` → `games/shared/conflicts.ts` generic + per-game adjacency. Est. **−450 to −520 LOC** (Board 455 + Game shell 104 + conflicts 39, minus slot glue). **This is the completion-choreography + drawer surface the owner audited four times in T3** (the drawer easing, the golden-board reveal, the completion vignette) — the extraction MUST reproduce them exactly. It lands last, under the heaviest golden obligation.

### The keystone — `defineGame` + `PuzzleClass` (P12, the deliverable)

The shells above are the *implementation*; the contract is the *type* they satisfy, declared once the three shells land (it is their union, x6 §ordering):

```ts
// web/frontend/src/games/registry.ts  — the named game interface (NEW; the absence P12 names)
defineGame<TBoard, TCell, TClue>({
  model,          // board + cell reactive model (the per-game state the shells wrap)
  cellFurniture,  // the slot component: caret (futoshiki) / subgrid ticks (sudoku)
  clueFurniture,  // the constraint renderer (inequality glyphs / — )
  options,        // OptionSelector config (size / difficulty — genuinely divergent, per shared/types.ts)
  solverPayloads, // request builders over W4's shared createSolverClient
})
```

- **KISS guard against a lossy god-interface**: the contract is *only* the intersection the shells already need; anything game-specific stays a slot/impl, never a config flag. Over-abstraction (a config-flag god-interface) is the named failure mode — the guard is that every field above is either a component slot or a per-game function, not a boolean toggle.
- **Rust half — `PuzzleClass`**: the trait each game impls (base CSP + clue-furniture placement) that the generic generator consumes. W13's Thermo-Sudoku is the acceptance proof: zero new constraints, one `PuzzleClass` + one payload builder + one furniture slot → a third game with the shell, drawer, pencil-marks, solver transport, completion choreography, and generator inherited for free. (The `generate_by_digging<C: PuzzleClass>()` generic and the two n-ary cage primitives are W13's rows — W11 declares the trait, W13 lands the impls.)

---

## The invariant — facility preservation (x6 A6, the unedited rule)

The suite that MUST stay green across every row above, **unedited except deletions of tests that assert the duplication itself** (none exist — the suite tests behavior, not structure):

- **44 e2e cases** across the Playwright specs (`affordances`, `digit-pad`, `drawer`, `futoshiki`, `permalink`, `sudoku-interaction`, `throttled-void`, `visual-regression`) — the user-facing facility census. (x6 counted 55 via a broader grep at HEAD; the citable `test(`-count is 44, re-stamped at gate SHA per WGATE — the *invariant* is "every case green unchanged," not the integer.)
- **174 Rust tests** (`csp-solver/src` + `tests/`) — the solver-facility census.
- **The visual-regression π/DELTA goldens** (boil, completion vignette, toggle, drawer glide) — the aesthetic facility census; any shell extraction reproduces them byte-for-π.

The rule is absolute: **extract, then the identical 44 e2e + 174 rust + the visual goldens pass unchanged.** A row that needs a test edited to pass has changed a facility, not distilled it.

---

## Gates

Born RED where the duplication is live today; the extraction gates go GREEN only when the invariant suite passes unedited.

| Gate | Value (born RED today) |
|---|---|
| twin reservoir | `comm -12` ControlPanel twins returns **453 identical lines today** (RED); after Row 2, the shared shell replaces them and the count of cross-dir identical lines drops by the extracted mass. Same probe for Cell (320), Board (455), SolverErrorNote (95) |
| doubled keyframes | `for k in sharePop eraserScrub note-slide-in note-fade-in marks-fade-in ghost-draw-on; do grep -rln "@keyframes $k"; done` returns **two files each today** (RED); after the shells, one each |
| net LOC floor | `cloc web/frontend/src/games` at gate SHA shows **≥ 1,600 net lines removed** from the game dirs vs HEAD 65425697 baseline (the ~1,600–1,900 r3-trued floor); the reduction is real deletion, not relocation into a larger shell |
| contract exists | `defineGame` + `PuzzleClass` are **absent today** (`grep -rl defineGame` empty — RED, the P12 absence); after, both games are declared through the contract and a game dir is `{ model, cell-furniture, clue-furniture, options, solver payloads }` |
| contract acceptance | a **third-game stub** (W13's Thermo-Sudoku `PuzzleClass`, S-effort) compiles against the contract **with zero shell edits** — the acceptance proof that the contract is the intersection, not a fork point (born RED: no third game compiles today) |
| **invariant — e2e** | full green (**44 cases, unedited**) — `throttled-void` + `sudoku-interaction` error paths + `drawer.spec` easing especially; no test file touched except the impossible duplication-assert deletion (there are none) |
| **invariant — rust** | **174 tests green, unedited** across all harnesses |
| **invariant — goldens (π)** | every visual golden byte-for-π: cell goldens (Row 3), completion vignette + golden board + drawer glide (Row 4), the note card (Row 1), both control panels (Row 2). **DELTA**: `shell-extract-goldens/` before/after pairs, AE=0 |
| **invariant — perf (DELTA)** | the cell-shell (Row 3) and board-scene-shell (Row 4) preserve the **idle 0-paint invariant** and the boil FPS floor (owner P0) — `cell-shell-idle-paints.json` shows 0 steady-state paints post-extract; no added vnode layer / reactivity depth on the cell hot path |
| Types | `vue-tsc -b` → exit 0; `cargo build` clean (the `PuzzleClass` trait compiles both game impls) |
| Boundaries | `eslint .` → exit 0; the `games/shared/**` layer stays game-agnostic (the three-home tripwire from T3-W7 holds — the shells import nothing from `@games/{sudoku,futoshiki}`) |

---

## Seeds

- `x/x6-distillation.md` — (a) the twin census + top-20 file sizes + the ~1,700-line reservoir; (b) the 12 atomic precepts (P1–P12) with canonical site + every duplicate; (c) the wave-shaped reduction plan with per-row LOC deltas, risk, and born-RED gates; the ~2,300 gross / ~1,600 shell-bulk floor; the game-agnostic dividend; the ordering/risk note (LOW-risk mechanical first, owner-audited hot paths last). §Probes (rerunnable `cloc`/`comm`/`diff`).
- `r2/r2-arch-transposition.md` §T1 (solver seam — the crown, done in W4), §T4 (three-home rule settled right, exc. the solver seam), §Non-transpositions (the whole-file merges declined — the LOC-grain shell extraction is the corrected shape).
- `registry/families.md` FAM-5 (twin duplication, byte-identical solver files), the r3-expansion-crit binding: floor trues to ~1,600–1,900 LOC; the technique engine (W7) grades over self-computed candidates (the domain-op divergence the `use<Game>` state machine slots around).
- Live measure at HEAD 65425697: `games/sudoku` 2,555 / `games/futoshiki` 2,504 / `games/shared` 762 code lines; 44 e2e `test(` cases; 174 rust tests.

## Residual risks

- **Every LOC integer is indicative (K10/K18)** — re-measure `cloc`/`comm` in-wave; the load-bearing facts are the green unedited suite + the byte-for-π goldens + the ≥1,600 net-removed floor, not the exact deltas.
- **The cell-shell is the sharpest perf risk** — a wrapper component adds a vnode layer on the hottest render path; the extraction MUST be a thin composable + slotted furniture. If the composable form cannot preserve the idle 0-paint invariant, the row stops at the goldens gate — a slower cell is a lost facility, not a distillation.
- **The board-scene-shell touches the four-times-owner-audited completion surface** — the drawer easing (now on W10's glass token), the golden-board reveal, the completion vignette. The extraction reproduces them exactly or it does not land; the full golden set is its born-RED gate, not a spot check.
- **Over-abstraction is the contract's failure mode** — a config-flag god-interface that encodes game-specifics as booleans is worse than the twins. The KISS guard is structural: every `defineGame` field is a slot or a per-game function, never a toggle. If a difference wants a flag, it is a slot the contract missed.
- **The single-section control path (futoshiki) is the control-shell's silent risk** — the tab affordance is Sudoku-only; a shell that assumes n≥2 sections would render dead tabs on futoshiki. The n≥2-only tab render is the specific behavior-drift gate.
- **`defineGame` acceptance is proven by W13's stub, not asserted here** — W11 declares the contract; the zero-shell-edit third game is the proof, and it lands in W13. If Thermo needs a shell edit, the contract was drawn wrong and re-enters here.

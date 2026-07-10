# A12 — WAVE RE-AUDIT W8 + SKEPTICAL edict re-check @ HEAD (3b75eca2)

W8 = commit `c14995eb` "T2-W8: grand recursive colocation — per-game solver/ modules, manifest total".
Manifest: `docs/tranches/2026-07-tranche-2/evidence/execution/T2-W8-manifest.md`.
Wave doc: `docs/tranches/2026-07-tranche-2/waves/T2-W8-colocation.md`.
Consumes pass-1 R5 (`scratchpad/tranche3/pass1/R5-fe-structure-audit.md`); extends beyond it and issues one correction.

**Verdict: DONE rows HOLD in full.** Every W8 move landed exactly as the manifest claims; C1/C2 are honestly recorded as HELD and remain in `index.css`; the CLAUDE.md-file-tree follow-up was actioned (folded to README with the new tree). The edict itself, re-checked DEEPER, carries **seven residue rows W8 did not touch** — six of them because they sit *outside W8's declared scope* (App.vue scene, e2e/, the two-home shared-composable question), one because W8's own §2 reasoning under-applied the family clause (the icon pair).

---

## Part 1 — W8 DONE rows: verified HOLD

Live tree at HEAD (`find web/frontend/src -type f`) checked against every manifest row.

| Rows | Claim | HEAD evidence | Verdict |
|---|---|---|---|
| S1–S5, F1–F5 | per-game `solver/` = `{solver.worker, protocol, solverError, apiError, useSolver}` | both dirs present, 5 files each (`games/sudoku/solver/*`, `games/futoshiki/solver/*`) | HOLD |
| S6, F6 | `conflicts.ts` → Board dir | `games/sudoku/SudokuBoard/conflicts.ts`, `games/futoshiki/FutoshikiBoard/conflicts.ts` present | HOLD |
| S7, F7 | `lib/` dissolved | `grep -rn "/lib/" src/` → **zero hits**; no dangling `'../protocol'`/`'../solver.worker'` game-root imports | HOLD |
| C1 | `.sudoku-cell:focus-within` — **HELD** (not moved) | still at `src/assets/index.css:352` | HOLD (as recorded) |
| C2 | `.sheet-laminate` (+ PRT/PRC arms) — **HELD** | still at `index.css:271` (+ tokens `:166,215`, arms `:283,291`) | HOLD (as recorded) |
| §2 pencil/chrome | "already generalizes, **no moves**" | tree matches: 3 satellite folders + 8 flat members exactly as listed | HOLD (but see Δ5) |
| Manifest highest-churn #4 | "update `web/frontend/CLAUDE.md` file-tree, still documents `lib/`" | CLAUDE.md **gone** (folded to README, W-docs wave); `README.md:59` documents `solver/…` correctly, **no stale `lib/`** | ACTIONED |

**No uncommitted W8 drift**: `git status --short` = clean; no tracked build artifacts (`git ls-files` shows no `dist/`, `tsconfig.tsbuildinfo`, `test-results/`, or `e2e/screenshots/`).

The C1/C2 HELD disposition (manifest §3, Lane F 2026-07-10 note) is **intellectually honest** and still correct: both rules live in `@layer utilities`; an SFC `<style>` extraction changes cascade layer, and the e2e suite asserts none of the `:focus-within`/laminate visual properties, so the move can't be gate-proven behavior-identical. Zero `index.css` bytes changed. This is a legitimate hold, not a skipped row — but it means **two component-owned rules still live in the global stylesheet**, an open edict item (see Δ7).

---

## Part 2 — DEEPER edict re-check: delta rows (beyond R5)

The owner re-affirmed the edict with "wildly re-structured" energy. Re-reading `T2-W8-colocation.md:3-11` ("binding on ALL file directories, both stacks"), the sharpest finding is **scope**: W8 declared its frontend surface as `games/*/solver` + `pencil/chrome` + `index.css` (wave doc §Scope). Three whole directories the edict binds were **never in W8's scope** and carry the deepest residue.

### Δ1 — CORRECTION to R5: `e2e/screenshots/` PNGs are NOT committed
R5 §1 states "`screenshots/` (3 committed PNGs)." **False.** `git ls-files web/frontend/e2e/` returns only the 6 spec/mjs files — **no `screenshots/` entry**. The three PNGs (`round11-9x9.png`, `round11-dark.png`, `round11-light.png`) are untracked runtime output written by `round9.spec.ts:172,196,323`. R5's structural conclusions stand; the "committed" characterization does not.

### Δ2 — e2e naming residue: `round9.spec.ts` emits `round11-*.png` (edict "no-legacy", un-audited by W8)
The spec file is named `round9` but writes artifacts named `round11-*` (`round9.spec.ts:172,196,323`). **Two different dev-round numbers (9 vs 11) leaked into permanent names** — a round-number register the owner's "no legacy code" mandate targets directly. `e2e/` was outside W8's src-focused scope, so this was never swept. Fix: rename to feature register (e.g. `visual-regression.spec.ts` + `*-9x9/light/dark.png`).

### Δ3 — `e2e/` is flat with a mixed register + extension outlier
6 entries: 4 `.spec.ts` (feature-named except `round9`) + `pwa-offline-smoke.mjs` (a `.mjs` on a different runner). Edict binds "ALL directories"; `e2e/` never got the treatment. A flat 6-entry test dir is defensible, but the `.mjs` outlier + round-number name are the drift. Low churn, but it's the one FE directory W8 wholly skipped.

### Δ4 — shared-composable home is split across TWO dirs with no stated rule (extends R5 D5 with the latent rule)
Three composables are cross-cutting true-globals consumed by **both** games **and** pencil, yet live in two different homes:
- `src/composables/useTheme.ts` — **1-file top-level dir**; 5 consumers (`ControlPanel.vue` ×2, `HandwrittenLogo.vue`, `OptionSelector.vue`, `DarkModeToggle.vue`).
- `src/pencil/composables/celebration.ts` — 3 consumers (both Boards + `HandwrittenGlyph`/`glyphAnimations`).
- `src/pencil/composables/useButtonAnimation.ts` — 2 consumers (both `ControlPanel.vue`).

**Extension beyond R5**: a *latent* rule does exist — pencil-aesthetic composables (celebration, button-press animation) live under `pencil/`; app-global non-aesthetic state (theme) lives top-level. But it's **unstated**, and it leaves a **1-file `src/composables/`** — precisely the thin-shared-dir shape the edict's own "shared dir only for justified globals; long dirs broken" clause discourages in the opposite direction (a dir that's too thin to justify its own level). W8 §2 justified `pencil/composables` members individually but never adjudicated *why two homes exist*. Fix: either document the aesthetic-vs-app-global rule in the frontend README, or collapse to one `src/composables/` and let pencil import up.

### Δ5 — the icon pair: W8 §2 under-applied its own family clause (extends R5 L3)
`DiceIcon.vue` + `SolveIcon.vue` have **identical cross-game consumer sets** — both imported by both `ControlPanel.vue`s and nothing else. W8 manifest §2 dispositioned them "stay flat — single-file, no owned satellite." That test is **ownership**, but the edict's `colocate-family` clause is about **cohesion**: two sibling icons with the same two consumers are a family. This is one row where W8's reasoning applied the rule too literally against its own spirit → `pencil/chrome/icons/{DiceIcon,SolveIcon}.vue`. (SvgFilters generates its ids from `pencilConfig` presets via `:id="p.id"` at `SvgFilters.vue:78,95,120` while `dev/FilterTuner.vue` references 5 literal `wobble-*`/`grain-static` ids — the R5 L3 filter-subsystem split is real but nuanced; defer to R5.)

### Δ6 — App.vue Sudoku/Futoshiki scene asymmetry: the largest standing edict violation, wholly outside W8 scope (confirms R5 D1, ties to clause)
Futoshiki's scene is a self-contained `FutoshikiGame.vue` (197 LOC). Sudoku's identical scene is **smeared across `App.vue` (371 LOC)**: `useSudoku()` at `App.vue:65`, inline `<SudokuBoard>` at `:175`, the peek/keyboard machine at `:77-132`. **No `SudokuGame.vue` exists** (`ls` confirms). App.vue's own comments admit the split — `:86` "Futoshiki owns its own peek (FutoshikiGame.vue)", `:114` "Futoshiki's K/Esc is handled in FutoshikiGame.vue". The edict's "each game's scene colocated in its own dir" is **satisfied for Futoshiki, violated for Sudoku**. W8's frontend scope (solver/ + chrome + index.css) never included the App.vue scene, so this deepest asymmetry was never on W8's table. This is the #1 pass-2 authoring target.

### Δ7 — two component-owned CSS rules remain global (consequence of the honest C1/C2 hold)
Because C1/C2 are HELD, `.sudoku-cell:focus-within` (`index.css:352`, sudoku-only) and `.sheet-laminate` (`index.css:271`, `AnswerKeyLaminate`-only) still live in the global stylesheet against the edict's "index.css keeps only tokens + true globals." The hold is correct *given only automated gates*; a **visual-diff pass** (SSIM on `:focus-within` + laminate opacity/PRT/PRC arms) is the disclosed lever that would lift it. Recorded for owner adjudication, not a defect.

---

## Part 3 — non-deltas (skeptical confirmation)
- `games/*/composables/` = `{use{Sudoku,Futoshiki}, useUrlState}` — `useUrlState` has a **single consumer** (`useSudoku.ts:16` / `useFutoshiki.ts:16`), but sits in a coherent 2-member game-state dir; manifest §1 satellite-audit justified it. Defensible; lowest-priority colocation nit only.
- `games/sudoku/data/templates.ts` with no futoshiki twin — **not drift**: sudoku consumes a template bank, futoshiki generates. Legitimate asymmetry.
- `apiError.ts` vestigial name (R5 D3) — a **known-deferred** item, explicitly flagged "optional rename, not a move row" in W8 manifest §1. Standing deferral, not new W8 drift.
- BE §4/§5 (Rust src/, examples/, tests-py/, tests/ pointers) — manifest claims "no moves earned"; per-dir counts and pointer resolution recorded DONE by Lane B. Outside this lane's deep FE focus; rows internally consistent, not re-derived here.

## Priority for pass-2 authoring
1. **Δ6** — extract `SudokuGame.vue`, byte-mirror `FutoshikiGame.vue`, reduce App.vue to a pure shell. Largest structural + symmetry win.
2. **Δ4** — settle the one-vs-two shared-composable-home rule (document or consolidate).
3. **Δ7** — visual-diff pass to lift the C1/C2 hold (or ratify it permanently).
4. **Δ2/Δ3** — e2e naming + register sweep (the one FE dir W8 skipped entirely).
5. **Δ5** — `pencil/chrome/icons/` regroup.

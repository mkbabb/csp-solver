# T4-W11 · Lane R2 — THE CONTROL-SHELL (spec Row 2, MED)

Base HEAD `7d51f562` (beneath it R1's SolverErrorNote fold + RS's rust `PuzzleClass`,
both additive/in-tree). Frontend-only row: the two `ControlPanel.vue` byte-twins collapse
onto ONE game-agnostic `games/shared/GameControlPanel.vue` shell taking section SLOTS; each
game's `ControlPanel.vue` becomes a thin section-supplier. CEN's live figures govern.

## The stale-spec reconciliation (LOAD-BEARING — read first)

The spec's Row-2 text says "sudoku passes 2 sections, **futoshiki passes 1**" and names the
**single-section path** as the risk. That census was taken at `65425697`, **before T4-W6
GEN-2 grew futoshiki's difficulty axis.** At the merged base `7d51f562` **futoshiki carries
2 live sections** (boardSize + difficulty) AND the mobile tab-toggle — identical structure to
sudoku (CEN: the twins are now ≥92% identical, "W6/W7/W8/W9/WU/W10 grew both dirs").

Dropping futoshiki to 1 section would DELETE its difficulty selector → red the futoshiki e2e
+ goldens. The ABSOLUTE invariant (unedited suite, zero drift) FORBIDS that. So **both shipped
games pass n=2**; the shell's `n ≥ 2` tab-gating is real and exercised by both, and is the
generality game #3 (W13) will use at n=1. The "single-section drift risk" is **moot for the
shipped games** — there is no shipped single-section path to drift, and I proved (below) both
games render exactly 2 live tabs with byte-identical heading classes, **no dead tab**. This is
exactly CEN's mandate: "every integer here supersedes the spec's stale `65425697` figures."

## The extraction shape

- NEW `web/frontend/src/games/shared/GameControlPanel.vue` — the shell. Owns: `pencilMode`/
  `candidatesPinned` defineModels; props `sections`/`loading`/`isDirty`/`mobile`/`errorCheckMode`/
  `share`; emits deal/clear/solve/fill-forced/peek-start/peek-end/undo/redo/hint/update:errorCheckMode;
  ALL logic (boil, hold-to-peek, share-truth state, deal/clear dirty two-tap arm, button anims,
  isCoarse, newGameId, panelFilter); the FULL template (mobile + desktop, New-game staging + Deal
  + peek BoilDivider + PencilModeToggle + AssistSettings + action row + play tools + KeyboardLegend);
  and the ~310 verbatim `<style>` lines incl. the **once-only** `sharePop`/`eraserScrub` keyframes.
- Imports ONLY `@pencil/**`, `@/**`, `@games/shared/**` → the three-home tripwire holds (eslint
  green; the shell imports NOTHING from `@games/{sudoku,futoshiki}`).
- `ControlSection` contract (exported from the shell's companion `<script lang="ts">`):
  `{ key, heading, ariaLabel?, options, selected, onChange }`. **No config flag / no boolean toggle**
  (the god-interface guard). The one real divergence — the difficulty heading's crayon tone — is
  DERIVED FROM DATA: the shell reads `options.find(o => o.value === selected)?.colorClass`
  (`crayon-green/orange/rose`, present on `difficultyOptions`, absent on the size options). Present →
  heading = `transition-colors duration-250 <crayon>`; absent → `text-muted-foreground`. The
  closed-tab value label (UI-12) is likewise `find(selected)?.label`. Both are read, never toggled.
- Each `ControlPanel.vue` → a thin adapter: declares the SAME external interface (so the parent
  Game.vue mount is **byte-untouched**), holds only its game-specific `size`/`boardSize` + `difficulty`
  models + a `sections` computed, and forwards every shared model/prop/emit to the shell. `solveState`
  stays a declared-unused prop (parity — it was unused in both twins at base). The `size`↔`boardSize`
  model-name divergence + "Size"/"Board Size" heading + aria-label live only in the two `sections`
  arrays (~10 lines each).
- Emit forwarding is EXPLICIT (`@deal="emit('deal')"` …), NOT attribute-fallthrough: `w.emitted()`
  in the ControlPanel unit tests inspects the mounted (thin) instance, and a shell-only emit would
  not surface there — the twins' 12 unit tests (undo/redo/hint/fill-forced/deal/clear + disable)
  pass unedited because the thin panel re-emits.

### Byte-identity of the rendered surface (the "reproduce pixels exactly" gate)

DOM probe of the mobile tab headings on the built dist (`:4589`, 390×844 coarse):

```
[sudoku]    tab "Size"       aria="Size"      class="section-heading text-muted-foreground is-active"
            tab "Difficulty" aria=null        class="section-heading transition-colors duration-250 crayon-green"
[futoshiki] tab "Board Size" aria="Board size" class="section-heading text-muted-foreground is-active"
            tab "Difficulty" aria=null        class="section-heading transition-colors duration-250 crayon-green"
```

Both games: **2 live tabs, 0 dead tabs**, heading classes character-for-character the base twins'
(size heading has NO `transition-colors duration-250`; difficulty heading DOES + the EASY→green
crayon). The only intentional a11y touch: sudoku's Size heading now carries `aria-label="Size"` in
both mobile+desktop (base had it desktop-only) — the accessible name is "Size" either way, 0 pixel
/ 0 accessible-name change; the e2e prove it (63/63 green, incl. the size-switch + coarse-panel cases).

## Born-RED probes (base `7d51f562`, before the row)

| Probe | Command | RED result (before) |
|---|---|---|
| doubled keyframes | `for k in sharePop eraserScrub; do grep -rln "@keyframes $k" src; done` | **2 files each** (both `ControlPanel.vue` twins) |
| twin reservoir (CP) | `comm -12` CORR (cen-census filter) on the two `ControlPanel.vue` | **787** identical code lines (CEN banked 781; ±6 filter variance) |
| contract exists (FE) | `grep -rl defineGame` / `ls games/shared/GameControlPanel.vue` | ABSENT |

## GREEN after the row

| Probe | Result (after) |
|---|---|
| doubled keyframes | `sharePop` → **1 file**, `eraserScrub` → **1 file** (both → `games/shared/GameControlPanel.vue`) |
| twin reservoir (CP) | **66** identical lines (was 787) — the residue is the two thin panels' near-identical forwarding template + emit decls (trivial-structural; the ~721-line shared bulk is now single-copy) |

## Net LOC delta (this row) — `cloc … --csv` SUM code

| Dir | before (this session, R1-folded) | after | Δ |
|---|---:|---:|---:|
| games/sudoku | 4,207 | 3,506 | **−701** |
| games/futoshiki | 4,343 | 3,642 | **−701** |
| games/shared | 3,626 | 4,383 | **+757** |
| **games total** | **12,176** | **11,531** | **−645** |

ControlPanel files: base pair = **1,552** cloc (2 files) → after = **907** cloc (shell + 2 thin,
3 files) → **−645** real deletion. Exceeds the spec's −400/−450 estimate (the reservoir grew post-W6;
CEN governs). Combined with R1's −102, the running games-dir reduction from the CEN `12,278` baseline
is **12,278 → 11,531 = −747** (the ≥1,600 floor is cumulative across R1–R4).

## Battery (all GREEN, unedited)

| Gate | Command | Result |
|---|---|---|
| types | `npx vue-tsc -b --force` | exit **0** |
| unit | `npm run test:unit` (vitest) | **271 passed / 21 files**, exit 0 (incl. both ControlPanel test twins — 12 cases — unedited) |
| eslint | `npm run lint:eslint` | exit **0** (three-home tripwire holds; shell imports no concrete game) |
| knip | `npm run lint:knip` | exit **0** (shell consumed by both thin panels; `ControlSection` imported by both) |
| prettier | `npx prettier --check src/` | exit **0** ("All matched files use Prettier code style!") |
| build | `npm run build` | exit **0** (built in 372ms) |

## The invariant — vs the BUILT DIST (`vite preview --port 4589`, killed after)

Ran against the dist on `:4589` (owner's `:3000` left up + untouched). Default suite via a TEMP
webServer-free mirror config (`playwright.r2-verify.config.ts`, `{ ...base, webServer: undefined }`)
so Playwright never touches `:3000`; created for the run, **deleted after**. Golden/throttle ran
under their own configs.

| Suite | Config | Result |
|---|---|---|
| **default e2e** | temp mirror of `playwright.config.ts`, `PLAYWRIGHT_BASE_URL=:4589` | **63 passed** (12.2s), exit 0 — incl. `visual-regression` DOM contract (light+dark, control-panel filter), size-switch 4×4/9×9/16×16, `sudoku-interaction` solve-failure paths, `mobile-affordances` (Clear confirm beat, Deal dirty-gate, play tools, peek washi, icon sublabels), `mobile-platform` drawer/iPad regimes |
| **visual goldens (π)** | `playwright-golden.config.ts`, `:4589` | **4/4 passed** (3.9s), exit 0 — `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` byte-for-π (logo-light clean this run; CEN's ~13% base flake did not surface) |
| **throttled-void** | `playwright-throttle.config.ts` (self-isolated `:4188`, built `dist-throttle` from MY source) | **1 passed** (3.2s), exit 0 |

Full census **68 = 63 + 4 + 1**, all green, no spec/config edited (the 15 CEN-stamped spec+config
files untouched; the temp mirror + `dist-throttle/` removed after).

## Controls-card cap geometry (spec gate — unchanged)

`scene.css` is **byte-unmodified** (git clean) and the ControlPanel content DOM is structurally
identical, so the `.controls-card` cap is preserved by construction. Measured computed `max-height`
on the dist:

| Viewport | computed `.controls-card` max-height | formula `min(42rem,85vw,100dvh−10rem)−2rem` |
|---|---:|---:|
| 1280×800 | **608px** | 640−32 = **608px** ✓ |
| 1440×900 | **640px** | 672−32 = **640px** ✓ |

Matches to the pixel.

## Rust invariant

**R2 touched ZERO rust** — FE-only footprint (below). The 174-test baseline is preserved by
construction; per CEN §0, V measures the rust invariant against clean `7d51f562` (or the sealed
row SHA), never the RS-lane-dirty working tree. The `csp-solver/**` diffs in the tree are RS's
additive `PuzzleClass` work (178 = 174 + 4, RS-stamped), NOT R2's.

## Footprint (clean, additive, FE-only)

```
 M web/frontend/src/games/sudoku/ControlPanel/ControlPanel.vue        (→ thin section-supplier)
 M web/frontend/src/games/futoshiki/ControlPanel/ControlPanel.vue     (→ thin section-supplier)
?? web/frontend/src/games/shared/GameControlPanel.vue                 (the control-shell)
```

Parent `SudokuGame.vue`/`FutoshikiGame.vue` + both `ControlPanel.test.ts` files: **UNMODIFIED**
(git-clean) — the thin panels keep the exact external interface. Temp `playwright.r2-verify.config.ts`
deleted, `dist-throttle/` removed, `:4589` preview killed, `:3000`/`:3001` never touched. No commit
(team lead commits). Tree left additive.

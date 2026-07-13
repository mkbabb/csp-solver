# r1-dead-code — dead code / dual paths / legacy census

Subject HEAD: `65425697` (master). pencil-boil HEAD: `da51edb` (v0.8.1).
NO source edits made. All probes rerunnable from repo root unless noted.

## Census scope covered
- Frontend `web/frontend` (knip + manual grep), Rust `csp-solver`, `scripts/`, `.github/workflows/ci.yml`, `package.json`/`Cargo.toml`, pencil-boil `src/`.
- Vestigial dirs (web/api, nginx, docker): NONE present in tree; only historical retirement comments remain (below).

---

## P2 — knip "dead-code gate" is structurally blind to the dead code it names
family_hint: `gate-cannot-fail`

Two compounding defangs let dead exports/functions persist green:

1. **exports/types report at `warn`, not `error`** — `web/frontend/knip.json:24-27` sets
   `exports`, `nsExports`, `types`, `nsTypes`, `enumMembers` to `"warn"`. Only
   `files`/`dependencies` are `"error"`. `npx knip` therefore exits **0** despite the 9
   dead exports it prints. CI runs bare `npx knip` at `.github/workflows/ci.yml:420` as
   "the standing dead-file / dead-dependency gate" — it cannot fail on the export class.
   The ci.yml:413-417 comment discloses this ("dead exports/types report at warn … a
   source-lane follow-up") — a *known, banked, unretired* debt, not a hidden lie.

2. **the two pencil barrels are knip `entry` points** — `knip.json:3`
   `"entry": ["src/pencil/chrome/index.ts", "src/pencil/grid/index.ts"]`. Everything a
   barrel re-exports is marked "used" by definition, so knip is blind to dead re-export
   lines AND to symbols reachable only through the barrel. This is why the finding below
   (`generateGridPaths`, a never-called function) does not appear in knip output.

Probe:
```
cd web/frontend
npx knip; echo "exit=$?"                 # prints 9 dead items, exit=0
grep -nE '"(exports|types|nsExports|nsTypes)"' knip.json   # all "warn"
sed -n '413,420p' ../../.github/workflows/ci.yml           # gate runs bare `npx knip`
```
disposition_hint: **build** — promote `exports`/`types` to `error` (or add a
`knip --reporter … && exit-on-warn` step), and drop the two barrels from `entry` so
their re-exports are censused like any other module. Then retire the items below.

---

## P2 — `generateGridPaths` is fully dead code (defined, never called), masked by the barrel
family_hint: `gate-cannot-fail`

`web/frontend/src/pencil/grid/gridPaths.ts:41` `export function generateGridPaths(...)`.
The T3-W8 split (comment gridPaths.ts:115) extracted `generateCellRects` as the only
consumed half; `generateGridPaths` itself has **zero call sites** in src, e2e, or tests —
only its definition, two JSDoc/comment mentions, and the dead barrel re-export at
`grid/index.ts:13`. It ships in every build. Invisible to knip because grid/index.ts is an
`entry` (see above).

Probe:
```
cd web/frontend
grep -rnE 'generateGridPaths\s*\(' . --include='*.ts' --include='*.vue' --include='*.mjs' | grep -v node_modules
# → only gridPaths.ts:41 (the definition). No caller.
```
disposition_hint: **retire** the function (and its dead barrel line).

---

## P2 — pencil barrel re-exports: majority have zero consumers-via-barrel (dead alias lines)
family_hint: `barrel-surface-drift`

The barrels advertise a "public surface" ("18 exports" / "7 exports" in their docstrings)
whose stated purpose is that *games reach chrome/grid through the barrel so the depth-lint
keeps 3+-level reach out of the domain layer* (`chrome/index.ts:1-9`, `grid/index.ts:1-8`).
In fact games and internals import these symbols by **deep path**, bypassing the barrel:

- `@pencil/grid` (`grid/index.ts`) is imported **only** for `HandDrawnGrid`
  (SudokuBoard.vue:5, FutoshikiBoard.vue:17). The other re-exports —
  `usePathAnimation`(:10), `HandDrawnOutline`(:11), `generateGridPaths`(:13),
  `generateCellRects`(:14), `generateRectBoilFrames`(:15), `generateLineBoilFrames`(:16),
  `generateGridBoilFrames`(:17), `GridPaths`/`BoilFrames`(:19) — have **no barrel
  importer**; consumers deep-import `@pencil/grid/gridPaths` / `@pencil/grid/HandDrawnOutline.vue`
  (e.g. DigitPad.vue:24, BoilDivider.vue:4, HandDrawnOutline.vue:4, DrawerTab.vue:16).
- `@pencil/chrome` (`chrome/index.ts`) is imported only for
  {AttributionCard, DiceIcon, EraserIcon, HandwrittenLogo, KeyboardLegend, OptionSelector,
  ShareIcon, SolveIcon} (App.vue:8, DigitPad.vue:22, sudoku+futoshiki ControlPanel).
  The other 10 re-exports — `CrayonHeart, useHoverCard, BoilDivider, CelebrationStar,
  CompletionVignette, MarginNote, ghostUnderline, scribbleUnderline, ScribbleLoader,
  SvgFilters, useGameMenu, GameMenuOption` (chrome/index.ts:14-27) — have **no barrel
  importer**; every consumer deep-imports (e.g. `@pencil/chrome/BoilDivider.vue`
  ControlPanel.vue:11, `@pencil/chrome/SvgFilters.vue` App.vue:6,
  `@pencil/chrome/MarginNote.vue` SudokuBoard.vue:8).

So the barrels neither serve their stated depth-lint function (games reach deep anyway)
nor are the extra re-exports consumed. Either the depth-lint boundary is not enforced for
these paths, or the barrels are redundant surface.

Probe:
```
cd web/frontend
grep -rnE "from ['\"]@pencil/grid['\"]"  src   # → only HandDrawnGrid (2 sites)
grep -rnE "from ['\"]@pencil/chrome['\"]" src   # → 8 symbols; 10 barrel exports unused
# deep-path proof:
grep -rnE "@pencil/(chrome|grid)/[A-Za-z]" src | grep -v index.ts
```
disposition_hint: **fold** — trim each barrel to the symbols actually imported through it,
OR (if the depth boundary is the real intent) enforce the ESLint boundary so games import
via the barrel and delete the deep-path imports. Decide one path; today it's dual.

---

## P3 — three fully-dead type/interface declarations (knip-visible, warn-suppressed)
family_hint: `dead-export`

Declared, never referenced anywhere (not even internally):
- `DrawInPreset` interface — `src/pencil/config/pencilConfig.ts:341`. The presets object
  `DRAW_IN_PRESETS` (:354) uses `as const`, not this interface. Zero refs.
- `BoardSize` type — `src/games/futoshiki/types.ts:31`
  (`(typeof VALID_BOARD_SIZES)[number]`). Never used as an annotation; the `props.boardSize`
  / `prevBoardSize` / `onBoardSizeChange` hits are unrelated names. Only a comment mentions
  it (shared/types.ts:6).

Probe:
```
cd web/frontend
grep -rnE '\bDrawInPreset\b' src   # → only the declaration
grep -rnE '\bBoardSize\b'    src   # → declaration + one comment; no type use
```
disposition_hint: **retire** both.

---

## P3 — export-only-dead: symbols used internally, export/keyword redundant
family_hint: `dead-export`

Used within their own module but the `export` has no external consumer (knip-flagged):
- `DEFAULT_BOIL_CONFIG` re-export — `pencilConfig.ts:183` (`const` used at :177,:180; the
  `export { DEFAULT_BOIL_CONFIG }` line is dead).
- `pickVariantIndex` — `glyphRegistry.ts:35` (called internally at :50; a
  FutoshikiCaret.vue:12 *comment* references it, not an import). Export keyword redundant.
- `InitSource` type — `sudoku/composables/useUrlState.ts:14` and
  `futoshiki/composables/useUrlState.ts:28` (dual copies; each used only as local
  `source: InitSource` in its own file).
- `WobbleConfig` / `MultiPassConfig` / `TextureConfig` — `pencilConfig.ts:69/83/90`
  (each consumed only as an optional field of `FilterPreset` at :100-102 in the same file).

Probe: `cd web/frontend && npx knip` lists all 7 verbatim.
disposition_hint: **fold** — drop the `export` (make module-local), keeping the internal use.

---

## P3 — pencil-boil public surface exceeds its sole in-repo consumer
family_hint: `library-surface-unverified`

`pencil-boil/src/index.ts` exports 40 symbols; the frontend (the only in-repo consumer)
imports 22. Never imported by the app: `catmullRomToBezier`, `perturbPointsClosed`,
`boilLineFrames`, `boilRectFrames`, `ellipsePoints`, `easeInCubic`, `easeInOutCubic`,
`useLineBoil`, `useBoilFrame`, `useFilterParamBoil`, `createStrokeDrawIn`, `isBoilHeld`,
`useBoilFrames`, plus `Easing`/`BoilHandle` types. As a published npm package (v0.8.1) these
are legitimately public API — cannot be confirmed dead without external-consumer data. pencil-boil
has NO knip and no lint script (`package.json` scripts = check/proof/test only), so its surface
is uncensused. Some are exercised by `proofs/` (e.g. cache/frames proofs).

Probe:
```
cd pencil-boil && grep -nE 'export' src/index.ts
# compare against: cd ../csc411/CSC411_HW2_ProgrammingQuestion/web/frontend &&
#   grep -rhoE "from ['\"]@mkbabb/pencil-boil['\"]" src
```
disposition_hint: **build** — add knip (or a check-exports proof) to pencil-boil to census
its own surface; treat unused public API as an intentional-surface decision, not silent debt.

---

## Cleared (no finding) — checked, clean
- **web/api / FastAPI / nginx / docker / uvicorn**: no such dir or config file in tree.
  Only historical retirement comments remain (`csp-solver/src/py/sudoku.rs:185-190`,
  `csp-solver/tests/difficulty_parity.rs:47`, `tests-py/*`), correctly noting T2-W2 abrogation.
  (NOTE for doc lane: MEMORY.md still says "FastAPI at web/api" — stale, not in my source lens.)
- **TODO/FIXME/HACK/XXX/@deprecated**: zero in `csp-solver/src`, `web/frontend/src`, `scripts`,
  and `pencil-boil/src`. Probe: `grep -rInE 'TODO|FIXME|HACK|XXX|@deprecated|DEPRECATED' …`.
- **Rust dead_code**: no `#[allow(dead_code)]` / `#[allow(unused)]` / `#[deprecated]` in
  `csp-solver/src`.
- **FilterTuner.vue / rafInstrumentation.ts** (`src/pencil/dev/`): NOT dead — properly
  `import.meta.env.DEV`-gated async component (App.vue:31-32,159) + env-gated instrument
  (main.ts:5), DCE'd from prod. Legitimate live dev tooling.
- **Masking catch-blocks**: the swallowing `catch {}`/`catch { /* ignore */ }` sites
  (CelebrationHeart.vue:98, HandwrittenGlyph.vue:92-236, FilterTuner.vue:143) all guard
  animation `.stop()` teardown or dev JSON parse — benign, not failure-hiding. The
  localStorage silent-fail sites (useUrlState.ts:243/247) are documented intentional.
- **package.json scripts**: `scripts/dev.sh` exists + referenced (README.md:31,76). No
  `deploy.sh` in tree (docs still reference it — doc lane). No stale frontend scripts.

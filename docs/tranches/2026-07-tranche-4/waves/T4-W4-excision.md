# T4-W4 — The excision

**The clean break: dead code out, dual paths collapsed into one grammar, the two prettier and knip DISEASE rows decided-build, and the low-risk solver-seam distillation banked.** Owner edict (M2) — no legacy code: no aliases, no migration shims, no dual paths, no masking fallbacks. This wave retires the fully-dead surface knip is structurally blind to, dissolves the barrel dual-path into one eslint-enforced deep-import grammar, dedups the ~600 LOC byte-twin solver seam, hardens the worker against its own singleton-poisoning, and lands the prettier fix that rode two closes. It sequences after the gate work (W2) so knip actually fails on the dead surface, and its eslint boundary is the one W2 gates.

**Dependencies**: ← W2 (knip `exports`/`types` at error + barrels off `entry`; eslint boundary in CI — both required for these retirements to be enforced, not silently green). **Effort**: M.

---

## Scope

### Fully-dead surface — retire (FAM-5 / FAM-7)

Masked by knip's warn-level + barrel-blindness (W2 fixes the gate; this wave clears the items):

- **`generateGridPaths`** (`web/frontend/src/pencil/grid/gridPaths.ts:41`) — fully dead: the T3-W8 split extracted `generateCellRects` as the only consumed half; `generateGridPaths` has **zero call sites** (`grep -rnE 'generateGridPaths\s*\(' .` → only the definition), ships in every build, invisible to knip because `grid/index.ts` is an `entry`. Retire the function + its dead barrel line.
- **Dead types**: `DrawInPreset` (`pencilConfig.ts:341`, `DRAW_IN_PRESETS` uses `as const` not this interface), `BoardSize` (`futoshiki/types.ts:31`, never used as an annotation). Retire both.
- **`TextureConfig` scaffold** (`pencilConfig.ts:90`) — consumed only as an optional field of `FilterPreset`; the texture path never materialized. Retire the scaffold.
- **Export-only-dead** (fold — drop the `export`, keep the internal use): `DEFAULT_BOIL_CONFIG` re-export (`pencilConfig.ts:183`), `pickVariantIndex` (`glyphRegistry.ts:35`), `InitSource` ×2 (`{sudoku,futoshiki}/composables/useUrlState.ts`), `WobbleConfig`/`MultiPassConfig` (`pencilConfig.ts:69,83`).
- **Orphan filter defs — P4 rule re-closed** (FAM-5): the W13 P4 "no orphan base defs" rule is BROKEN — `grain-outline` + `wobble-logo` base defs are orphaned (the hoisted pose defs supersede them). Remove the orphans; re-close P4 with a check. (Hardcoded pose count vs `wobblePoseFrequencies` — reconcile to the single source.)

### Barrels die into ONE deep-import grammar — eslint-enforced (FAM-5 / dead-code P2)

The two pencil barrels advertise an "18 exports / 7 exports public surface" whose stated purpose is that games reach chrome/grid *through the barrel* so the depth-lint keeps 3+-level reach out of the domain layer — but **games deep-import anyway**, bypassing the barrel:

- `@pencil/grid` (`grid/index.ts`) is imported through the barrel **only** for `HandDrawnGrid` (2 sites); its other re-exports (`usePathAnimation`, `HandDrawnOutline`, `generateGridPaths`, `generateCellRects`, `generateRectBoilFrames`, `generateLineBoilFrames`, `generateGridBoilFrames`, `GridPaths`/`BoilFrames`) have **no barrel importer** — consumers deep-import `@pencil/grid/gridPaths` etc.
- `@pencil/chrome` (`chrome/index.ts`) is imported through the barrel for 8 symbols; its other 10 re-exports (`CrayonHeart`, `useHoverCard`, `BoilDivider`, `CelebrationStar`, `CompletionVignette`, `MarginNote`, `ghostUnderline`, `scribbleUnderline`, `ScribbleLoader`, `SvgFilters`, `useGameMenu`, `GameMenuOption`) have no barrel importer — every consumer deep-imports.

The barrels neither serve their depth-lint function nor are their extra re-exports consumed — a live dual path. **DECIDED — collapse to ONE deep-import grammar**: delete the barrels, every consumer deep-imports, the eslint colocation boundary (now gated in CI per W2) enforces the 3-level depth + pencil↮games / sudoku↮futoshiki rules directly on the deep imports. One path, not two.

### Solver-seam dedup — the low-risk ~600 LOC tier (FAM-5, x6 distillation)

The solver seam carries byte-identical twins across the game boundary on a misstated "each game owns its own" rule:

- **`classifyError.ts`** — code-body byte-identical across `src/games/{sudoku,futoshiki}/solver/classifyError.ts` (`diff` on comment-stripped bodies → identical; comments differ). The live 4-code Worker taxonomy (`INVALID_INPUT | BUDGET_EXCEEDED | UNSAT | WORKER_FAILURE`) with the server rows already pruned as dead (K1b, `:23-27`).
- **Solver transport byte-twins** — the worker request/response transport duplicated byte-identical across the boundary (r2 arch/cross-repo).

**Dedup into `games/shared/`** — one `classifyError`, one transport shape, game-specific only where the games genuinely diverge (board shape, budget). This is x6's explicitly low-risk ~600 LOC tier (the HIGH-tier shell distillation is W11 under W2's goldens); it rides here as pure dedup with no behavior change.

### Worker respawn + request-shape validation (FAM-13 / SEC-4b)

- **Singleton poisons the session** (FAM-13, r3-corrected): the solver worker is never re-instantiated after a crash — the mechanism is a **sticky memoized-init rejection** (`useSolver.ts` `ensureWorker` memoizes the init promise; a rejected init is cached, so every subsequent solve rejects against the poisoned singleton). **Fix (clean break, no masking fallback):** on worker `error` (or a rejected init), null the memoized singleton so the next request re-instantiates a fresh worker; bound the respawn (don't loop on a persistently-failing worker — surface `WORKER_FAILURE` after N).
- **Request-shape validation** (SEC-4b, defense-in-depth): the `message` handler passes fields straight to `solveSudoku(req.board, …)` relying on wasm-bindgen to throw. Add an explicit `switch (req.kind)` typed guard so the contract is stated, not incidental. (`messageerror` is unreachable in practice — plain payloads only — so it's a re-book of the same class, not a separate row.)

### Lenient parseInt trued (SEC-4)

`futoshiki/composables/useUrlState.ts:144-145` — `parseInt(ab[0], 10)`/`parseInt(ab[1], 10)` with **no** `/^\d+$/` canonical guard, asymmetric with the deliberately-strict size field one block up (`:115`). `?board=…5.<25 zeros>.0-1abc` parses pair `[0,1]` (trailing garbage silently dropped). No exploit (the pair still faces adjacency + range + dedup + count gates) but a doc-truth/consistency wart against the strict size guard. True it to the strict form — the codec's canonical-input discipline should be uniform.

### mod.rs flip — DECIDED-build (FAM-12 / D6)

Booked as a "post-tranche one-commit follow-up" with `clippy.self_named_module_files`, veto window closed unexercised; current truth: 10 `mod.rs` present, no `clippy.toml`, nothing enforces it. Rode T3-WGATE + W13 undone. **DECIDED-build here**: flip the 10 `mod.rs` → self-named files + add the `self_named_module_files` clippy lint to lock it. (Low stakes; it rides this excision wave so it stops re-booking.)

### FilterTuner prod-shake — proven, not excised (FAM-5)

`FilterTuner.vue` / `rafInstrumentation.ts` (`src/pencil/dev/`) are **NOT dead** — properly `import.meta.env.DEV`-gated (App.vue:31-32,159; main.ts:5), DCE'd from prod. r1-perf already confirmed absent from the prod bundle (grep = 0 in `index-*.js`/`animation-vendor-*.js`). This wave **proves it, doesn't excise it**: a standing check that `FilterTuner`/`rafInstrumentation`/`schedulerDebugInfo` are grep-0 in the built prod bundle (the dev tooling stays; the proof rides into the W2 test estate as a prod-shake assert).

### Residue sweep (FAM-5 / FAM-7)

- **`.gitignore:60`** `csp-solver/wasm-morph/pkg/` — dead (morph excised to mkbabb/morph at W12); the dir is absent. Remove the ignore line.
- **`.mypy_cache/`** — absent from `.gitignore` and stale (Python 3.10 cache while the project pins 3.13); untracked (no leak) but uncovered clutter. Add `.mypy_cache/` to `.gitignore`.
- **`test_wheel_contracts.py:246-248`** (plan-diff F1) — the docstring still references "the two not exercised end-to-end below; see their skip reasons" but W4-T3 (`044f2526`) deleted those two skip tests; the reference dangles. Retrue the docstring.
- **`.env.example`** (config-census P3) — carries only `FRONTEND_PORT=9121` (consumed nowhere but `scripts/dev.sh`), omits the `PYTHONPATH` the app actually reads, and hands a port the real `.env`'s own guidance says not to set. Retrue to the real contract.
- **CI stale "RED until W1" annotations** (config-census P3) — `ci.yml:60,140,183` describe lanes as broken pending a closed campaign's fixes; the annotations are doc-meta-leak in a live config (a reader can't tell which lanes are expected to fail). Strike them (fold to W14 if a broader CI-annotation sweep is cleaner, but the meta-leak is booked here).

### Prettier DISEASE — DECIDED-build (FAM-7 / D2, 2 closes)

`web/frontend/package.json:11` `"lint": "prettier --write src/"` with **no prettier config anywhere** — bare `npm run lint` resolves prettier's config upward to the machine's global `~/.prettierrc` (`{printWidth:88, tabWidth:4}`) and **rewrites the entire 2-space `src/` tree to 4-space**, a destructive home-dir-dependent reformat. The declared `prettier-plugin-tailwindcss` (`package.json:37`) never loads (no config `plugins` entry) and is masked from knip by `ignoreDependencies` (`knip.json:6`). Warned at T2 close and again at T3 close, never fixed.

- **DECIDED-build**: commit `web/frontend/.prettierrc.json` pinned to the tree's **actual 2-space** style (`printWidth: 88`, `tabWidth: 2`, `useTabs: false` — matching `eslint.config.js`/`vite.config.ts`, NOT the global shadow's 4-space, which would reformat the whole tree) with `plugins: ["prettier-plugin-tailwindcss"]` so the format is repo-pinned and the tailwind class-sorter actually runs; re-point the `lint` script to `prettier --check` (non-destructive) + add a CI check; drop `prettier-plugin-tailwindcss` from `knip.json:6` `ignoreDependencies` (it's now a live load site, no longer dead). Kills the global shadow, the silent-off plugin, and the knip mask in one commit. (Alternative per D2: drop the bare `lint` script entirely and make `lint:eslint` the sole gate — either kills the shadow.)

### theme-key namespacing note (FAM-7 / r4)

The theme localStorage key is owned by @vueuse/core's default `storageKey` (`vueuse-color-scheme`), un-namespaced vs the app's own `csp-*` / `sudoku-*` convention (keys split three ways). A dep major-bump that changed the default would silently reset theme preference once. **Low P3** — note the disposition here (namespace it via `useDark({ storageKey: 'csp-color-scheme' })`), but the actual rename **rides W10** (the `useTheme` composable idiom) since it touches the Vue-idiom surface, not the excision surface. Booked here so it isn't dropped.

## Gates

| Gate | Value |
|---|---|
| Headline | knip exits non-zero on any surviving dead surface (the 9 items retired), the barrels are gone with one eslint-enforced deep-import grammar, `classifyError` + transport are single-sourced in `games/shared/`, the worker respawns after a crash, prettier is repo-pinned with the plugin live, full e2e green (pure dedup + hardening, no behavior change) |

Component checks (born RED at HEAD unless marked; every RED cites today's failing value):

| Gate | Value (current failing probe → target) |
|---|---|
| dead-surface | `grep -rnE 'generateGridPaths\s*\(' web/frontend/src` = **definition-only today** (ships in every build) → gone; `DrawInPreset`/`BoardSize`/`TextureConfig` + the 5 export-only-dead retired; knip exits non-zero on any regrowth (W2's error-level gate) |
| barrels | `grep -rnE "from '@pencil/(grid\|chrome)'" src` = **2 sites (grid) + 8 symbols (chrome) via barrel, 10+ re-exports unconsumed, everything else deep-imports today** (dual path) → barrels deleted, one deep-import grammar, eslint boundary gates it |
| orphan-defs | the W13 P4 "no orphan base defs" rule is BROKEN today (`grain-outline` + `wobble-logo` base defs orphaned) → removed, P4 re-closed with a check |
| solver-seam | `diff` comment-stripped `{sudoku,futoshiki}/solver/classifyError.ts` = **byte-identical today** (dual path); transport byte-twins → single-sourced in `games/shared/` (~600 LOC tier) |
| worker-respawn | repro: crash the worker (or force a rejected init) → **today the sticky memoized-init rejection poisons the singleton; every subsequent solve rejects** → the next request re-instantiates a fresh worker; bounded respawn; `switch(req.kind)` typed guard present |
| parseInt | `?board=…5.<zeros>.0-1abc` = **accepted today** (`parseInt` drops trailing garbage, `useUrlState.ts:144-145`, asymmetric with strict `:115`) → rejected by a uniform `/^\d+$/` guard |
| mod-rs | `find csp-solver/src -name mod.rs \| wc -l` = **10 today**, `find . -name clippy.toml` = **empty today** → mod.rs flipped to self-named files + `self_named_module_files` clippy lint locks it |
| filtertuner | `FilterTuner`/`rafInstrumentation`/`schedulerDebugInfo` grep = **0 in the prod bundle today** (correctly DEV-gated) → a standing prod-shake assert keeps it so (proven, not excised) |
| prettier | `find . -name '.prettierrc*'` = **empty today**; `"lint": "prettier --write src/"` reformats the tree to 4-space via `~/.prettierrc` → `.prettierrc.json` committed (88/tabWidth 4/tailwind plugin), `lint` = `--check`, CI-gated, plugin off `knip.json` ignore |
| residue | `.gitignore:60` wasm-morph line removed; `.mypy_cache/` ignored; `test_wheel_contracts.py:246-248` docstring retrued; `.env.example` = real contract; `ci.yml` "RED until W1" annotations struck |
| parity | full e2e green; the dedup + worker + parseInt changes are behavior-preserving (the codec fail-closed contract still holds 18/18; the worker still returns `WORKER_FAILURE` on bad input) |

## π / DELTA

No rendered-pixel surface — the excision is dead-code removal, dual-path collapse, dedup, and config. π/DELTA N/A; the invariant is that the app renders and behaves identically (full e2e green, the codec-harden 18/18 unchanged, the visual goldens W2 minted unchanged). The one visual-adjacent removal — the orphan `grain-outline`/`wobble-logo` base defs — is proven inert by a golden of the affected surfaces being byte-unchanged before/after (the defs are orphaned; removing them changes nothing rendered).

## Seeds

- `r1-dead-code.md` — `generateGridPaths` dead + barrel-masked, the barrel dual-path (deep-import proof), the dead types + export-only-dead, the FilterTuner NOT-dead cert, the residue (gitignore/mypy/test_wheel comment).
- `r1-config-census.md` — the prettier DISEASE (P1), eslint ungated (→ W2), dead `prettier-plugin-tailwindcss` knip mask, the morph gitignore residue, `.env.example` drift, the "RED until W1" CI annotations.
- `r1-chronic-ledger.md` D2 (prettier, 2 closes) + D6 (mod.rs) — the DECIDED-build dispositions.
- `r2-security.md` SEC-4 (futoshiki parseInt leniency) + SEC-4b (worker request unvalidated); `r5-quiet-pass-3.md` §5 (`messageerror` re-book).
- `r3-quiet-pass.md` C-error-taxonomy (classifyError byte-identical) + `families.md` FAM-5 (the solver-seam dual path, x6's low-risk tier).
- `r1-plan-diff.md` F1 (test_wheel_contracts dangling docstring); `r4-quiet-pass-2.md` §2 (theme-key namespacing → W10).
- `x6-distillation.md` — the ~600 LOC solver-seam tier (low-risk), distinct from the W11 HIGH shell tier.

## Residual risks

- **The barrel collapse depends on W2's eslint gate being live** — deleting the barrels removes the (nominal) depth boundary; the enforcement must move to the gated eslint boundary in the same wave, or a deep-import crossing goes unchecked. Sequence: W2 lands eslint-in-CI, W4 deletes the barrels and the boundary catches the deep imports directly. If the eslint gate surfaces latent crossings the barrels masked, they're fixed here (the barrels were hiding them, not preventing them).
- **The worker respawn must be bounded** — nulling the singleton on every failure risks a respawn loop against a persistently-broken worker (e.g. a wasm that can't instantiate). Cap the respawns and surface `WORKER_FAILURE` after N, so the fix hardens against a transient crash without spinning on a permanent one.
- **The solver-seam dedup is pure dedup, but the games do diverge** — `classifyError` and transport are byte-identical *today*; the single-source must keep the game-specific seams (board shape, node budget) parameterized, not collapsed, or a future game-specific error row would force the dual path back. Dedup the twin, keep the divergence points explicit.
- **The prettier fix reformats nothing if pinned correctly, but a first `--check` run will flag the tree** — the repo is authored 2-space; the committed `.prettierrc.json` at `printWidth 88` must match the existing style or the first `--check` reds the whole tree. Pin the config to the tree's actual style (verify against `eslint.config.js`/`vite.config.ts` 2-space), not to the global shadow's 4-space — the fix is to make the config match reality, then gate it.

---
## Execution record (2026-07-13)

Workflow `wf_4d1c622d-623`, 4 lanes (X1 dead-barrels-defs · X2 seam-worker-parseint · X3 modrs-prettier-residue · verify), all green.

| Gate | Close |
|---|---|
| dead-surface | `generateGridPaths` + `GridPaths` + `TextureConfig` (both halves, incl. `FilterPreset.texture` + 4 SvgFilters guards) gone; the W2-excised 9 confirmed done; knip error-level exit 0 |
| barrels | both `index.ts` deleted, 6 consumers rewired to deep imports (the single-quote grep undercounted — double-quote/multiline importers found); the settled one-grammar: depth-3 (a foldered component's public file) is the deepest legit reach, depth-4+ blocked — rule re-cut, no exception list; knip `entry` key dropped entirely (vite plugin auto-detects main.ts) |
| orphan-defs | `grain-outline` + `wobble-logo` base defs gated off via `baseDef:false` (pose defs live); P4 re-closed as a STANDING TEST (emitted-base-defs ≡ consumed set, 4/4); DarkModeToggle's 7 hardcoded pose-count 4s folded to one derived `CELESTIAL_POSE_COUNT` |
| solver-seam | `games/shared/solver/` single-sources solverError/classifyError/describeError + protocol envelope frames + `createSolverTransport`; 6 per-game twins DELETED (no shims); game divergence (n vs boardSize+inequalities, board marshalling) stays explicit; 18/18 targeted e2e through the deduped transport |
| worker-respawn | crash → null+terminate → next call re-instantiates; N=3 consecutive cap → WORKER_FAILURE (success resets the budget); `switch(req.kind)` typed guards both workers; 6 new transport units |
| parseInt | strict `/^\d+$/` both inequality endpoints (uniform with the size guard); trailing-garbage cases red-tested |
| mod-rs | 10 `mod.rs` → self-named files (git renames); **the spec's lint name is INVERTED on clippy 1.97** — `self_named_module_files` *requires* mod.rs; the true lock is `mod_module_files = "deny"` (probe-proven: a planted mod.rs errors), documented in Cargo.toml — D6 closed with the corrected id |
| filtertuner | proven, not excised: `check-prod-shake.mjs` (negative-control-proven) + CI step riding the throttle gate's build |
| prettier | **the disease is cured**: `.prettierrc.json` pinned to the measured-dominant 2-space (60/91 files; the 4-space minority is the global-shadow's own footprint), `lint` = `--check` (the destructive `--write` shadow dies), CI-gated, tailwind plugin live + off knip ignore. RECONCILIATION: the spec's "reformats nothing if pinned correctly" premise was FALSE — the tree was never prettier-formatted; a one-time 95-file format-only normalization lands as its own commit at this seal (quotes/semis kept at the tree's own conventions — prettier defaults) |
| residue | 5/5: wasm-morph ignore out, `.mypy_cache/` in, test_wheel docstring retrued, `.env.example` = the real contract, the 3 "RED until W1" ci.yml annotations struck; theme-key note banked to README §4b (rides W10) |
| parity (π) | goldens 4/4 WITHOUT re-baseline (the orphan-def removal rendered nothing); full e2e 47/47 at seal; 77 units; cargo test/fmt/clippy green |

Known flake (pre-existing, not W4): `toggle-crest-dark` straddles its 1.7% soul floor on this darwin box (feTurbulence raster noise; HEAD-revert proof) — books to the golden-fidelity owner; re-mint or floor loosening is a reviewed decision, not taken here.

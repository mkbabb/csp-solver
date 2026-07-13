# T4-W4 — gate evidence (verify lane)

**Wave**: the excision (dead surface out, dual paths collapsed, solver seam deduped, worker hardened, prettier/mod.rs decided-build, residue swept). **Base**: `7393e7df` (T4-W3). **Stamp**: MacBook Pro, macOS 26.4.1 (25E253), 2026-07-13; node v26.0.0 / npm 11.12.1; cargo 1.97.0 / clippy 0.1.97. **Lanes verified**: X1 (dead surface + barrels + defs + knip.json) · X2 (solver-seam dedup + worker respawn + parseInt) · X3 (mod.rs + prettier + prod-shake + residue). Verify re-ran every probe from the wave's Gates table at merged working-tree HEAD.

**Headline**: 10 of 11 component gates close born-RED → GREEN. **One gate does NOT close: `prettier`** — the pinned `.prettierrc.json` and the committed `src/` tree disagree, `npm run lint` (the new `--check`) exits 1 on 95 files. Root-caused below; it needs an X3/team-lead canonical-style decision, not a mechanical patch, so verify reports it RED rather than absorbing a 95-file reformat.

## Full local verification — exit codes verbatim

| Command | Exit | Note |
|---|---|---|
| `cargo test --workspace` | **0** | csp-solver unit + generation (8) + parity/dualization suites + 4 doctests, all pass |
| `cargo fmt --check` | **0** | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | **0** | clean (only a transitive `proc-macro-error2` future-incompat *note*, not a lint) |
| `npm run test:unit` (vitest run) | **0** | 8 files / **77 tests** pass |
| `npx vue-tsc --noEmit` | **0** | clean |
| `npm run lint:eslint` | **0** | colocation boundary rig green on the deep-import grammar |
| `npm run lint:knip` | **0** | error-level; no dead file/dep/export/type survives |
| `npm run lint` (**prettier `--check src/`**) | **1** | **RED** — 95 files flagged; see prettier gate |
| `npm run build` (`vue-tsc -b && vite build`) | **0** | 168 modules; index 157.29 kB, two solver.worker chunks |
| `node scripts/check-prod-shake.mjs` | **0** | 7 chunks; 3 dev-only symbols proven absent |

## Component gates — born RED at HEAD → GREEN (prettier excepted)

| Gate | Probe (verbatim) | HEAD (RED / today-value) | Now |
|---|---|---|---|
| dead-surface | `grep -rnE 'generateGridPaths\s*\(' web/frontend/src`; `grep -rn DrawInPreset\|TextureConfig\|BoardSize src`; `npm run lint:knip` | `generateGridPaths` def-only (shipped every build); `DrawInPreset`/`TextureConfig` dead types + `BoardSize` + 5 export-only-dead present; knip warn-blind | **GREEN** — `generateGridPaths(` = **0** (def retired; one prose comment in `FutoshikiBoard.vue:93` remains, not a call/def). `DrawInPreset`/`TextureConfig` **gone**; `BoardSize` type gone (only a prose mention in `games/shared/types.ts:6`). `DEFAULT_BOIL_CONFIG`/`pickVariantIndex`/`InitSource`×2/`WobbleConfig`/`MultiPassConfig` folded to internal (no `export`). **knip exit 0** at error-level — any regrowth reds |
| barrels | `grep -rnE "from '@pencil/(grid\|chrome)'" src`; `ls src/pencil/{grid,chrome}/index.ts`; `npm run lint:eslint` | 2 barrel sites (grid) + 8 (chrome), 10+ re-exports unconsumed — a live dual path | **GREEN** — barrel imports = **0**; both `index.ts` **deleted**; no `@pencil/{grid,chrome}` bare alias. One deep-import grammar; **eslint boundary green** (`lint:eslint` exit 0) — it now gates the deep imports directly and surfaces no latent crossing the barrels had masked |
| orphan-defs | `grep -rnE 'id=["'"'"'](grain-outline\|wobble-logo)' src`; P4 check test in `SvgFilters.test.ts` | W13 P4 "no orphan base defs" BROKEN — `grain-outline` + `wobble-logo` base defs orphaned | **GREEN** — no base-def element emitted for either (suppressed via `baseDef !== false`, `SvgFilters.vue:41,62`). **P4 check test present** — `SvgFilters.test.ts:35` "emits NO orphan base def — P4: every base def id has a consumer"; unit suite green. Pose-count hardcode reconciled to the single source (see X-lane reconciliations) |
| solver-seam | `ls src/games/{sudoku,futoshiki}/solver/classifyError.ts`; `ls src/games/shared/solver/`; import grep | `classifyError.ts` code-body byte-identical across the game boundary (dual path) + transport byte-twins | **GREEN** — per-game `classifyError.ts`/`describeError.ts`/`solverError.ts` **deleted both sides**; single-sourced in `games/shared/solver/` (`classifyError`, `describeError`, `solverError`, `protocol`, `transport`). Both games import `@games/shared/solver/*`; game-divergence (board shape, budget) kept per-game per `shared/types.ts:6` |
| worker-respawn | `transport.test.ts`; `switch (req.kind)` in `solver.worker.ts` | sticky memoized-init rejection poisons the singleton — every subsequent solve rejects against the dead worker; no typed request guard | **GREEN** — mechanism moved to `games/shared/solver/transport.ts` (factory-injected worker). `transport.test.ts`: **retire-singleton + re-instantiate** (`:54`), **bounded cap → `WORKER_FAILURE` with no further respawn** (`:73`), **budget resets on success** (`:97`). `switch (req.kind)` typed guard present — sudoku `:60` (ping/solve/propagate/generate + default), futoshiki `:43` |
| parseInt | `?board=…5.<25 zeros>.0-1abc`; `useUrlState.test.ts` | `parseInt(ab[0/1],10)` drops trailing garbage — the pair `[0,1]` decodes (`useUrlState.ts:144-145`), asymmetric with the strict size guard | **GREEN** — strict `/^\d+$/` on **both** endpoints (`useUrlState.ts:189`), uniform with the size guard (`:156`). Test `useUrlState.test.ts:97` "rejects a pair endpoint with trailing garbage (strict `/^\d+$/`, SEC-4)" covers `0-1abc`, `1abc-0`, `0- 1`, `0-+1`, `0-0x1` |
| mod-rs | `find csp-solver/src -name mod.rs \| wc -l`; `find . -name clippy.toml`; clippy | **10** `mod.rs`; no `clippy.toml`; nothing enforces self-named files | **GREEN** — `mod.rs` = **0** (10 flipped to self-named `foo.rs`; the `.rs` siblings are the new untracked files). Lint locked in `Cargo.toml:57` `[workspace.lints.clippy] mod_module_files = "deny"`; `cargo clippy -D warnings` exit 0. **Spec divergence, banked**: the wave named `self_named_module_files`; on this toolchain (clippy 1.97) that lint is *inverted* — it REQUIRES `mod.rs`. The correct lint to BAN `mod.rs` is `mod_module_files`; X3 used it and documented the inversion at `Cargo.toml:49-56`. Intent honored, name corrected |
| filtertuner | `node scripts/check-prod-shake.mjs`; grep fresh `dist/assets/*.js` | `FilterTuner`/`rafInstrumentation`/`schedulerDebugInfo` = 0 in prod bundle today (correctly DEV-gated) — but nothing standing keeps it so | **GREEN** — prod-shake script exit 0 ("3 dev-only symbol(s) absent"); independent grep of the **fresh `dist/`** I built = **0 leaks**. Proven, not excised; the assert now rides the estate (`test:prod-shake`, CI `ci.yml:569`) |
| prettier | `find . -name '.prettierrc*'`; `npm run lint` | no config anywhere; `"lint": "prettier --write src/"` rewrites the 2-space tree to 4-space via `~/.prettierrc` global shadow | **RED — does NOT close.** `.prettierrc.json` committed (`printWidth 88`, `tabWidth 2`, tailwind plugin) and `lint` re-pointed to `--check` (non-destructive) + CI-wired (`ci.yml:492`) + `prettier-plugin-tailwindcss` off knip's ignore — **but `npm run lint` exits 1 on 95 files**. See root-cause + required decision below |
| residue | per-item greps | 5 warts live | **GREEN (5/5)** — `.gitignore` wasm-morph line **removed**; `.mypy_cache/` **added** (`.gitignore:5`); `test_wheel_contracts.py` dangling docstring **retrued** (no "not exercised end-to-end below"); `.env.example` = real contract (`PYTHONPATH=.` + do-not-set-PORT guidance, `FRONTEND_PORT=9121` dropped); `ci.yml` "RED until W1" annotations **struck** |
| parity | targeted e2e; visual goldens | — | **GREEN** — 18/18 targeted e2e; 3/4 goldens byte-clean, the 4th a pre-existing soul-floor flake (below). Dedup + worker + parseInt are behavior-preserving |

## The prettier RED — root cause + required decision

The wave's own residual-risk clause warned it: *"a first `--check` run will flag the tree … pin the config to the tree's actual style … the repo is authored 2-space."* **That premise is false for the committed `src/` tree.**

- The `src/` tree is **long-standing 4-space, double-quote, semicolon** — not 2-space. `pencilConfig.ts:7` is 4-space-indented at working-tree HEAD **and** at T4-W0 (`429e7983`) **and** at the T3 seal (`bbeb2b87`); `useUrlState.ts:156` at HEAD reads `return { status: "invalid" };` (double-quote + semi). The global-shadow reformat the DISEASE describes already landed and was committed *weeks* ago; only the repo-root config files (`vite.config.ts`, `eslint.config.js`) are 2-space/single-quote/no-semi.
- The committed `.prettierrc.json` pins `tabWidth: 2` and omits `singleQuote`/`semi` → prettier defaults to double-quote + semi + 2-space. Against the 4-space tree that reds **95** files (`npm run lint` exit 1). Adding `singleQuote:true, semi:false` via CLI still reds **79** (the dominant mismatch is indentation, 4→2).
- **No single config greens `--check` without a `prettier --write src/` reformat.** The two coherent closures both need a team-lead call: **(A)** honor the DECIDED target (2-space/single-quote/no-semi, matching the root config files) and `prettier --write src/` — a ~95-file revert of long-committed formatting; or **(B)** pin to the tree's real 4-space — which the wave text explicitly forbids ("NOT the global shadow's 4-space"). Since closure requires a mass reformat that only the team-lead commits, and the correct target is a genuine style decision the tree's reality contradicts the spec on, verify does **not** unilaterally reformat. **Outstanding for X3/team-lead.**

Everything else on the prettier row is done and correct: config committed, `lint` = `--check`, CI step wired (`ci.yml:492-494`), plugin dropped from `knip.json` ignore (knip exit 0 confirms the plugin resolves via its prettier-config load site, not flagged dead). Only the tree-vs-config indentation reconciliation is open.

## π invariant — the excision rendered nothing

No rendered-pixel surface by design; the invariant is byte-identical render + green e2e. Verified against a private `vite preview` of the fresh `dist` on **:4162** (416x convention; **3000/3001 never touched** — 3001 was pre-occupied by another lane and left alone), `PLAYWRIGHT_BASE_URL` override so neither config spawned a dev server.

- **Visual goldens** (`playwright-golden.config.ts`, compare-only, **no** `--update`): **3/4 byte-clean pass** deterministically — `cell-light`, `grid-corner-light`, `logo-light`. The 4th, `toggle-crest-dark` (the W13 celestial soul golden, SSIM floor 0.983 / 1.7%), **failed the first run at ratio 0.03, then passed 3/3 re-runs** — a raster-noise flake straddling the tight soul floor, exactly the run-to-run feTurbulence jitter the config header documents for this surface. **Proven not an excision effect**: the toggle's render inputs are byte-identical to HEAD — `CELESTIAL_POSE_COUNT` resolves to **4** (`wobble-celestial.offsets` has 4 elements), the exact literal it replaced; pose-0 rest geometry is unchanged; the `SvgFilters.vue` diff only suppresses the orphan `grain-outline`/`wobble-logo` base defs (neither referenced by the toggle) and drops retired `!p.texture` guards, leaving `wobble-celestial`'s base + 4 pose defs untouched.
- **Targeted e2e**: `permalink` (7) + `share-truth` (5) + `sudoku-interaction` (6) = **18/18 pass** on the preview (same specs + same `global-setup.ts` assert-the-SPA gate as `playwright.config.ts`; only the forbidden :3000 webServer dropped via an ephemeral in-frontend config, deleted after). Confirms the solver-seam dedup + worker respawn + parseInt are behavior-preserving through the real interaction/permalink/share flows — the codec still fails closed, the worker still surfaces `WORKER_FAILURE`.

## X-lane reconciliations

- **X1 (dead surface / barrels / defs / knip)** — clean. All dead surface retired; both barrels + their `index.ts` gone; orphan defs suppressed with the P4 check test; `knip.json` at error-level, `prettier-plugin-tailwindcss` dropped from ignore. Knip green.
- **X2 (solver-seam / worker / parseInt)** — clean. `classifyError`+transport single-sourced in `games/shared/solver/`; bounded-respawn in the shared transport with full test coverage; `switch(req.kind)` guard both workers; strict `/^\d+$/` parseInt with the `0-1abc`+4 test. Note: X2 authored its `useUrlState.ts` edits in the tree's ambient **double-quote/semi** style — consistent with the committed tree, and a corroborating datum for the prettier root-cause (the tree is not 2-space/single-quote).
- **X3 (mod.rs / prettier / prod-shake / residue)** — **one spec-name correction + one open item**. mod.rs flip is correct and locked via `mod_module_files` (not the spec's inverted `self_named_module_files` — documented at `Cargo.toml:49-56`). prod-shake script + residue sweep all green. **Prettier is incompletely executed** — config committed + `lint` re-pointed + CI wired, but the config omits `singleQuote`/`semi` and the 4-space tree was never normalized, so `--check` reds 95 files (see prettier RED above). This is X3's open item.

## W2-handoff done-list confirmation

W4's retirements depend on W2's gate work being live; confirmed at this HEAD:
- **knip `exports`/`types` at error** — `knip.json:18-21` (`exports`/`nsExports`/`types`/`nsTypes` = `error`). The dead-surface gate bites on regrowth. ✓
- **barrels off `entry`** — no `pencil/*/index.ts` remains to be an entry; knip green with the deep-import grammar. ✓
- **eslint colocation boundary in CI** — `eslint.config.js` `no-restricted-imports` boundary rig (pencil↮games, sudoku↮futoshiki, depth), run as `ci.yml:476` `npm run lint:eslint`; green on the deep imports the barrels used to route. ✓
- **prod-shake assert rides the W2 estate** — `test:prod-shake` script + `ci.yml:569`. ✓

## Verification log

- Rust: `cargo test --workspace` / `cargo fmt --check` / `cargo clippy --workspace --all-targets -- -D warnings` → all exit **0**. `find csp-solver/src -name mod.rs` = 0; `mod_module_files = "deny"` live.
- Frontend gates: `test:unit` 77/77, `vue-tsc --noEmit` clean, `lint:eslint` 0, `lint:knip` 0, `build` 0, `check-prod-shake.mjs` 0. `npm run lint` (prettier `--check`) **exit 1 / 95 files** — the one RED.
- π: goldens 3/4 byte-clean (`toggle-crest-dark` flake: 1 fail @0.03 then 3/3 pass — raster noise, render inputs proven byte-identical); targeted e2e **18/18** on `:4162` preview.
- Hygiene: private preview on `:4162` only, torn down (exit 143 = SIGTERM); `:3000` free throughout, `:3001` (pre-occupied) untouched; the ephemeral e2e config deleted — `git status` shows no verify artifact in the tree; no main-repo commit (team-lead-only).

## Outstanding for seal

1. **prettier (blocking the headline "prettier repo-pinned, plugin live")** — decide canonical `src/` style and reconcile config↔tree. Recommended: add `"singleQuote": true, "semi": false` to `.prettierrc.json` (match the root config files the wave cites) and run `prettier --write src/` once to normalize the tree to 2-space; then `npm run lint` greens. This is a ~95-file reformat that only the team-lead commits.
2. **toggle-crest-dark soul-floor flake** (pre-existing, not W4) — the 1.7% floor doesn't fully absorb this machine's feTurbulence raster noise; a reviewed re-mint or a marginally looser soul floor would de-flake it. Books to the golden-fidelity owner, not this excision.

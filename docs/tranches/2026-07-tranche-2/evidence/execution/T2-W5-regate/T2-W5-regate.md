# T2-W5 re-gate — previously-red rows + defect check

2026-07-10, Apple M5 Max, quiet box (pgrep `cargo bench|criterion` empty before every timing run). Method parity: the failed gate's harness verbatim (`../T2-W5-gate/harness/{trace-size,gate-lib,serve,shots}.cjs`, byte-identical copies), same ports (4310 before / 4311 after), same board injection, same 9×9→16×16 size-switch scenario, 1280×900 light.

## Builds

- **after** — the full working tree (wave + all repair lanes), `npm ci` at the working lockfile (pencil-boil 0.7.0).
- **before** — same-session HEAD baseline: `git stash push -- web/frontend` → `npm ci` (HEAD lockfile, pencil-boil 0.6.0) → build → snapshot → `git stash pop` → `npm ci` back. Tree verified restored (28 modified + fonts untracked, diffstat identical pre/post).
- **wasm pkg**: `csp-solver/wasm/pkg` on disk is currently a **bundler-target** build (the concurrent Rust wave's twiggy-style output — no default init; `vue-tsc` fails against it). Both sides were built against a freshly built **lean web-target** pkg (`wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --out-dir <scratch> --no-default-features`, isolated `CARGO_TARGET_DIR`, zero writes to `csp-solver/**`), 87,763 B `.wasm` — the exact T2-W3 stable-toolchain lean measure. Same pkg on both sides, so the before/after delta isolates the frontend diff.

## Row table

| Row | Result | Numbers |
|---|---|---|
| Size-switch | **GREEN — the −60/−50 class is RESTORED** (R3's fix, verified holding in the full tree) | DPR2: before 1375.1/1334.3/1313.4 ms raster (mean 1340.9) → after 328.9/290.5/291.6 (mean 303.7) = **−77.4%** (pairs −76.1/−78.2/−77.8). DPR4: before 1330.4/1319.4/1326.7 (mean 1325.5) → after 287.9/301.8/296.5 (mean 295.4) = **−77.7%** (pairs −78.4/−77.1/−77.7). All 12 runs settled=true. Failed gate had −46/−49% (before 1241–1290 → after 648–710). |
| e2e | **GREEN** | `npx playwright test` → **18 passed (9.4s)**, 0 failed — run against the production after dist served at :3000 (the dev-server path can't serve the scratch-linked wasm pkg through `fs.allow`; `reuseExistingServer` picked up the static server). |
| wasm emission | **GREEN** | `dist/assets/csp_solver_wasm_bg-DzB38I0d.wasm` = **87,763 B** separate asset (~87.5 kB class, gzip 39.38 kB); `grep -l "data:application/wasm" assets/*.js` → **0** files (workers not inlined — two separate `solver.worker-*.js` assets, 10.14 kB + sibling); woff2 emitted: firacode 3,624 B / fraunces 9,772 B / patrickhand 3,840 B. |
| Soul spot-check | **GREEN — no new drift** | New after shots vs the gate's archived after shot, per theme (shots.cjs verbatim, 16×16 settled, board clip @DPR2): light **cross_max 1.0** (byte-identical best pair), cross_min 0.97338 == established self-band min (0.97338); dark **cross_max 1.0**, cross_min 0.97369 == self-band min (0.97369). Both entirely inside the boil-cycle self-band — the repairs didn't move the settled board a pixel. |

## R3's finding, verified

R3's raster hunt localized the residual to the transition layer still carrying `filter="url(#grain-static)"` while `pathsVisible` — the erase animator paid a full-board re-raster per frame through the whole size-switch. Its fix (in the tree at `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`) drops grain-static from the transition `<g>` entirely; the settled look is owned by the pre-baked steady siblings. R3's isolated numbers (head ~1344–1528 → fixed ~324–346) reproduce here in the full tree: after-side raster 288–329 ms across both DPRs. The class isn't merely restored, it's exceeded — no inherent-residual carve-out needed.

## Files

- `before-d{1..3}` / `after-d{1..3}` — DPR2 interleaved pairs (trace summaries)
- `before-x{1..3}` / `after-x{1..3}` — DPR4 interleaved pairs
- `ssim-{light,dark}-vs-gateafter.json` — soul cross stats vs the gate's after archive

## Follow-up for the Rust wave / integrator

`csp-solver/wasm/pkg` must be regenerated `--target web` (lean: add `--no-default-features`) before any frontend build or dev session — the bundler-target pkg currently on disk breaks `vue-tsc` (`init` has no call signatures) and the dev-server wasm fetch. The frontend's `node_modules/@mkbabb/csp-solver-wasm` symlink was restored to `../../csp-solver/wasm/pkg` after this re-gate.

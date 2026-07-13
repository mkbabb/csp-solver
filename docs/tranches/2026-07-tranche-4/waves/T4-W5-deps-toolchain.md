# T4-W5 — Deps + toolchain currency

**The currency wave: kill the one live CVE, close the two-major TypeScript lag, pin the toolchain the manifests never declared, and true the wasm build recipe to the one the ship actually runs.** The Rust/wasm dep set is already exact-latest across the board — this wave's Rust work is recipe-truth and a supply-chain tripwire, not upgrades. The JS side carries the only live advisory (a postcss XSS kept alive by a stale vue pin in pencil-boil) plus a manifest that documents its own npm≥11 requirement nowhere in the tree. Modern-facility adoptions ride only where they delete code; `defineModel` is W10's.

**Dependencies**: ← W4 (the excision settles the surface these bumps typecheck against). **Effort**: S–M.

---

## Scope

### The live postcss CVE — pencil-boil vue → 3.5.39 (FAM-4 / F1, P1)

`pencil-boil` ships a **live moderate advisory**: `devDependencies.vue: "^3.5.0"` resolves to **3.5.29**, whose `@vue/compiler-sfc@3.5.29 → postcss@8.5.8` trips GHSA-qx2v-qp2m-jg93 (PostCSS XSS via unescaped `</style>`, fixed in postcss ≥8.5.10). The frontend itself is clean (`npm audit` → 0; it resolves vue 3.5.39 already) — the exposure is pencil-boil's lockfile alone, and any downstream that lints/builds its SFC path inherits it.

- **Fix**: bump pencil-boil's `vue` devDep to **3.5.39** (latest; its compiler-sfc pulls postcss ≥8.5.10) and refresh the lockfile. **Seam with W1**: W1 cuts pencil-boil 0.9.0 (the raster feature + release-flow fix); the CVE-clearing vue bump folds into that 0.9.0 cut if it hasn't shipped, else a 0.9.1 currency bump — either way the frontend takes it as a one-range lockfile step.
- Probe: `cd /Users/mkbabb/Programming/pencil-boil && npm audit` (`postcss <8.5.10 moderate 1 vulnerability`) / `npm ls postcss`.

### TypeScript 7, both repos (FAM-4 / F2, P2)

- **frontend** `package.json:34` `"typescript": "~6.0.3"` → installed **6.0.3**, latest **7.0.2**. The tilde pins the major OUT — it will never float to 7.x.
- **pencil-boil** `package.json:37` `"typescript": "^5.7.0"` → installed **5.9.3** = **two majors behind**. The library type-checks its published raw-TS source under 5.9 while the frontend that consumes those same files checks them under 6.0 — an author/consumer skew.
- **Fix**: bump both to `^7.0.x`. TS 7 buys the Go-port native compiler (~10× typecheck throughput — directly relevant to `vue-tsc -b` in `build` and the CI typecheck lane). **Co-validate before landing**: `vue-tsc@3.3.7` + `typescript-eslint@8.63.0` against a `typescript@7` peer — TS majors tighten inference; the bump is gated on a clean `vue-tsc --noEmit` and a clean pencil-boil `npm run check` under TS 7.

### engines + packageManager, both packages (FAM-4 / F3, P2)

Neither package declares `engines` or `packageManager` (`node -e "…p.engines,p.packageManager"` → `undefined undefined` in each). Project memory records "npm ≥11 (npm 10 mis-resolves the lockfile)" and the npx-packument-OOM trap, yet the contract lives only in a memory ledger. A fresh clone on npm 10 / old Node hits exactly the mis-resolution with nothing to gate it.

- **Fix**: add to both `package.json`: `"engines": { "node": ">=24", "npm": ">=11" }` + `"packageManager": "npm@11.x"` (Corepack pins it hard). CI already runs node 24; the manifest catches up.

### cargo-audit / cargo-deny lane (FAM-4 / F4, P3)

No supply-chain advisory gate: `grep` for `audit/rustsec/deny` in `.github/workflows/ci.yml` → nothing; no `deny.toml`; `cargo-audit` not installed locally. The dep set is tiny and all-latest (low current risk) but there's no tripwire for a future RustSec against any of the ~11 crates.

- **Fix**: add a `cargo-audit` (or `cargo-deny advisories`) CI lane. Rides the W2 CI-DAG re-shape (a cheap advisory job, no build dependency).

### Makefile wasm target trued to the ship recipe (FAM-4 / F1-rust, P2)

`csp-solver/wasm/Makefile:8-10` `make wasm` = `wasm-pack build --target web --release --out-dir pkg` — drops `--no-default-features` (compiles the `assignment` feature + its serde/ndarray graph) and uses `--release` (opt-level default) instead of `--profile wasm-release` (opt-level `z`). Result: a **243,329 B** fat, wrong-profile, wrong-feature artifact that **silently overwrites the frontend-linked `pkg/`** (the frontend `file:../../csp-solver/wasm/pkg` dep) — 2.8× size, over the CI lean budget (fail >93 KB).

- **The real ship command** (T3-WGATE-ship + `ci.yml:393,454`): `wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features` → **86,746 B, byte-identical to the committed pkg**.
- **Fix**: retrue the Makefile `wasm` target to the ship recipe. **Extend (r2-cross-repo F4)**: `pkg/` is gitignored, so a fresh clone has no `pkg/` and nothing auto-builds it — the frontend `file:` link silently depends on this uncommitted, correctly-built artifact. Add the wasm build as a documented frontend prerequisite (a root build step or a `predev`/`prebuild` note pointing at the corrected `make wasm`), so the fresh-clone path resolves without prose-only guidance.

### Orphan pkg artifact + dead wasm-opt table (FAM-4 / F2, F3, P3)

- **`pkg/csp_solver_wasm_bg.js`** — a leftover from a prior `--target bundler` build; the current `--target web` emits no `_bg.js`. It declares `solveAssignmentCop`/`assignmentSentinel` exports **absent from the lean binary** (would `TypeError` if imported). `pkg/` is gitignored (local cruft) but stale and misleading — remove it; the corrected Makefile stops regenerating it.
- **`csp-solver/wasm/Cargo.toml:43-61`** — a dead `[profile.custom]` wasm-opt table + 14 lines of comment guarding an invocation path that cannot exist (`wasm-pack build --profile custom` → `error: profile 'custom' is not defined`; every real build uses `--profile wasm-release`, whose wasm-opt flags resolve from `.profile.release`). Excise the `custom` duplication and the "three-file atomicity / neither invocation path" rationale. Note `--enable-bulk-memory` is now redundant with rustc 1.97's default target features.

### Minor sweeps (FAM-4 / F4-js, P3)

- **eslint** frontend `^10.6.0` → 10.7.0 (floats on next install; cosmetic).
- **Stale wasm size figures** — the true builds are **lean 86,746 B / full-module 188,095 B**; the record states full as **222,436 B** (`docs/benchmarks.md:51`, `ci.yml:322`) and lean as "90,602 B" (`ci.yml:322`, T2 figure). The measurement is established here (reproduced byte-identical in r1-deps-rust + r2-cross-repo); the **figure corrections are doc-truth, homed in W14** — this wave supplies the numbers, W14 re-stamps the prose. (CI byte-budgets fail >240 KB full / >93 KB lean — both hold with headroom; no gate breaks.)
- **rust-toolchain** is `channel = "stable"` (the nightly pin was retired; memory/context still say "nightly" — stale, the tree is stable). No action beyond noting the context is stale for W14.
- **`.mypy_cache/` gitignore** — folded into W4's residue sweep (config-census P3), not re-done here.

### Deferred to W10 (facility adoptions that delete code)

- **`defineModel`** (F5, P3) — `grep -rn defineModel src` → 0; the ControlPanels hand-roll the `prop + emit("update:…")` pair `defineModel` collapses (`sudoku/ControlPanel/ControlPanel.vue:48,66`; `futoshiki/ControlPanel/ControlPanel.vue:53,60`). Rides **W10** (Vue idiom), where it deletes code alongside the easing-token and provide/inject work. Vapor is a forward-note only (the app is option-API-free but no `features.vapor` wiring) — banked, not adopted.

## Gates

| Gate | Value |
|---|---|
| Headline | pencil-boil `npm audit` = **0 vulnerabilities** (today: `postcss <8.5.10` moderate); both packages typecheck clean under TS 7 (`vue-tsc --noEmit` + pencil-boil `npm run check`); `make wasm` emits the **86,746 B** lean artifact byte-identical to the ship recipe (today: 243,329 B); engines/packageManager declared both; cargo-audit lane present |

Component checks (born RED at HEAD unless marked):

| Gate | Value (current failing probe → target) |
|---|---|
| postcss-cve | `cd pencil-boil && npm audit` = **1 moderate today** (`postcss <8.5.10` via vue 3.5.29) → 0 after vue → 3.5.39 + lockfile refresh |
| ts7-frontend | `npm outdated` = **typescript 6.0.3 → 7.0.2 today** (tilde pins the major out) → `^7.0.x`, `vue-tsc --noEmit` clean under the TS 7 peer |
| ts7-pencilboil | installed **5.9.3 today** (two majors behind) → `^7.0.x`, `npm run check` clean |
| engines | `node -e "…p.engines,p.packageManager"` = **`undefined undefined` both today** → `node>=24 / npm>=11` + `packageManager npm@11.x` both packages |
| cargo-audit | `grep -c 'audit\|rustsec\|deny' .github/workflows/ci.yml` = **0 today** → a `cargo-audit`/`cargo-deny` lane runs and gates |
| make-wasm | `make wasm && wc -c pkg/csp_solver_wasm_bg.wasm` = **243,329 B today** (fat, `--release`, default-features) → **86,746 B**, `cmp` byte-identical to `wasm-pack … --profile wasm-release --no-default-features` |
| fresh-clone | a fresh clone with no `pkg/` builds the frontend via a documented prerequisite (today: no `predev`/`prebuild` hook, no root Makefile — the `file:` link resolves against a directory a fresh clone lacks) |
| orphan-pkg | `ls pkg/csp_solver_wasm_bg.js` = **present today** (stale `--target bundler` leftover) → absent |
| dead-profile | `wasm-pack build --profile custom …` = **`error: profile 'custom' is not defined` today** → the `[profile.custom]` table (`Cargo.toml:43-61`) + its rationale comment excised |
| figures | true builds recorded (lean 86,746 / full 188,095) for W14's re-stamp; CI budgets still pass with headroom |

## π / DELTA

No rendered-pixel surface — dependency, toolchain, and build-recipe truth only. π/DELTA N/A; the invariant is that the shipped lean wasm is **byte-identical** before and after the Makefile fix (`cmp` = identical) and the frontend renders identically under the TS 7 typecheck (full e2e green, no behavior change).

## Seeds

- `r1-deps-js.md` F1–F7 — the postcss CVE via stale vue pin, the TS major/two-major lag, the undeclared engines/packageManager, the minor lags, defineModel-gap (→ W10).
- `r1-deps-rust.md` — the EXCELLENT currency verdict (all crates exact-latest), F1 Makefile 2.8× footgun, F2 orphan `_bg.js`, F3 dead `[profile.custom]`, F4 no advisory gate, F5 stale size figures; the modern-wasm posture (SIMD/threads correctly forgone).
- `r2-cross-repo.md` (b)/(c) — pencil-boil TS 5.9 + live postcss CVE reconfirmed at HEAD; the file:-link contract; F4 fresh-clone can't build without the manual wasm step; the 188,095 B full-module reproduction.
- `r2-pencil-boil-audit.md` §C4/§C5/§D3 — engines/packageManager gap, TS two-major skew, the 0.9.0 hygiene fold (vue bump, TS, engines).
- `families.md` FAM-4 — the dep-currency/toolchain family.

## Residual risks

- **The TS 7 bump is the wave's real risk** — majors tighten inference and `vue-tsc`/`typescript-eslint` must co-validate against the TS 7 peer before landing. If a peer lags, the bump holds at the last co-valid major with a named re-trigger (the peer's TS-7 release), not a forced landing that reds the typecheck lane.
- **The pencil-boil vue bump crosses the W1 seam** — if 0.9.0 has shipped by W5, the CVE fix is a 0.9.1 currency release + a frontend lockfile step; if not, it folds into the 0.9.0 cut. Either path is one range bump on the consumer; sequence W1 first so the raster feature and the currency bump don't collide in the release manifest.
- **The Makefile fix changes a developer-facing recipe, not the ship** — CI already builds correctly; the risk is a developer with muscle-memory `make wasm` who overwrote `pkg/` with the fat artifact. The gate's `cmp` byte-identity is the tripwire; the fresh-clone prerequisite closes the reproducibility hole r2-cross-repo F4 named.

---
**ADDENDUM (pre-exec perf audit, 2026-07-12)**: see README §7 — the rows stamped to this wave are binding scope; evidence at ../evidence/perf/.

---
## Execution record (2026-07-13)

Workflow `wf_c091f738-f17`, 4 lanes (D1 pencil-boil-0.9.1 · D2 frontend-TS7+engines · D3 wasm-recipe+audit · verify), all green.

| Gate | Born-RED | Close |
|---|---|---|
| postcss-cve | 1 moderate (postcss <8.5.10 via vue 3.5.29) | **0 vulnerabilities** — pencil-boil vue → 3.5.39 (postcss 8.5.18); **0.9.1 released** (`83de5eb`, tag v0.9.1, release.yml run 29227378112 success, npm live); frontend takes `^0.9.1` from the registry |
| ts7-pencilboil | 5.9.3, two majors behind | **^7.0.2 LANDED** — check + 126 proof assertions + proof:browser 4/4 green under TS 7 |
| ts7-frontend | ~6.0.3, tilde pins the major out | **HELD at 6.0.3, spec-sanctioned**: typescript-eslint 8.63.0 (and its canary) peer `>=4.8.4 <6.1.0` hard-blocks TS 7 (ERESOLVE reproduced); vue-tsc 3.3.7 is already TS-7-ready — the named re-trigger is a typescript-eslint release admitting ^7. The Go-port throughput claim stays UNMEASURED, not asserted |
| engines | undefined/undefined both | `engines {node>=24, npm>=11}` + `packageManager` declared both packages (the npm-10 lockfile trap finally in-manifest) |
| cargo-audit | no advisory gate | Lane 11 added (independent, no `needs:`); locally green — 0 vulnerabilities/121 deps (2 informational unmaintained: bincode 1.3.3, proc-macro-error2 2.0.1) |
| make-wasm | 243,329 B fat/wrong-profile (born-RED reproduced at 268,196 B) | the EXACT ship recipe; `cmp` byte-identical to the CI control, **86,734 B sha 42e6e32c** |
| fresh-clone | file: link dangles, prose-only guidance | `prebuild` → `npm run wasm` → `make -C csp-solver/wasm wasm` (single-sourced recipe; deliberately no `predev` — it would clobber the CI e2e lane's downloaded artifact); simulated pkg-absent clone builds green |
| orphan-pkg / dead-profile | `_bg.js` present; a "dead" wasm-opt table | `_bg.js` gone; **SPEC INVERSION proven**: wasm-pack 0.15 reads `--profile wasm-release`'s wasm-opt flags from the literal `.profile.custom` metadata key — `.custom` is LIVE (removing it regresses +762 B), `.profile.release` was the dead twin (excised); `--enable-bulk-memory` retired **byte-neutral** (README §7 disposition confirmed); final Cargo.toml rebuilds byte-identical |
| figures (W14 handoff) | stale 222,436/90,602 in prose | measured true: lean **86,734 B** / full **188,087 B** (12/8-byte toolchain drift vs the spec's cited values); CI budgets hold with headroom |
| parity (π) | — | wasm byte-identical pre/post (the invariant); goldens 4/4 at seal; full battery green (cargo test/fmt/clippy/audit; vue-tsc, 77 units, eslint, knip, lint, build) |

Seal reconciliations: the generated `templates.ts` can never stay prettier-formatted (the vite plugin regenerates it single-line every build — the W4 normalization's one file that wouldn't hold) → `.prettierignore` row added, `npm run lint` green regardless of build order. `packageManager: npm@11.x` is a range (Corepack wants exact) — accepted as the spec's literal; exact-pin is a one-line follow-up if Corepack enforcement is ever wanted. New standing trap ledgered: stale `tsconfig.tsbuildinfo` can phantom-error `TS2307 @mkbabb/csp-solver-wasm` after dep churn — clear with `vue-tsc -b --force`.

# A3 — Prompts Recap (tranche-1 grand-uplift) vs HEAD

Source of record: `docs/tranches/2026-07-grand-uplift/appendices/B-prompt-recap.md` (the
tranche-1 coverage matrix — every historical mandate + the 2026-07-04/05 ratifications/edict +
the OD-1..OD-8 owner-decision ledger). Verified against HEAD = `3b75eca2` (T2-WGATE,
"re-certification ... 98.2%"), 347 commits, working tree `git status` matches the prompt
(uncommitted diffs belong to a concurrent pass-1 lane, not consulted as ground truth here).

Tranche-2 (`7c245bed..3b75eca2`, 10 waves) landed *after* tranche-1 and is the operative state.
Its headline moves bear directly on tranche-1's asks: **T2-W2 abrogated the FastAPI service
entirely** ("the server, docker, and nginx go; wasm is the product" — `98fe2562`), and **T2-W7
folded every `CLAUDE.md` into `README.md`** (`ede25188`). Both invalidate specific tranche-1
rows below.

## Method
For every row in the B-appendix matrix I checked the HEAD filesystem/git-log for the artifact
the row's "Status after this tranche" column named, and classified: **SURVIVAL** (present,
correct, as specified), **REGRESSION** (was discharged, has drifted/broken since), or
**OBSOLETED** (the ask itself no longer applies because a later ratification changed the
premise — cited to the tranche-2 commit/decision that did it).

---

## 1. Historical mandates (R1–R13, M1–M5, D1–D2, G1, C1–C2)

| # | Ask (tranche-1 discharge) | HEAD verdict | Evidence |
|---|---|---|---|
| R1 | Port solver Python→Rust, isomorphic API (W1: py/ tree, typed exceptions) | **SURVIVAL, narrowed** | `csp-solver/src/py/{config,csp,enums,errors,futoshiki_api,sudoku_api,mod}.rs` present; `csp-solver/tests-py/` (4 wheel-contract tests) rehomed off web/api by T2-W2 (`98fe2562`: "Rehomed: the 4 wheel-contract tests -> csp-solver/tests-py"). CI still runs `py-compile`+`py-runtime` lanes (`.github/workflows/ci.yml:116,159`). The "isomorphic API" half of the ask is **moot**: there is no API left for the bindings to be isomorphic with (see OBSOLETED table) — MEMORY.md's T2 binding override names this explicitly: "conditional python-server abrogation (keep py bindings)". |
| R2 | Devirtualize constraint dispatch; W2 decides Lambda WIRE-or-EXCISE | **SURVIVAL** | `csp-solver/src/constraint/dispatch.rs:13-16`: "There is deliberately no `Lambda` variant... A devirtualized `Lambda` arm carried zero [benefit]" — the enum arm is EXCISED; `LambdaConstraint` (constraint/lambda.rs) survives as a `dyn Constraint` routed through `Custom`, matching the WIRE-not-remove half of the decision. |
| R3 | No god modules (>500 L); `lib.rs`/`isomorphic.rs` splits, `search.rs`(507)/`gac/mod.rs`(470) flagged-not-actioned | **REGRESSION (gac/mod.rs)** | `csp-solver/src/lib.rs` = 41 L (split held). `csp-solver/wasm/src/isomorphic.rs` = 460 L (under budget, split held). `csp-solver/src/solver/search.rs` = 504 L — flat vs. the 507 baseline, still the accepted flagged exception. **`csp-solver/src/solver/gac/mod.rs` = 555 L — up from the tranche-1-cited 470, and now *past* the >500 L threshold it was previously under.** `git show ed07ba6b --stat` (T2-W3, "substrate excised @0.3.0, L26 beats + Q9 battery") shows `gac/mod.rs \| 103 ++-` — the L26/Q9 battery work landed in-module rather than as a further split. This is a genuine drift against the standing R3 precept, not itself re-litigated by any T2 wave. |
| R4 | No test files in src/; HELD exception `error.rs` 16-line `mod tests` | **SURVIVAL, tightened (exception revoked)** | `grep -n "#\[cfg(test)\]\|mod tests" csp-solver/src/error.rs` → zero hits; the file is 132 L with no inline test module. The tranche-1 HELD exception is gone — consistent with MEMORY.md's T2 binding override "tests/ only (no inline)", which is *stricter* than tranche-1's carve-out. Net: the underlying precept holds even harder than authored. |
| R5 | Delete legacy Python solver (docs) | **SURVIVAL** | No Python solver source anywhere in-tree; `web/api` (its consumer) is gone too (T2-W2). |
| R6 | `web/` restructure | **SURVIVAL, narrowed** | `web/` now contains only `frontend/` (`ls web` → `frontend`); `web/api` and `web/nginx` were excised whole by T2-W2, not merely restructured. |
| R7 | Fail explicitly, no silent handling | **not re-audited this lane** | Appendix A is the item-by-item discharge map; out of scope for this recap-survival pass — flagging for a dedicated correctness lane rather than asserting unverified status. |
| R8 | Decouple pencil UI from CSP domain (W7: ESLint boundary blocks) | **SURVIVAL, reinforced** | `web/frontend/src/pencil/` + `web/frontend/src/games/{sudoku,futoshiki}/` both present; `@pencil/*`/`@games/*` aliases live in `tsconfig.json:18-19` and `vite.config.ts:111-112`; `eslint.config.*` carries three `no-restricted-imports` blocks. T2-W8 (`c14995eb`, "grand recursive colocation — per-game solver/ modules, manifest total") extended this further. |
| R9 | PRM across all animation loops (W8 scheduler; W12 pencil-boil upstream) | **SURVIVAL, advanced** | `web/frontend/package.json`: `"@mkbabb/pencil-boil": "^0.7.0"` — past the tranche-1-cited `^0.6.0`, via T2-W5 (`49506bf8`, "pencil-boil 0.7"). |
| R10 | Shared skin → pencil-boil, never glass-ui; zero `backdrop-filter` (OD-1 default) | **SURVIVAL** | `grep -rln "backdrop-filter" web/frontend/src` → zero hits repo-wide. |
| R11 | COP support (B&B) | **not re-audited this lane** — no HEAD-contradicting signal found; out of scope. |
| R12 | wasm bindings solver+morph (W11: morph → own repo) | **SURVIVAL, completed past tranche-1's plan** | Tranche-1's W11 called for an interim `morph-wasm/` directory rename inside this workspace (OD-3) before full excision. At HEAD, morph is fully gone from this repo: `Cargo.toml:2-4` — "morph-core + wasm-morph were excised to github.com/mkbabb/morph (W11/W12)"; tag `pre-morph-excision` exists (`git show-ref` confirms `refs/tags/pre-morph-excision`); `csp-solver/wasm` (the surviving wasm crate) carries no morph dependency. No `morph-wasm/` directory exists in-tree — the excision went straight to the sibling repo, superseding the intermediate rename step OD-3 recommended (see OBSOLETED table). |
| R13 | Publish to @mkbabb suite (W12 republish) | **SURVIVAL, advanced** | `csp-solver/Cargo.toml`: `version = "0.3.0"` (T2-W3, `ed07ba6b`), past the tranche-1-landed 0.2.0. `csp-solver/wasm/Cargo.toml` still `0.2.0` (no T2 wasm-crate version bump found). |
| M1/M1b/M1c | pencil-boil spec+lock migration | **SURVIVAL, advanced** | Same evidence as R9 — `^0.7.0` present, T2-W5. |
| M2 | pencil-boil reactive-PRM teardown | **not independently re-checked**; `^0.7.0` bump implies continued upstream work but the specific teardown wasn't traced. |
| M3 | Controls-LEFT | **HELD (no regression signal)** — not independently re-verified visually this lane. |
| M4/M4b | Sun mascot / roadmap — parked at tranche-1, `useCelestialSun` gate failed | **SURVIVAL (still parked)** | `web/frontend/src/pencil/config/pencilConfig.ts:83-88`: "Mascot palette... Prerequisite for the M4 `useCelestialSun()` lift into pencil-boil — the mascot can't ship to the shared lib with its palette in one consumer's template... this lane lands the config authority only." Config-only landed; the lift itself remains un-shipped, consistent with tranche-1's "parked" disposition — no regression, no further progress either. |
| M5/M5b | DNS tuple / headers (W5 + OD-4) | **SURVIVAL, executed twice over** | Tranche-1 landed the CNAME deletion (commit `d43fae28`, "deploy: OD-4 executed + full Pages cutover"). T2-W2 went further and decommissioned the API box entirely: "api.sudoku.babb.dev A record deleted, NXDOMAIN at CF NS; sudoku.babb.dev static 200. OD-4 closed." (`98fe2562`). |
| D1 | Docs isomorphic with code (W13 gate: every number traces) | **SURVIVAL, structurally changed** | See D2. |
| D2 | Root CLAUDE.md reflects web/ layout | **OBSOLETED — see below** | `CLAUDE.md` no longer exists anywhere in the repo (`find . -iname CLAUDE.md` → zero hits outside `.claude/worktrees/*` sibling-lane copies); `git log -1 -- CLAUDE.md` → `ede25188 T2-W7: docs + record — CLAUDE.mds folded to READMEs, MIT, the tranche record`. Tranche-1's own discharge target ("CLAUDE.md files go pithy," W13) was itself superseded by T2-W7's stronger move (fold-and-delete, not pithy-and-keep). NOTE: the CLAUDE.md content quoted in this session's system context (`web/frontend/CLAUDE.md`, root architecture doc, etc.) does not correspond to any file on disk at HEAD — it reads as stale/cached context, not the live tree. |
| G1 | No build artifacts tracked | **SURVIVAL** | `git ls-files \| grep -E "node_modules\|/dist/\|/target/"` → 0 matches. |
| C1 | Deferred extensions documented (appendix D re-books S1–S4) | **not independently re-checked this lane.** |
| C2 | CHANGELOG coverage | **SURVIVAL, advanced** | `csp-solver/CHANGELOG.md` carries `## 0.3.0 — 2026-07-10 (tranche-2, W3 — substrate excision)` above the tranche-1-landed `## 0.2.0 — 2026-07-06 (grand-uplift tranche, W1–W12)` and the original `## 0.1.0 — 2026-05-28`. |

---

## 2. 2026-07-04 ratifications

| Directive | Tranche-1 discharge | HEAD verdict |
|---|---|---|
| Deploy Option A **and** C, concomitant | W5 ∥ W6 | **OBSOLETED** — T2-W2 (`98fe2562`) abrogated Option A (the API origin) outright: "web/api (whole package), docker-compose trio, ... web/nginx" excised; "R1 box decommission ... csp-solver compose stack down + api-sudoku vhost disabled ... OD-4 closed." Only Option C (in-browser wasm) survives. The "concomitant A+C" ratification is void at HEAD by a later, explicit owner-sanctioned abrogation. |
| Legacy API host NXDOMAIN — owner infra action | OD-4/W5 | **SUPERSEDED-COMPLETE** — folded into the fuller T2-W2 decommission above; the original narrow ask (fix the NXDOMAIN host) is subsumed by deleting the whole API surface. |
| FastAPI kept as hardened reference | W4 (hardening) + W5 (the box) | **OBSOLETED** — no `web/api` directory exists at HEAD; nothing is "kept" as a reference deployment. Directly reversed by T2-W2. |
| Futoshiki = committed product wave | W10 | **SURVIVAL** | `web/frontend/src/games/futoshiki/` present (`FutoshikiGame.vue`, `FutoshikiBoard/`, `ControlPanel/`, `composables/useFutoshiki.ts`); `App.vue:16-19` wires it as a lazy `defineAsyncComponent`, selected in-app (see OD-8 below). |
| One coordinated cross-repo release window | W12 + OD-6 | **SURVIVAL** | `csp-solver/CHANGELOG.md:46` — `## 0.2.0 — 2026-07-06 (grand-uplift tranche, W1–W12)` is the dated, executed window; the date the tranche-1 OD-6 row left open was settled at 2026-07-06. |
| Delete dangling `api.csp-solver.babb.dev` CNAME | OD-4, verified in W5 | **SURVIVAL** — see M5/M5b above; re-executed/expanded in T2-W2. |
| NEVER push bbnf-lang origin | standing order | **not independently re-verifiable from this repo** — bbnf-lang lives outside this workspace; no evidence either way found here. |

## 3. 2026-07-05 edict

| Directive | Tranche-1 discharge | HEAD verdict |
|---|---|---|
| Recursive colocation, ALL dirs, both stacks | W1/W4/W6/W7 | **SURVIVAL, extended** — T2-W8 (`c14995eb`, "grand recursive colocation — per-game solver/ modules, manifest total") is a second, deeper colocation pass beyond tranche-1's. |
| Long-running flat dirs → encapsulated modules | census: none qualify | **not re-audited this lane.** |
| Animation layer = `src/pencil` (never "skin") | W7 | **SURVIVAL** — `web/frontend/src/pencil/` confirmed; no `?skin=` flag or `skin/` directory found. |
| `src/games/{sudoku,futoshiki}` via `@pencil`/`@games`; games import pencil, never reverse, never each other | W7 + W10 | **SURVIVAL** — aliases confirmed in tsconfig/vite config (§1 R8 evidence); ESLint boundary blocks present in `eslint.config.*`. |
| Git hygiene (untrack the 11,406) | W0 | **SURVIVAL** — zero tracked `node_modules`/`dist`/`target` paths at HEAD. |
| Morph renamed + excised per spec | W11 | **SURVIVAL, past the plan** — see R12 above; full excision to `github.com/mkbabb/morph`, not just the interim `morph-wasm/` rename. |

---

## 4. Owner-decision ledger (OD-1..OD-8)

| # | Decision | Recommended default (tranche-1) | HEAD verdict |
|---|---|---|---|
| OD-1 | Union final aesthetic — keep/drop dark-mode laminate rim | Ship no-`backdrop-filter` build; recover dark rim as static `box-shadow` | **SURVIVAL (no-backdrop-filter half); box-shadow-rim detail not located** — zero `backdrop-filter` hits repo-wide confirms the ship decision; a `grep -rn box-shadow` scoped to laminate/rim comments in `pencil`/`games` returned nothing, so the specific "static box-shadow" recovery could not be independently confirmed from source comments this lane — the feature area (`Laminate`, `hold-to-peek`) is present in `App.vue`, `useSudoku.ts`, `useFutoshiki.ts`, `FutoshikiGame.vue`, `ControlPanel.vue`. |
| OD-2 | `SvgFilters.vue` placement — `pencil/chrome/` vs bare `pencil/` | `pencil/chrome/SvgFilters.vue` | **SURVIVAL** — `find web/frontend/src -iname SvgFilters.vue` → `web/frontend/src/pencil/chrome/SvgFilters.vue`, exact match. |
| OD-3 | Morph npm-name confirmation — `morph-wasm/` directory rename, package name frozen | Directory-only rename; freeze package name; CI `jq` guard | **OBSOLETED-BY-COMPLETION** — the interim state OD-3 describes (a `morph-wasm/` directory still inside this workspace) never persists at HEAD; morph left the repo entirely (R12/edict rows above). The decision's *premise* (morph stays here under a renamed directory) is moot; its *spirit* (never silently rename the published package identity) is unfalsifiable from this repo alone since morph is no longer built here. |
| OD-4 | Cloudflare CNAME deletion | Delete now | **SURVIVAL, executed twice** — see M5/M5b. |
| OD-5 | API-box choice for Option A | Small always-on box (~$2–5/mo) | **OBSOLETED** — there is no Option A box anymore (T2-W2 decommission); the ask presupposes an API surface that no longer exists. |
| OD-6 | Release-window calendar commitment | Pick one after W7/W8 green | **SURVIVAL** — 2026-07-06, `CHANGELOG.md:46`. |
| OD-7 | The one-line bbnf-lang skinny edit authorization | Authorize; land locally in bbnf-lang | **not verifiable from this repo** — bbnf-lang is a separate workspace; no artifact here confirms or refutes the edit landed. |
| OD-8 | Futoshiki navigation shape — in-app selector vs router | In-app selector, no `vue-router` | **SURVIVAL, explicitly cited in code** — `web/frontend/package.json` has no `vue-router` dependency; `App.vue:16` literally comments `// OD-8 in-app game selector. Futoshiki's whole scene ... is async + v-if-gated below`. |

---

## Summary

- **Survivals dominate.** Every structural/naming/colocation/aliasing ask from tranche-1 either holds unchanged or was carried further by tranche-2 (pencil-boil version, morph excision depth, colocation depth, CHANGELOG, CNAME/DNS cleanup).
- **One concrete regression**: `csp-solver/src/solver/gac/mod.rs` crossed the R3 "no god modules >500 L" threshold (470 → 555 L) via T2-W3's L26/Q9-battery work landing in-module (`ed07ba6b`). Worth a tranche-III line item — split or re-flag with rationale.
- **Five OBSOLETED asks, all downstream of one decision** (T2-W2's server abrogation, `98fe2562`): "Deploy Option A and C concomitant," "FastAPI kept as hardened reference," OD-5 (API-box choice), and D2's original "root CLAUDE.md reflects web/ layout" framing (superseded by T2-W7's CLAUDE.md-to-README fold, `ede25188`) all presuppose a surface (API origin, CLAUDE.md files) tranche-2 explicitly removed with an owner-sanctioned rationale recorded in its own commit messages. OD-3's interim `morph-wasm/` directory-rename state is likewise skipped over — the excision went straight to completion.
- **Three asks unverifiable from this repo**: OD-7 and "NEVER push bbnf-lang origin" concern the external `bbnf-lang` workspace; not audited here.
- **Handful of rows not independently re-audited this lane** (R7, R11, C1, M2, M3, "long-running flat dirs" census) — flagged rather than asserted, since B-prompt-recap's own text for them was already terse and this lane's time budget prioritized the rows with a concrete, checkable HEAD artifact.
